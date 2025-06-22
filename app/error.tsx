'use client';

import { useState } from 'react';
import { AlertCircle, ArrowUpLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isRetrying, setIsRetrying] = useState(false);
    const router = useRouter()


    const handleRetry = async () => {
        try {
            setIsRetrying(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            reset();
        } catch (retryError) {
            console.error('Retry failed:', retryError);
        } finally {
            setIsRetrying(false);
        }
    };

    const getErrorMessage = (error: Error): string => {
        if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
            return 'Failed to load application resources. Please refresh the page.';
        }
        if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            return 'Connection problem. Please check your internet and try again.';
        }
        if (error.message.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        return 'Something went wrong. Please try again or contact support if the problem persists.';
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-6 font-sans antialiased">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 text-center">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full p-4">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Oops! Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {getErrorMessage(error)}
                        </p>
                        <div className='flex justify-center gap-4'>
                            {/* Action Button */}
                            <Button
                                onClick={() => router.replace('/dashboard')}
                                size={'lg'}
                                className='font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none'
                            >
                                <ArrowUpLeft /> Back to Dashboard
                            </Button>
                            <Button
                                size={'lg'}
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-indigo-400 disabled:to-violet-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                            >
                                <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                                {isRetrying ? 'Retrying...' : 'Try Again'}
                            </Button>
                        </div>

                        {/* Error ID for support */}
                        {error.digest && (
                            <p className="text-xs text-gray-400 mt-6">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}