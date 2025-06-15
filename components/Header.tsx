"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { Crown, FilePlus2 } from "lucide-react"

const Header = () => {
    return (
        <div className="flex justify-between p-4 px-32 border-b bg-white shadow-sm">
            <Link
                href='/dashboard'
                className="text-3xl font-extrabold"
            >
                <span className="text-indigo-600">Docu</span>Chat
            </Link>
            <SignedIn>
                <div className="flex items-center space-x-5">
                    <Button asChild variant='default' className="hidden md:flex">
                        <Link href='/dashboard/upgrade'><Crown />Pricing</Link>
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