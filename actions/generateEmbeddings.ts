'use server'

import { generateEmbeddingsInPinecone } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

const generateEmbeddings = async (docId: string) => {
    await auth.protect(); //protect this route with clerk

    //turn pdf into embeddings [0.12323, 0.2356, .....]
    await generateEmbeddingsInPinecone(docId)

    revalidatePath('/dashboard')

    return { completed: true }
}
export default generateEmbeddings