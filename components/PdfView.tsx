'use client'

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react"

// 🔧 Appwrite CORS Setup for Storage Access
// 1. Go to Appwrite Console → Project Settings → Platforms
//    - Add "Web App" platform
//    - Set Allowed Origins: http://localhost:3000 (or your domain)
//    - Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
//    - Allowed Headers: * (or Authorization, Content-Type)
// 2. (Optional) For buckets: Storage → Your Bucket → Settings → CORS
//    - Set same origins, headers, and methods as above
// 🔗 Docs: https://appwrite.io/docs/advanced/platforms#cors

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfView = ({ url }: { url: string }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);


    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(url)
            const file = await response.blob()

            setFile(file)
        }
        fetchFile()
    }, [url])

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages)
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="sticky top-0 z-50 bg-gray-100 p-2 rounded-b-lg">
                <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
                    <Button
                        variant='outline'
                        disabled={pageNumber === 1}
                        onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1)
                            }
                        }}
                    >
                        Previous
                    </Button>
                    <p className="flex items-center justify-center">
                        {pageNumber} of {numPages}
                    </p>
                    <Button
                        variant='outline'
                        disabled={pageNumber === numPages}
                        onClick={() => {
                            if (numPages) {
                                if (pageNumber < numPages) {
                                    setPageNumber(pageNumber + 1)
                                }
                            }
                        }}
                    >
                        Next
                    </Button>
                </div>
            </div>
            {!file ? (
                <>
                    <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
                </>
            ) : (
                <Document
                    loading={null}
                    file={file}
                    rotate={rotation}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="m-4 overflow-scroll"
                >
                    <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
                </Document>
            )}
        </div >
    )
}
export default PdfView