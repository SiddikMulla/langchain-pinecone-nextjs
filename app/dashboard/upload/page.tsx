'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { databases } from '@/lib/appwrite-client'
import { Query } from 'appwrite'
import { FileText, Crown, ArrowLeftCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FileUploader from '@/components/FileUploader'
import Link from 'next/link'

const MAX_FREE_DOCUMENTS = 4
const SUPER_USER_ID = 'user_2wmR5zMqRt8v4bJp3zBDvlx6vv8'

const UploadPage = () => {
    const router = useRouter()
    const { user } = useUser()
    const [checking, setChecking] = useState(true)
    const [isLimitReached, setIsLimitReached] = useState(false)

    useEffect(() => {
        const verifyAccess = async () => {
            if (!user) return

            const isSuperUser = user.id === SUPER_USER_ID
            if (isSuperUser) {
                setChecking(false)
                return
            }

            try {
                const res = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
                    [Query.equal('userId', user.id)]
                )

                if (res.total >= MAX_FREE_DOCUMENTS) {
                    setIsLimitReached(true)
                }
            } catch (err) {
                console.error('Error checking limit:', err)
                setIsLimitReached(true)
            } finally {
                setChecking(false)
            }
        }

        verifyAccess()
    }, [user])

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24" />
                Checking access...
            </div>
        )
    }

    if (isLimitReached) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 sm:p-10 shadow-md max-w-md">
                    <div className="flex justify-center mb-4">
                        <FileText className="w-12 h-12 text-orange-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-orange-800 mb-2">
                        Document Limit Reached
                    </h2>
                    <p className="text-sm text-orange-700 mb-4">
                        You’ve reached your free tier limit of <strong>{MAX_FREE_DOCUMENTS}</strong> documents.
                        Upgrade your plan to add more files or delete existing ones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>
                            <ArrowLeftCircle className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <Link href="/dashboard/upgrade" passHref legacyBehavior>
                            <Button
                                variant="default"
                                className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                            >
                                <Crown className="w-4 h-4" />
                                Upgrade Plan
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        )
    }

    return <FileUploader />
}

export default UploadPage
