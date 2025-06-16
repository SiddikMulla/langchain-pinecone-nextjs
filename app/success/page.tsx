'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
    const [showConfetti, setShowConfetti] = useState(true)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        const timer = setTimeout(() => setShowConfetti(false), 6000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-slate-900 px-6">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={250}
                    recycle={false}
                />
            )}

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-zinc-200 dark:border-zinc-700"
            >
                <CheckCircle className="mx-auto text-green-500" size={60} />
                <h1 className="text-3xl font-bold mt-4">Payment Successful</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-2">
                    You've unlocked <span className="text-blue-600 dark:text-blue-400 font-medium">Pro Access</span> 🚀
                </p>
                <div className="mt-6">
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-4">
                    Enjoy unlimited features and priority support.
                </p>
            </motion.div>
        </div>
    )
}
