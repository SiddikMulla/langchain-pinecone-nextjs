'use client'

import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black px-6">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-zinc-200 dark:border-zinc-700"
            >
                <XCircle className="mx-auto text-red-500" size={60} />
                <h1 className="text-2xl font-bold mt-4">Payment Canceled</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    No worries, your subscription is safe. You can try again anytime.
                </p>

                <div className="mt-6">
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Return to Home
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                    Need help? <a href="/contact" className="underline text-blue-500">Contact support</a>.
                </p>
            </motion.div>
        </div>
    )
}
