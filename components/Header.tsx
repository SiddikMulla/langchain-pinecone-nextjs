"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { FilePlus2 } from "lucide-react"

const Header = () => {
    return (
        <div className="flex justify-between p-5 border-b bg-white shadow-sm">
            <Link
                href='/dashboard'
                className="text-2xl font-semibold"
            >
                chat to <span className="text-indigo-600">PDF</span>
            </Link>
            <SignedIn>
                <div className="flex items-center space-x-3">
                    <Button asChild variant='default' className="hidden md:flex">
                        <Link href='/dashboard/upgrade'>Pricing</Link>
                    </Button>

                    <Button asChild variant='outline'>
                        <Link href='/dashboard/'>My Documents</Link>
                    </Button>

                    <Button asChild variant='outline' className="border-indigo-600">
                        <Link href='/dashboard/upload'>
                            <FilePlus2 className="text-indigo-600" />
                        </Link>
                    </Button>

                    <UserButton />
                </div>
            </SignedIn>
        </div>
    )
}
export default Header