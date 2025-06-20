'use client'

import { PlusCircleIcon, Upload, FileText, Sparkles, Crown } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"

interface PlaceholderDocumentsProps {
    documentCount?: number
    maxDocuments?: number
    isLoading?: boolean
}

const PlaceholderDocuments = ({
    documentCount = 0,
    maxDocuments = 4,
    isLoading = false
}: PlaceholderDocumentsProps) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { user } = useUser()

    const superUser = 'user_2wmR5zMqRt8v4bJp3zBDvlx6vv8'
    const isSuperUser = user?.id === superUser

    const handleClick = async () => {
        if (loading || isLoading) return

        // Check if user has reached document limit (for free tier only)
        if (!isSuperUser && documentCount >= maxDocuments) {
            // You can implement a modal or toast notification here
            console.log('Document limit reached')
            return
        }

        setLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 300)) // Smooth transition
            router.push('/dashboard/upload')
        } catch (error) {
            console.error('Navigation error:', error)
            setLoading(false)
        }
    }

    const isDisabled = loading || isLoading || (!isSuperUser && documentCount >= maxDocuments)
    const progressPercentage = isSuperUser ? 0 : (documentCount / maxDocuments) * 100
    const isLimitReached = !isSuperUser && documentCount >= maxDocuments

    return (
        <div className="relative group">
            <Button
                onClick={handleClick}
                disabled={isDisabled}
                className={`flex flex-col items-center justify-center 
          w-full h-64 sm:w-64 sm:h-80 
          rounded-2xl bg-gradient-to-br cursor-pointer 
          ${isSuperUser
                        ? 'from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border-2 border-dashed border-slate-300 hover:border-green-800'
                        : 'from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2 border-dashed border-gray-300 hover:border-blue-500'
                    }
          hover:shadow-lg
          transition-all duration-300 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:shadow-none
          ${isSuperUser ? 'text-slate-700 hover:text-slate-800' : 'text-gray-600 hover:text-blue-600'}
          transform hover:scale-[1.02] active:scale-[0.98]
          focus:ring-4 focus:ring-blue-500/20 focus:outline-none`}
            >
                {loading ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className={`w-16 h-16 border-4 ${isSuperUser ? 'border-slate-300 border-t-slate-500' : 'border-gray-300 border-t-blue-500'} rounded-full animate-spin`}></div>
                            <Upload className={`absolute inset-0 m-auto w-6 h-6 ${isSuperUser ? 'text-slate-500' : 'text-blue-500'}`} />
                        </div>
                        <p className="text-sm font-medium">Preparing upload...</p>
                    </div>
                ) : isLimitReached ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <FileText className="w-16 h-16 text-slate-400" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-base font-medium text-orange-600">Limit Reached</p>
                            <p className="text-xs text-orange-500 mt-1">
                                {documentCount}/{maxDocuments} documents
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <PlusCircleIcon
                                style={{ width: 60, height: 60 }}
                                className={`${isSuperUser
                                    ? 'text-slate-400 group-hover:text-slate-500'
                                    : 'text-gray-400 group-hover:text-blue-500'
                                    } transition-colors duration-200`}
                            />
                            {isSuperUser ? (
                                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            ) : (
                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-sm sm:text-base font-medium">
                                Click here to add PDF
                            </p>
                            <p className="text-xs mt-1">
                                {isSuperUser ? (
                                    <span className="text-slate-600 font-medium flex items-center justify-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        Unlimited
                                    </span>
                                ) : (
                                    <span>
                                        {documentCount}/{maxDocuments} documents
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </Button>

            {/* Progress indicator - only for non-super users */}
            {!isSuperUser && documentCount > 0 && (
                <div className="absolute -bottom-3 left-4 right-8">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                            className={`h-1 rounded-full transition-all duration-500 ${progressPercentage >= 100
                                ? 'bg-orange-500'
                                : progressPercentage >= 80
                                    ? 'bg-orange-500'
                                    : 'bg-blue-500'
                                }`}
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Super User Badge */}
            {isSuperUser && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-slate-600 to-slate-800 text-slate-50 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-md">
                    <Crown className="w-3 h-3" />
                    <span>Super</span>
                </div>
            )}

            {/* Tooltip for limit reached - only for non-super users */}
            {!isSuperUser && isLimitReached && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
          bg-gray-800 text-white text-xs px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap z-10">
                    Upgrade to add more documents
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
            w-0 h-0 border-l-4 border-r-4 border-t-4 
            border-transparent border-t-gray-800" />
                </div>
            )}

            {/* Super User Tooltip */}
            {isSuperUser && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
          bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap z-10 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Unlimited uploads available
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
            w-0 h-0 border-l-4 border-r-4 border-t-4 
            border-transparent border-t-slate-600" />
                </div>
            )}
        </div>
    )
}

export default PlaceholderDocuments