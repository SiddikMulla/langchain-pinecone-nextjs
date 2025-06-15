// import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
// import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from '@langchain/pinecone'
// import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDatabases } from "./appwrite-admin";
import { auth } from "@clerk/nextjs/server";
// import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
// import { ChatOllama } from "@langchain/ollama";
import { CohereEmbeddings } from "@langchain/cohere";
import { databases } from "./appwrite-client";
import { Query } from "node-appwrite";
import { ChatGroq } from "@langchain/groq";
import { Document } from "@langchain/core/documents";

// Optimized model configuration for faster responses
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.1-8b-instant", // Smaller, faster model
    // temperature: 0.1, // Lower temperature for more focused responses
    // maxTokens: 1024, // Limit response length for speed
    // streaming: false, // Disable streaming for simpler implementation
});

// Alternative faster models you can try:
// const model = new ChatOpenAI({
//     apiKey: process.env.OPENAI_API_KEY!,
//     model: "gpt-3.5-turbo", // Faster than GPT-4
//     temperature: 0.1,
//     maxTokens: 1024,
// });

export const indexName = 'sidchat';

// Cache for document retrieval to avoid repeated processing
const documentCache = new Map<string, Document[]>();
const vectorStoreCache = new Map<string, PineconeStore>();

export const generateDocs = async (docId: string) => {
    // Check cache first
    if (documentCache.has(docId)) {
        console.log(`--- Using cached documents for ${docId} ---`);
        return documentCache.get(docId);
    }

    const { userId } = await auth();

    if (!userId) {
        throw new Error("user not found")
    }

    console.log("Fetching Download Urls from appwrite");

    const document = await adminDatabases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
        docId
    );

    if (document.userId !== userId) {
        throw new Error("Unauthorized access to this file.");
    }

    const downloadUrl = document.downloadUrl;

    if (!downloadUrl) {
        throw new Error("Download URL not found");
    }

    console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

    const response = await fetch(downloadUrl, {
        headers: {
            'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Fetch failed with status:", response.status, text);
        throw new Error("Failed to fetch the PDF file.");
    }

    const data = await response.blob();

    console.log("--- Loading PDF document... ---");
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    console.log("--- Splitting the document into smaller parts... ---");
    // Optimized text splitter settings for better performance
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, // Smaller chunks for faster retrieval
        chunkOverlap: 200, // Reasonable overlap
        separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""], // Better splitting
    });
    const splitDocs = await splitter.splitDocuments(docs);

    console.log(`--- Split into ${splitDocs.length} parts ---`);

    // Cache the result
    documentCache.set(docId, splitDocs);

    return splitDocs;
}

const fetchMessagesFromDB = async (docId: string) => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('User not Found')
    }

    console.log("--Fetch Chat history from the appwrite DB--")
    const chatRes = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        "chats",
        [
            Query.equal("userId", userId),
            Query.equal("docId", docId),
            Query.orderDesc("createdAt"),
            Query.limit(10) // Limit to last 10 messages for faster processing
        ]
    );

    const chatHistory = chatRes.documents.map((doc) =>
        doc.role === "human"
            ? new HumanMessage(doc.message)
            : new AIMessage(doc.message)
    );

    console.log(`--- fetched ${chatHistory.length} messages successfully ---`);
    return chatHistory;
}

const namespaceExists = async (index: Index<RecordMetadata>, namespace: string) => {
    if (namespace === null) throw new Error("No Namespace Value Provided")
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPinecone(docId: string) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error('User not Found')
    }

    // Check cache first
    if (vectorStoreCache.has(docId)) {
        console.log(`--- Using cached vector store for ${docId} ---`);
        return vectorStoreCache.get(docId);
    }

    let pineconeVectorStore;

    console.log("------Generating Embeddings-----")

    // Use faster embeddings - OpenAI embeddings are generally faster than Cohere
    const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY!,
        model: "embed-english-v3.0", // or 'embed-multilingual-v3.0'
        inputType: "search_document", // for document embedding
    });

    const index = await pineconeClient.index(indexName)
    const namespaceAlreadyExists = await namespaceExists(index, docId)

    if (namespaceAlreadyExists) {
        console.log(`--namespace of ${docId} already exists, reusing existing embedding`)
        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId
        })

        // Cache the vector store
        vectorStoreCache.set(docId, pineconeVectorStore);
        return pineconeVectorStore;
    } else {
        const splitDocs: any = await generateDocs(docId)

        console.log(
            `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`
        );

        pineconeVectorStore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: docId
            }
        );

        // Cache the vector store
        vectorStoreCache.set(docId, pineconeVectorStore);
        return pineconeVectorStore
    }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
    try {
        console.log(`--- Starting completion for docId: ${docId}, question: ${question} ---`);

        let pineconeVectorStoreforCompletion;
        pineconeVectorStoreforCompletion = await generateEmbeddingsInPinecone(docId);

        if (!pineconeVectorStoreforCompletion) throw new Error("pinecone vector not found")

        // Create optimized retriever
        console.log("--creating a retriever---")
        const retriever = pineconeVectorStoreforCompletion.asRetriever({
            k: 3, // Retrieve fewer documents for faster processing
            searchType: "similarity",
        });

        const chatHistory = await fetchMessagesFromDB(docId)
        console.log(`--- Chat history length: ${chatHistory.length} ---`);

        // Use simple approach for better speed - skip history-aware retrieval for now
        console.log("--- Creating optimized retrieval chain... ---");

        // Optimized prompt for faster, more focused responses
        const optimizedPrompt = ChatPromptTemplate.fromTemplate(`
            You are a helpful AI assistant. Answer the user's question based on the provided context.
            Be concise, accurate, and helpful. If the context doesn't contain enough information, say so clearly.

            Context: {context}

            Question: {input}

            Answer (be concise and helpful):
        `);

        const combineDocsChain = await createStuffDocumentsChain({
            llm: model,
            prompt: optimizedPrompt,
        });

        const retrievalChain = await createRetrievalChain({
            retriever,
            combineDocsChain: combineDocsChain,
        });

        console.log("--- Running optimized retrieval chain... ---");

        // Add timeout for faster failure handling
        const response = await Promise.race([
            retrievalChain.invoke({
                input: question,
            }),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Response timeout")), 30000)
            )
        ]);


        console.log("--- Chain response received ---");

        if (response && response.answer) {
            return response.answer;
        } else {
            return "I couldn't find a relevant answer in the document. Could you please rephrase your question?";
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("--- Error in generateLangchainCompletion:", error, "---");

            // Provide more helpful error messages
            if (error.message.includes("timeout")) {
                return "I'm taking longer than usual to respond. Please try asking a simpler question or try again.";
            }

            return `I encountered an issue processing your question. Please try rephrasing it or try again. Error: ${error.message}`;
        }
    }
};

// Clear caches periodically to prevent memory issues
setInterval(() => {
    if (documentCache.size > 50) { // Clear if too many cached documents
        documentCache.clear();
        console.log("Document cache cleared");
    }
    if (vectorStoreCache.size > 20) { // Clear if too many cached vector stores
        vectorStoreCache.clear();
        console.log("Vector store cache cleared");
    }
}, 300000); // Clear every 5 minutes

// Export the model and the run function
export { model, generateLangchainCompletion };