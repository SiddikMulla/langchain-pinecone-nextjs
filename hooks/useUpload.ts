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
    GENERATING = "Generating AI Embeddings...",
}

export type Status = StatusText;

// Configuration constants
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const FILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!;
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

function useUpload() {
    const [progress, setProgress] = useState<number | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const { user } = useUser();

    // Realistic progress simulation based on file size
    const simulateRealisticProgress = (file: File) => {
        return new Promise<void>((resolve) => {
            const fileSize = file.size;
            let currentProgress = 0;

            // Calculate timing based on file size (more realistic)
            const estimatedTimeMs = Math.max(
                3000, // Minimum 3 seconds
                Math.min(15000, fileSize / 50000) // Max 15 seconds, scale with file size
            );

            // Variable speed progression (starts slow, speeds up, then slows down)
            const updateInterval = 100; // Update every 100ms for smoother animation
            const totalUpdates = estimatedTimeMs / updateInterval;
            let updateCount = 0;

            const progressInterval = setInterval(() => {
                updateCount++;
                const progressRatio = updateCount / totalUpdates;

                // Ensure we start from a reasonable percentage
                if (updateCount === 1) {
                    setProgress(1);
                    return;
                }

                // Ease-in-out curve for more natural progression
                let easedProgress;
                if (progressRatio < 0.5) {
                    // Ease in (slow start)
                    easedProgress = 2 * progressRatio * progressRatio;
                } else {
                    // Ease out (slow end)
                    easedProgress = 1 - 2 * (1 - progressRatio) * (1 - progressRatio);
                }

                // Convert to percentage (clean integers only)
                currentProgress = Math.min(
                    90, // Cap at 90% until actual upload completes
                    Math.max(1, Math.floor(easedProgress * 90)) // Ensure minimum 1%
                );

                setProgress(currentProgress);

                // Don't complete until we're at the end
                if (updateCount >= totalUpdates) {
                    clearInterval(progressInterval);
                    resolve();
                }
            }, updateInterval);
        });
    };

    const handleUpload = async (file: File) => {
        if (!file || !user) return;

        const fileIdToUploadTo = ID.unique();

        try {
            setStatus(StatusText.UPLOADING);
            setProgress(0);

            // Start realistic progress simulation
            const progressPromise = simulateRealisticProgress(file);

            // Start actual upload
            const uploadPromise = storage.createFile(
                STORAGE_BUCKET_ID,
                fileIdToUploadTo,
                file,
                [
                    Permission.read(Role.any()),
                    Permission.write(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );

            // Wait for both progress simulation and actual upload
            const [_, uploadedFile] = await Promise.all([
                progressPromise,
                uploadPromise
            ]);

            // Complete the progress
            setProgress(100);
            setStatus(StatusText.UPLOADED);

            // Small delay to show "uploaded" status
            await new Promise(resolve => setTimeout(resolve, 800));

            // Get file URL
            const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, fileIdToUploadTo);

            setStatus(StatusText.SAVING);

            // Add a small delay for database saving (realistic timing)
            await new Promise(resolve => setTimeout(resolve, 1000));

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
                    Permission.read(Role.any()),
                    Permission.write(Role.any()),
                    Permission.delete(Role.any()),
                ]
            );

            setStatus(StatusText.GENERATING);

            // Add delay for embeddings generation (this actually takes time)
            await new Promise(resolve => setTimeout(resolve, 500));

            await generateEmbeddings(fileIdToUploadTo);
            setFileId(fileIdToUploadTo);

        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus(null);
            setProgress(null);
            throw error;
        }
    };

    return { progress, status, fileId, handleUpload };
}

export default useUpload;