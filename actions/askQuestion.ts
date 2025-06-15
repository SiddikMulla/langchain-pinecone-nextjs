'use server'

import { Message } from "@/components/ChatScreen";
import { adminDatabases } from "@/lib/appwrite-admin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"
import { ID, Query, Permission, Role, IndexType } from "node-appwrite";

const FREE_LIMIT = 3
const PRO_LIMIT = 3

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const chatCollection = "chats";
const userCollection = "users";

// Function to ensure collection exists
async function ensureCollectionExists() {
    try {
        // Try to get the collection
        await adminDatabases.getCollection(databaseId, chatCollection);
        console.log(`Collection ${chatCollection} already exists`);
    } catch (error: any) {
        if (error.code === 404) {
            console.log(`Collection ${chatCollection} not found, creating...`);
            try {
                // Create the collection
                await adminDatabases.createCollection(
                    databaseId,
                    chatCollection,
                    chatCollection, // name
                    [
                        Permission.read(Role.any()),
                        Permission.write(Role.any()),
                        Permission.create(Role.any()),
                        Permission.update(Role.any()),
                        Permission.delete(Role.any())
                    ]
                );

                // Create required attributes
                await adminDatabases.createStringAttribute(
                    databaseId,
                    chatCollection,
                    'userId',
                    255,
                    true // required
                );

                await adminDatabases.createStringAttribute(
                    databaseId,
                    chatCollection,
                    'docId', // Changed from 'id' to avoid confusion with document ID
                    255,
                    true
                );

                await adminDatabases.createStringAttribute(
                    databaseId,
                    chatCollection,
                    'role',
                    50,
                    true
                );

                await adminDatabases.createStringAttribute(
                    databaseId,
                    chatCollection,
                    'message',
                    10000, // Large enough for chat messages
                    true
                );

                await adminDatabases.createDatetimeAttribute(
                    databaseId,
                    chatCollection,
                    'createdAt',
                    true
                );

                // Create indexes for better query performance
                await adminDatabases.createIndex(
                    databaseId,
                    chatCollection,
                    'userIdIndex',
                    IndexType.Key,
                    ['userId']
                );

                await adminDatabases.createIndex(
                    databaseId,
                    chatCollection,
                    'docIdIndex',
                    IndexType.Key,
                    ['docId']
                );

                await adminDatabases.createIndex(
                    databaseId,
                    chatCollection,
                    'createdAtIndex',
                    IndexType.Key,
                    ['createdAt']
                );

                console.log(`Collection ${chatCollection} created successfully with attributes and indexes`);
            } catch (createError) {
                console.error('Error creating collection:', createError);
                throw createError;
            }
        } else {
            console.error('Error checking collection:', error);
            throw error;
        }
    }
}

console.log('Database ID:', databaseId);

export async function askQuestion(id: string, question: string) {
    auth.protect();
    const { userId } = await auth();

    if (!userId) {
        return { success: false, message: "Not authenticated." };
    }

    try {
        // Ensure collection exists before proceeding
        await ensureCollectionExists();

        // Now proceed with the original logic
        const userMessages = await adminDatabases.listDocuments(databaseId, chatCollection, [
            Query.equal("userId", userId),
            Query.equal("docId", id), // Changed from "fileId" to "docId" to match your langchain file
            Query.equal("role", "human"),
        ]);

        // Create user message
        const userMessage: Message = {
            role: 'human',
            message: question,
            createdAt: new Date(),
        };

        await adminDatabases.createDocument(databaseId, chatCollection, ID.unique(), {
            userId,
            docId: id, // Changed from 'id' to 'docId' to be more descriptive
            role: userMessage.role,
            message: userMessage.message,
            createdAt: userMessage.createdAt.toISOString(),
        });

        // Generate AI response with timeout
        console.log("--- Starting AI response generation ---");
        const reply = await Promise.race([
            generateLangchainCompletion(id, question),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Response generation timed out")), 60000) // 60 second timeout
            )
        ]) as any;
        console.log("--- AI response generated successfully ---");

        const aiMessage: Message = {
            role: 'ai',
            message: reply,
            createdAt: new Date(),
        };

        await adminDatabases.createDocument(databaseId, chatCollection, ID.unique(), {
            userId,
            docId: id, // Changed from 'id' to 'docId' to be more descriptive
            role: aiMessage.role,
            message: aiMessage.message,
            createdAt: aiMessage.createdAt.toISOString(),
        });

        return { success: true, message: reply };
    } catch (error) {
        console.error('Error in askQuestion:', error);
        return { success: false, message: "An error occurred while processing your question." };
    }
}