'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { databases, storage } from "@/lib/appwrite-client"
import {
    FileTextIcon,
    CalendarIcon,
    MoreVerticalIcon,
    DownloadIcon,
    Trash2Icon,
    Trash2,
} from "lucide-react"
import { Button } from "./ui/button"

import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

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

interface DocumentCardProps {
    document: DocumentFile
    onDeleted: (documentId: string) => void
}

//need to add onDeleted in param
const DocumentCard = ({ document, onDeleted }: DocumentCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<Blob | null>(null)

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await fetch(document.downloadUrl)
                const blob = await res.blob()
                setFile(blob)
            } catch (err) {
                console.error("PDF fetch error:", err)
                setImageError(true)
            }
        }
        fetchFile()
    }, [document.downloadUrl])

    const router = useRouter()

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleView = () => {
        setLoading(true)
        router.push(`/dashboard/files/${document.fileId}`)
    }

    const handleDownload = () => {
        const link = window.document.createElement('a')
        link.href = document.downloadUrl
        link.download = document.name
        link.click()
    }

    const handleDelete = async () => {
        // Show confirmation toast with action buttons
        toast('Are you sure you want to delete this document?', {
            action: {
                label: "Delete",
                onClick: () => performDelete(),
            },
            cancel: {
                label: "Cancel",
                onClick: () => { }, // Just dismiss
            },
            duration: Infinity,
            position: "top-center",
            className: "group toast-confirm",
            style: {
                minWidth: '500px',
                padding: '20px',
                fontSize: '16px'
            },
            actionButtonStyle: {
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '13px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            },
            cancelButtonStyle: {
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '13px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            },
        });
    };

    const performDelete = async () => {
        setIsDeleting(true);

        try {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
                document.$id
            );
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
                document.fileId
            );
            onDeleted(document.$id);
            toast.success('Document Deleted Successfully!', {
                description: 'Your file has been permanently removed from the system.',
                icon: <Trash2 className="text-red-500 w-5 h-5" />,
                duration: 4000,
                position: "top-center",
                className: "toast-success",
                style: {
                    minWidth: '350px',
                    padding: '16px',
                    fontSize: '15px',
                },
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to Delete Document', {
                description: 'An error occurred while trying to delete the file. Please try again.',
                duration: 4000,
                position: "top-center",
                className: "toast-error",
                style: {
                    minWidth: '350px',
                    padding: '16px',
                    fontSize: '15px',
                },
            });
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className="group flex flex-col w-64 h-85 rounded-3xl bg-white shadow-sm shadow-slate-400 hover:shadow-md transition-all border border-gray-200 overflow-hidden">
            {/* PDF Preview Section */}
            <div className="relative h-62 bg-gray-100 rounded-t-2xl overflow-hidden">
                {!imageError && file ? (
                    <Document
                        file={file}
                        onLoadError={() => setImageError(true)}
                        loading={null}
                    >
                        <Page pageNumber={1} width={256} className="shadow" />
                    </Document>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                        <FileTextIcon className="h-16 w-16 text-red-400" />
                    </div>
                )}
            </div>

            {/* Info + Actions */}
            <div className="p-2 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                            {document.name}
                        </h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{formatDate(document.createdAt)}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <MoreVerticalIcon className="h-6 w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDownload}>
                                <DownloadIcon className="h-4 w-4" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                                disabled={isDeleting}
                            >
                                <Trash2Icon color="red" className="h-4 w-4" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                <div className="flex items-center justify-between mt-2">
                    <Button
                        onClick={handleView}
                        size="sm"
                        className="bg-gradient-to-r from-indigo-700 to-blue-700 hover:bg-indigo-900 cursor-pointer text-white flex-1 mx-3"
                    >
                        {loading ?
                            <>
                                <span className="loading loading-ring loading-md"></span>
                            </> :
                            <span>View Previous Chats</span>
                        }
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default DocumentCard