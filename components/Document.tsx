'use client'

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { databases } from "@/lib/appwrite-client"
import { Query } from "appwrite"
import PlaceholderDocuments from "./PlaceholderDocuments"
import DocumentCard from "./DocumentCard"

// Configuration constants
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const FILES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!

interface DocumentFile {
    $id: string
    name: string
    size: number
    type: string
    downloadUrl: string
    fileId: string
    userId: string
    createdAt: string
}

const Documents = () => {
    const [documents, setDocuments] = useState<DocumentFile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useUser()

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!user) {
                setLoading(false)
                return
            }
            console.log('Current user:', user);
            try {
                setLoading(true)
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    FILES_COLLECTION_ID,
                    [
                        Query.equal('userId', user.id),
                        Query.orderDesc('createdAt'),
                        Query.limit(100)
                    ]
                )
                const rawDocs = response.documents

                const docs: DocumentFile[] = rawDocs.map((doc: any) => ({
                    $id: doc.$id,
                    name: doc.name,
                    size: doc.size,
                    type: doc.type,
                    downloadUrl: doc.downloadUrl, // make sure this field is stored in the doc
                    fileId: doc.fileId,
                    userId: doc.userId,
                    createdAt: doc.createdAt,
                }))
                setDocuments(docs)
                setError(null)
            } catch (err) {
                console.error('Error fetching documents:', err)
                setError('Failed to load documents')
            } finally {
                setLoading(false)
            }
        }

        fetchDocuments()
    }, [user])

    const handleDocumentDeleted = (documentId: string) => {
        setDocuments(prev => prev.filter(doc => doc.$id !== documentId))
    }

    if (loading) {
        return (
            <div className="flex flex-wrap p-12 bg-gray-50 justify-center lg:justify-start rounded-b-3xl gap-5 max-w-7xl mx-auto">
                <PlaceholderDocuments />
                {/* Loading skeleton cards */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-64 h-80 rounded-2xl bg-gray-200 animate-pulse"
                    />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-wrap p-12 bg-gray-50 justify-center lg:justify-start rounded-b-3xl gap-5 max-w-7xl mx-auto">
                <PlaceholderDocuments />
                <div className="w-full text-center text-red-500 mt-4">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap p-12 bg-gray-50 justify-center lg:justify-start rounded-b-3xl gap-5 max-w-7xl mx-auto">
            <PlaceholderDocuments />
            {documents.map((document) => (
                <DocumentCard
                    key={document.$id}
                    document={document}
                    onDeleted={handleDocumentDeleted}
                />
            ))}
        </div>
    )
}

export default Documents