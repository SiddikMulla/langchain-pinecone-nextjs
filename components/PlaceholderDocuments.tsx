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
          rounded-xl bg-gray-100 hover:bg-gray-300 drop-shadow-md text-gray-400 cursor-pointer"
        >
            <PlusCircleIcon style={{ width: 49, height: 49 }} />
            <p>Add a Document</p>
        </Button>
    )
}
export default PlaceholderDocuments