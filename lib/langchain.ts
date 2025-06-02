import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from '@langchain/pinecone'
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminClient, adminDatabases } from "./appwrite-admin";
import { auth } from "@clerk/nextjs/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChatOllama } from "@langchain/ollama";
import { CohereEmbeddings } from "@langchain/cohere";

const model = new ChatOllama({ model: "mistral" })

export const indexName = 'sidchat';

export const generateDocs = async (docId: string) => {
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
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);

    console.log(`--- Split into ${splitDocs.length} parts ---`);

    return splitDocs;

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

    let pineconeVectorStore;

    console.log("------Generating Embeddings-----")
    // const embeddings = new OpenAIEmbeddings()

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
        return pineconeVectorStore;
    } else {
        //if the namespace doesnt exist download pdf from appwrite storage and generate embeddings 
        // and store them to pinecone vector store;

        const splitDocs = await generateDocs(docId)

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
        return pineconeVectorStore
    }

}
