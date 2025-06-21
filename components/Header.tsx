"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { Crown, FilePlus2, Menu, X } from "lucide-react"
import { useState } from "react"
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="border-b bg-white shadow-sm">
            {/* Desktop and Mobile Header */}
            <div className="flex justify-between items-center p-4 px-4 sm:px-8 lg:px-32">
                {/* Logo */}
                <Link
                    href='/dashboard'
                    className="text-2xl sm:text-3xl font-extrabold"
                >
                    <span className="text-indigo-600">Docu</span>Chat
                </Link>

                <SignedIn>
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-5">
                        <Button asChild variant='default'>
                            <Link href='/dashboard/upgrade'>
                                <Crown className="w-4 h-4" />
                                Pricing
                            </Link>
                        </Button>

                        <Button asChild variant='outline'>
                            <Link href='/dashboard/'>My Documents</Link>
                        </Button>

                        <Button asChild variant='outline' className="border-indigo-600">
                            <Link href='/dashboard/upload'>
                                <FilePlus2 className="text-indigo-600 w-4 h-4" />
                            </Link>
                        </Button>

                        <UserButton />
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex items-center space-x-3 lg:hidden">
                        <UserButton />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </SignedIn>
            </div>

            {/* Mobile Menu */}
            <SignedIn>
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t bg-white">
                        <div className="flex flex-col space-y-2 p-4">
                            <Button asChild variant='default' className="w-full justify-start">
                                <Link href='/dashboard/upgrade' onClick={() => setIsMobileMenuOpen(false)}>
                                    <Crown className="w-4 h-4" />
                                    Pricing
                                </Link>
                            </Button>

                            <Button asChild variant='outline' className="w-full justify-start">
                                <Link href='/dashboard/' onClick={() => setIsMobileMenuOpen(false)}>
                                    My Documents
                                </Link>
                            </Button>

                            <Button asChild variant='outline' className="w-full justify-start border-indigo-600">
                                <Link href='/dashboard/upload' onClick={() => setIsMobileMenuOpen(false)}>
                                    <FilePlus2 className="text-indigo-600 w-4 h-4 mr-2" />
                                    Upload Document
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </SignedIn>
        </div>
    )
}

export default Header
