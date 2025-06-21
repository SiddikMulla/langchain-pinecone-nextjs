"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { Crown, FilePlus2, Menu, X, FileText } from "lucide-react"
import { useState, useEffect } from "react"

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen]);


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'border-b bg-white/95 backdrop-blur-md shadow-lg'
            : 'border-b bg-white shadow-sm'
            }`}>
            {/* Desktop and Mobile Header */}
            <div className="flex justify-between items-center p-4 px-4 sm:px-8 lg:px-32 relative">
                {/* Logo with enhanced design */}
                <Link
                    href='/dashboard'
                    className="text-2xl sm:text-3xl font-extrabold group transition-all duration-300 hover:scale-105"
                >
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Docu
                    </span>
                    <span className="text-slate-800 transition-colors duration-300">
                        Chat
                    </span>
                </Link>

                <SignedIn>
                    {/* Desktop Navigation - Enhanced */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Pricing Button with Premium Styling */}
                        <Button
                            asChild
                            variant='default'
                            className="bg-gradient-to-r from-indigo-700 to-violet-800 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                        >
                            <Link href='/dashboard/upgrade' className="relative z-10">
                                <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="font-semibold">Pricing</span>
                            </Link>
                        </Button>

                        {/* My Documents Button */}
                        <Button
                            asChild
                            variant='outline'
                            className="border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 group"
                        >
                            <Link href='/dashboard/' className="flex items-center">
                                <FileText className="w-4 h-4 group-hover:text-indigo-600 transition-colors duration-300" />
                                <span className="font-medium">My Documents</span>
                            </Link>
                        </Button>

                        {/* Upload Button with Pulse Effect */}
                        <Button
                            asChild
                            variant='outline'
                            className="border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-300 hover:scale-105 group relative"
                        >
                            <Link href='/dashboard/upload' className="flex items-center">
                                <div className="relative">
                                    <FilePlus2 className="text-indigo-600 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                                </div>
                            </Link>
                        </Button>

                        {/* User Button with Enhanced Styling */}
                        <div className="relative">
                            <UserButton />
                        </div>
                    </div>

                    {/* Mobile Navigation Toggle - Enhanced */}
                    <div className="flex items-center space-x-3 lg:hidden mobile-menu-container">
                        <div className="relative">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-7 h-7 rounded-full ring-2 ring-white shadow-sm"
                                    }
                                }}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMobileMenu}
                            className="p-2 hover:bg-indigo-50 transition-all duration-300 hover:scale-110 active:scale-95 rounded-lg group"
                        >
                            <div className="relative w-8 h-8">
                                <Menu
                                    style={{ width: 25, height: 25 }}
                                    className={`absolute transition-all duration-300 ease-in-out text-slate-600 group-hover:text-indigo-600 ${isMobileMenuOpen
                                        ? 'opacity-0 rotate-180 scale-75'
                                        : 'opacity-100 rotate-0 scale-100'
                                        }`}
                                />
                                <X
                                    style={{ width: 25, height: 25 }}
                                    className={`w-5 h-5 absolute transition-all duration-300 ease-in-out text-slate-600 group-hover:text-indigo-600 ${isMobileMenuOpen
                                        ? 'opacity-100 rotate-0 scale-100'
                                        : 'opacity-0 rotate-180 scale-75'
                                        }`}
                                />
                            </div>
                        </Button>
                    </div>
                </SignedIn>
            </div>

            {/* Enhanced Mobile Menu */}
            <SignedIn>
                <div
                    className={`lg:hidden border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/50 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-out mobile-menu-container ${isMobileMenuOpen
                        ? 'max-h-96 opacity-100 shadow-lg'
                        : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className={`flex flex-col space-y-3 p-6 transition-all duration-400 ease-out ${isMobileMenuOpen
                        ? 'translate-y-0'
                        : '-translate-y-8'
                        }`}>
                        {/* Mobile Pricing Button */}
                        <Button
                            asChild
                            variant='default'
                            className={`w-full justify-start bg-gradient-to-r from-indigo-700 to-violet-800 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 delay-75 group ${isMobileMenuOpen
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            <Link href='/dashboard/upgrade' onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                                <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="font-semibold">Upgrade to Premium</span>
                            </Link>
                        </Button>

                        {/* Mobile Documents Button */}
                        <Button
                            asChild
                            variant='outline'
                            className={`w-full justify-start border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 delay-100 group ${isMobileMenuOpen
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            <Link href='/dashboard/' onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                                <FileText className="w-4 h-4 group-hover:text-indigo-600 transition-colors duration-300" />
                                <span className="font-medium">My Documents</span>
                            </Link>
                        </Button>

                        {/* Mobile Upload Button */}
                        <Button
                            asChild
                            variant='outline'
                            className={`w-full justify-start border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-300 delay-150 group ${isMobileMenuOpen
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            <Link href='/dashboard/upload' onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                                <div className="relative">
                                    <FilePlus2 className="text-indigo-600 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                                </div>
                                <span className="font-medium text-indigo-700">Upload Document</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </SignedIn>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm lg:hidden z-[-1] transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    )
}

export default Header