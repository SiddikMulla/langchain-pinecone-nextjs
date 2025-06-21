'use client'

import useUpload, { StatusText } from '@/hooks/useUpload'
import {
    CheckCircleIcon,
    CircleArrowDown,
    HammerIcon,
    RocketIcon,
    SaveIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { JSX, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

const FileUploader = () => {
    const { progress, status, fileId, handleUpload } = useUpload()
    const router = useRouter()

    useEffect(() => {
        if (fileId) {
            router.push(`/dashboard/files/${fileId}`)
        }
    }, [fileId, router])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            await handleUpload(file)
        } else {
            // handle error (e.g. toast)
        }
    }, [handleUpload])

    const statusIcons: Record<StatusText, JSX.Element> = {
        [StatusText.UPLOADING]: <RocketIcon className="h-20 w-20 text-indigo-700 animate-bounce" />,
        [StatusText.UPLOADED]: <CheckCircleIcon className="h-20 w-20 text-indigo-700" />,
        [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-700" />,
        [StatusText.GENERATING]: (
            <HammerIcon className="h-20 w-20 text-indigo-700 animate-bounce" />
        ),
    }


    const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
        },
    })

    const uploadInProgress = progress != null && progress >= 0 && progress <= 100

    const statusIcon = status && status in statusIcons
        ? statusIcons[status as StatusText]
        : <CircleArrowDown className="h-20 w-20 text-gray-400" />

    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
            {uploadInProgress ? (
                <div className="mt-32 flex flex-col justify-center items-center gap-5">
                    <div
                        className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${progress === 100 ? 'hidden' : ''
                            }`}
                        role="progressbar"
                        style={
                            {
                                '--value': progress,
                                '--size': '12rem',
                                '--thickness': '1.3rem',
                            } as React.CSSProperties & {
                                '--value': number
                                '--size': string
                                '--thickness': string
                            }
                        }
                    >
                        {progress}%
                    </div>
                    {statusIcon}
                    <p className="text-indigo-600 animate-plus">{status}</p>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`p-10 border-1 shadow-lg border-dashed mt-15 w-[75%] border-indigo-600 text-indigo-600 rounded-4xl h-85 flex items-center justify-center hover:bg-indigo-50 cursor-pointer ${isFocused || isDragActive ? 'bg-indigo-200' : 'bg-slate-50'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <>
                                <RocketIcon className="h-15 w-15 animate-ping" />
                                <p>Drop the files here ...</p>
                            </>
                        ) : (
                            <>
                                <CircleArrowDown className="h-18 w-18 animate-bounce" />
                                <p>Drag n drop some files here, or click to select files</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FileUploader
