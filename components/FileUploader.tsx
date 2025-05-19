'use client'
import { CircleArrowDown, RocketIcon } from 'lucide-react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


const FileUploader = () => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
    }, [])
    const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({ onDrop })

    return (
        <div className='flex flex-col gap-4 items-center max-w-7xl mx-auto'>
            <div {...getRootProps()}
                className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 
                    rounded-lg h-96 flex items-center justify-center ${isFocused || isDragActive ? "bg-indigo-200" : 'bg-indigo-50'}`}
            >
                <div className='flex flex-col items-center justify-center'>
                    <input {...getInputProps()} />
                    {
                        isDragActive ? (
                            <>
                                <RocketIcon className='h-15 w-15 animate-ping' />
                                <p>Drop the files here ...</p>
                            </>
                        ) : (
                            <>
                                <CircleArrowDown className='h-15 w-15 animate-bounce' />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </>
                        )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader