const { Client, Databases, Storage } = require('node-appwrite');
const { Pinecone } = require('@pinecone-database/pinecone');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('langchain/textsplitters');
const { CohereEmbeddings } = require('@langchain/cohere');
const { PineconeStore } = require('@langchain/pinecone');

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

// Configuration
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTIONS = {
    DOCUMENT_STATUS: 'document_processing_status',
    DOCUMENT_CHUNKS: 'document_chunks',
    FILES: 'files'
};
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'sidchat';

/**
 * Update processing status in database
 */
async function updateStatus(docId, updates) {
    try {
        const statusDoc = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.DOCUMENT_STATUS,
            [`equal('docId', '${docId}')`]
        );

        if (statusDoc.documents.length === 0) {
            throw new Error(`No processing status found for document ${docId}`);
        }

        const statusId = statusDoc.documents[0].$id;
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.DOCUMENT_STATUS,
            statusId,
            updates
        );

        console.log(`✅ Status updated for ${docId}:`, updates);
    } catch (error) {
        console.error('❌ Error updating status:', error);
        throw error;
    }
}

/**
 * Save document chunks to database
 */
async function saveChunks(docId, userId, workspaceId, chunks) {
    try {
        const chunkPromises = chunks.map((chunk, index) => {
            return databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.DOCUMENT_CHUNKS,
                `chunk_${docId}_${index}`,
                {
                    docId,
                    userId,
                    workspaceId: workspaceId || null,
                    chunkIndex: index,
                    content: chunk.pageContent,
                    metadata: JSON.stringify({
                        pageNumber: chunk.metadata.pageNumber || 1,
                        section: chunk.metadata.section || 'unknown',
                        timestamp: new Date().toISOString(),
                    }),
                    createdAt: new Date().toISOString(),
                }
            );
        });

        await Promise.all(chunkPromises);
        console.log(`✅ Saved ${chunks.length} chunks to database`);
    } catch (error) {
        console.error('❌ Error saving chunks:', error);
        throw error;
    }
}

/**
 * Main document processing function
 */
async function processDocument(docId, userId, workspaceId, fileUrl, fileName, fileSize) {
    try {
        console.log(`🚀 Starting document processing for ${docId}`);

        // Update status to processing
        await updateStatus(docId, {
            status: 'processing',
            progress: 10,
            currentStep: 'Downloading document from storage...'
        });

        // Download file from Appwrite Storage
        const fileResponse = await fetch(fileUrl, {
            headers: {
                'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            },
        });

        if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${fileResponse.statusText}`);
        }

        const fileBuffer = await fileResponse.arrayBuffer();
        console.log(`📥 Downloaded file: ${fileName} (${fileBuffer.byteLength} bytes)`);

        // Update status
        await updateStatus(docId, {
            progress: 25,
            currentStep: 'Loading and parsing PDF document...'
        });

        // Load PDF document
        const loader = new PDFLoader(new Blob([fileBuffer]));
        const docs = await loader.load();
        console.log(`📄 Loaded PDF with ${docs.length} pages`);

        // Update status
        await updateStatus(docId, {
            progress: 40,
            currentStep: 'Splitting document into chunks...'
        });

        // Split document into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
        });

        const splitDocs = await splitter.splitDocuments(docs);
        console.log(`✂️ Split document into ${splitDocs.length} chunks`);

        // Update status
        await updateStatus(docId, {
            progress: 55,
            currentStep: 'Saving chunks to database...',
            totalChunks: splitDocs.length,
            processedChunks: 0
        });

        // Save chunks to database
        await saveChunks(docId, userId, workspaceId, splitDocs);

        // Update status
        await updateStatus(docId, {
            progress: 70,
            currentStep: 'Generating embeddings with Cohere...',
            processedChunks: splitDocs.length
        });

        // Initialize embeddings
        const embeddings = new CohereEmbeddings({
            apiKey: process.env.COHERE_API_KEY,
            model: "embed-english-v3.0",
            inputType: "search_document",
        });

        // Get Pinecone index
        const index = pinecone.index(PINECONE_INDEX_NAME);

        // Check if namespace already exists
        const { namespaces } = await index.describeIndexStats();
        const namespaceExists = namespaces && namespaces[docId];

        if (namespaceExists) {
            console.log(`⚠️ Namespace ${docId} already exists, clearing and recreating...`);
            // Clear existing vectors in namespace
            await index.namespace(docId).deleteAll();
        }

        // Update status
        await updateStatus(docId, {
            progress: 85,
            currentStep: 'Storing embeddings in Pinecone...'
        });

        // Store embeddings in Pinecone
        const pineconeStore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: docId,
                metadata: {
                    workspaceId: workspaceId || null,
                    docId,
                    userId,
                    fileName,
                    fileSize,
                    chunkCount: splitDocs.length,
                    processedAt: new Date().toISOString(),
                }
            }
        );

        console.log(`✅ Embeddings stored successfully in Pinecone namespace: ${docId}`);

        // Update status to completed
        await updateStatus(docId, {
            status: 'completed',
            progress: 100,
            currentStep: 'Document processing completed successfully',
            completedAt: new Date().toISOString(),
            totalChunks: splitDocs.length,
            processedChunks: splitDocs.length
        });

        // Update file status in files collection
        try {
            const fileDoc = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FILES,
                [`equal('fileId', '${docId}')`]
            );

            if (fileDoc.documents.length > 0) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.FILES,
                    fileDoc.documents[0].$id,
                    { status: 'completed' }
                );
            }
        } catch (error) {
            console.warn('⚠️ Warning: Could not update file status:', error);
        }

        console.log(`🎉 Document processing completed successfully for ${docId}`);
        return { success: true, message: 'Document processed successfully' };

    } catch (error) {
        console.error(`❌ Error processing document ${docId}:`, error);

        // Update status to failed
        try {
            await updateStatus(docId, {
                status: 'failed',
                currentStep: 'Document processing failed',
                errorMessage: error.message,
                completedAt: new Date().toISOString()
            });

            // Update file status
            const fileDoc = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FILES,
                [`equal('fileId', '${docId}')`]
            );

            if (fileDoc.documents.length > 0) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.FILES,
                    fileDoc.documents[0].$id,
                    { status: 'failed' }
                );
            }
        } catch (updateError) {
            console.error('❌ Error updating failed status:', updateError);
        }

        throw error;
    }
}

/**
 * Main function entry point
 */
module.exports = async function (req, res) {
    try {
        console.log('🚀 Appwrite Function: Document Processing Started');

        // Parse request body
        const { docId, userId, workspaceId, fileUrl, fileName, fileSize } = JSON.parse(req.body);

        if (!docId || !userId || !fileUrl) {
            throw new Error('Missing required parameters: docId, userId, or fileUrl');
        }

        console.log(`📋 Processing request for document: ${docId}`);
        console.log(`👤 User: ${userId}`);
        console.log(`🏢 Workspace: ${workspaceId || 'default'}`);
        console.log(`📁 File: ${fileName} (${fileSize} bytes)`);

        // Process the document
        const result = await processDocument(docId, userId, workspaceId, fileUrl, fileName, fileSize);

        console.log('✅ Function execution completed successfully');

        return res.json({
            success: true,
            message: 'Document processing completed',
            data: result
        });

    } catch (error) {
        console.error('❌ Function execution failed:', error);

        return res.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, 500);
    }
};
