'use client'

import { useEffect, useState, useCallback, useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import { databases } from "@/lib/appwrite-client"
import { Query } from "appwrite"
import PlaceholderDocuments from "./PlaceholderDocuments"
import DocumentCard from "./DocumentCard"
import { Search, RefreshCw, FileText, AlertCircle, Grid, List, Crown, Dot } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

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

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'name' | 'size'

const Documents = () => {
    const [documents, setDocuments] = useState<DocumentFile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [refreshing, setRefreshing] = useState(false)
    const { user } = useUser()

    const superUser = 'user_2wmR5zMqRt8v4bJp3zBDvlx6vv8'

    // Configuration for free tier limits
    const MAX_FREE_DOCUMENTS = 5

    // Check if current user is super user
    const isSuperUser = user?.id === superUser

    // Get effective max documents (unlimited for super user)

    const fetchDocuments = useCallback(async (showRefreshIndicator = false) => {
        if (!user) {
            setLoading(false)
            return
        }
        console.log("dfvlbhadjhfb:", user.id)
        try {
            if (showRefreshIndicator) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

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
                downloadUrl: doc.downloadUrl,
                fileId: doc.fileId,
                userId: doc.userId,
                createdAt: doc.createdAt,
            }))

            setDocuments(docs)
            setError(null)
        } catch (err) {
            console.error('Error fetching documents:', err)
            setError('Failed to load documents. Please try again.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [user])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const handleDocumentDeleted = useCallback((documentId: string) => {
        setDocuments(prev => prev.filter(doc => doc.$id !== documentId))
    }, [])

    const handleRefresh = useCallback(() => {
        fetchDocuments(true)
    }, [fetchDocuments])

    // Filtered and sorted documents
    const filteredAndSortedDocuments = useMemo(() => {
        const filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'size':
                filtered.sort((a, b) => b.size - a.size)
                break
        }

        return filtered
    }, [documents, searchTerm, sortBy])

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0)

    if (loading && !refreshing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header Skeleton */}
                    <div className="mb-6 sm:mb-8">
                        <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-1/2 sm:w-1/3 mb-4 animate-pulse" />
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-1/2 animate-pulse" />
                    </div>

                    {/* Controls Skeleton */}
                    <div className="flex flex-col gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
                        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                            <div className="h-10 bg-gray-200 rounded-lg flex-1 sm:flex-none sm:w-32 animate-pulse" />
                            <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-24 animate-pulse" />
                        </div>
                    </div>

                    {/* Documents Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        <PlaceholderDocuments
                            documentCount={0}
                            maxDocuments={MAX_FREE_DOCUMENTS}
                            isLoading={true}
                        />
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-full h-64 sm:h-80 rounded-2xl bg-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center rounded-b-3xl border border-gray-200 bg-white px-4 py-2 shadow-md backdrop-blur-sm">
                <span className="text-xs sm:text-sm text-gray-700">Free Tier</span>
                <Dot className="text-gray-400" />
                <Link href="/dashboard/upgrade" className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Upgrade Plan
                </Link>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                                    My Documents
                                </h1>
                                {isSuperUser && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-full text-xs font-medium">
                                        <Crown className="w-3 h-3" />
                                        <span>Super User</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center">
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    {documents.length} document{documents.length !== 1 ? 's' : ''}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span>{formatFileSize(totalSize)} total</span>
                                {!isSuperUser && (
                                    <>
                                        <span className="hidden sm:inline">•</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${documents.length >= MAX_FREE_DOCUMENTS
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {documents.length}/{MAX_FREE_DOCUMENTS} used
                                        </span>
                                    </>
                                )}
                                {isSuperUser && (
                                    <>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            Unlimited
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </Button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Search - Full width on mobile */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-5 w-full"
                        />
                    </div>

                    {/* Sort and View Mode - Side by side on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                            <SelectTrigger className="w-max sm:min-w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                                <SelectItem value="size">Largest First</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 flex-1 sm:flex-none sm:px-3 ${viewMode === 'grid'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } transition-colors duration-200`}
                            >
                                <Grid className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 flex-1 sm:flex-none sm:px-3 ${viewMode === 'list'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } transition-colors duration-200`}
                            >
                                <List className="w-4 h-4 mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <div>
                                <h3 className="font-medium text-red-800">Error Loading Documents</h3>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                            <Button onClick={() => fetchDocuments()} variant="outline" size="sm">
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}

                {/* Documents Grid/List */}
                <div className={`
          ${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                        : 'space-y-3 sm:space-y-4'
                    }
        `}>
                    {!isSuperUser ? (
                        <PlaceholderDocuments
                            documentCount={documents.length}
                            maxDocuments={MAX_FREE_DOCUMENTS}
                            isLoading={loading || refreshing}
                        />
                    ) : (
                        <PlaceholderDocuments
                            documentCount={documents.length}
                            // maxDocuments={}
                            isLoading={loading || refreshing}
                        />
                    )}

                    {filteredAndSortedDocuments.map((document) => (
                        <DocumentCard
                            key={document.$id}
                            document={document}
                            onDeleted={handleDocumentDeleted}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {documents.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No documents yet</h3>
                        <p className="text-gray-500">Upload your first document to get started</p>
                    </div>
                )}

                {/* No Search Results */}
                {filteredAndSortedDocuments.length === 0 && documents.length > 0 && searchTerm && (
                    <div className="text-center py-12 col-span-full">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No documents found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Documents