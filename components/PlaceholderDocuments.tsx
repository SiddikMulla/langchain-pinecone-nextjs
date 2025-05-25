'use client'
import { PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const PlaceholderDocuments = () => {

    const router = useRouter()
    const handleClick = () => {
        ///check limit use who is using free 
        router.push('/dashboard/upload')
    };

    return (
        <Button
            onClick={handleClick}
            className="flex flex-col items-center justify-center w-64 h-80
          rounded-2xl bg-gray-200 hover:bg-gray-300 drop-shadow-md text-gray-400 cursor-pointer"
        >
            <PlusCircleIcon style={{ width: 67, height: 67 }} />
            <p className="text-base">Add a Document</p>
        </Button>
    )
}
export default PlaceholderDocuments