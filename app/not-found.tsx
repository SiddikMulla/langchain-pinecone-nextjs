'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center px-4">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 opacity-80"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Clean, professional 404 */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-light text-gray-100 tracking-tight mb-4 select-none">
            404
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"></div>
        </div>

        {/* Professional heading */}
        <h2 className="text-2xl md:text-3xl font-medium text-gray-200 mb-6 tracking-wide">
          Page Not Found
        </h2>

        {/* Construction notice */}
        <div className="mb-8 p-4 border border-amber-800/30 bg-amber-900/10 rounded-lg max-w-md mx-auto">
          <div className="flex justify-center items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span className="text-amber-400 font-medium text-base">Under Construction</span>
          </div>
          <p className="text-amber-200/80 text-base">
            This page is currently being built. We're working hard to bring you something amazing.
          </p>
        </div>


        {/* Professional button group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:border-gray-500 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50"
          >
            Go Back
          </button>
        </div>

        {/* Subtle footer info */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Error Code: 404 • Page Not Found
          </p>
        </div>
      </div>

      {/* Minimal accent elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-gray-600 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 right-20 w-1 h-1 bg-gray-500 rounded-full opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gray-600 rounded-full opacity-30"></div>
    </div>
  )
}