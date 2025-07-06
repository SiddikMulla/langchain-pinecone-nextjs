"use client"

import { useState } from 'react'
import { X, Volume2 } from 'lucide-react'

const UpdateNotificationHeader = () => {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="relative bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-600 text-white">
            <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 sm:py-3 lg:px-8">
                {/* Mobile Layout (xs to sm) */}
                <div className="block sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                NEW UPDATE
                            </span>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            aria-label="Dismiss notification"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex items-start space-x-2 mb-2">
                        <span className="font-medium text-sm leading-tight tracking-wide">
                            <strong>DocuChat now supports Text-to-Speech!</strong> Listen to your document responses.
                        </span>
                    </div>

                    <div className="flex justify-center">
                    </div>
                </div>

                {/* Tablet Layout (sm to lg) */}
                <div className="hidden sm:block lg:hidden">
                    <div className="flex items-center justify-center flex-wrap gap-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                    NEW
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 min-w-0">
                                <span className="font-medium text-sm truncate">
                                    <strong>DocuChat now supports Text-to-Speech!</strong> Listen to responses with AI voices.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout (lg and up) */}
                <div className="hidden lg:block">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                    NEW
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Volume2 className="h-5 w-5 text-white" />
                                <span className="font-medium text-base">
                                    <strong>DocuChat now supports Text-to-Speech!</strong> Listen to your document responses with natural AI voices.
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="ml-3 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default UpdateNotificationHeader