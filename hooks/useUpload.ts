"use client";
import generateEmbeddings from "@/actions/generateEmbeddings";
import { databases, storage } from "@/lib/appwrite-client";
import { useUser } from "@clerk/nextjs";
import { ID, Permission, Role } from "appwrite";
import { useRouter } from "next/navigation";
import { useState } from "react";

export enum StatusText {
    UPLOADING = "Uploading file...",
    UPLOADED = "File uploaded successfully",
    SAVING = "Saving file to database...",
    GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

// Configuration constants - adjust these according to your Appwrite setup
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const FILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!;
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

function useUpload() {
    const [progress, setProgress] = useState<number | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const { user } = useUser();
    const router = useRouter();

    const handleUpload = async (file: File) => {
        if (!file || !user) return;

        // TODO: FREE/PRO limitations...
        const fileIdToUploadTo = ID.unique(); // Appwrite's unique ID generator

        try {
            setStatus(StatusText.UPLOADING);
            setProgress(0);

            // Upload file to Appwrite Storage with progress tracking
            const uploadPromise = storage.createFile(
                STORAGE_BUCKET_ID,
                fileIdToUploadTo,
                file,
                [
                    Permission.read(Role.user(user.id)),
                    Permission.write(Role.user(user.id)),
                    Permission.delete(Role.user(user.id)),
                ]
            );

            // Since Appwrite doesn't have built-in progress tracking like Firebase,
            // we'll simulate progress or you can implement a custom solution
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev === null) return 10;
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 200);

            const uploadedFile = await uploadPromise;
            clearInterval(progressInterval);
            setProgress(100);
            setStatus(StatusText.UPLOADED);

            // Get file URL
            const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, fileIdToUploadTo);

            setStatus(StatusText.SAVING);

            // Save file metadata to Appwrite Database
            await databases.createDocument(
                DATABASE_ID,
                FILES_COLLECTION_ID,
                fileIdToUploadTo,
                {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    downloadUrl: fileUrl,
                    fileId: fileIdToUploadTo,
                    userId: user.id,
                    createdAt: new Date().toISOString(),
                },
                [
                    Permission.read(Role.user(user.id)),
                    Permission.write(Role.user(user.id)),
                    Permission.delete(Role.user(user.id)),
                ]
            );

            setStatus(StatusText.GENERATING);
            // await generateEmbeddings(fileIdToUploadTo);
            setFileId(fileIdToUploadTo);

        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus(null);
            setProgress(null);
            // Optionally, you can add error handling here
            throw error;
        }
    };

    return { progress, status, fileId, handleUpload };
}

export default useUpload;