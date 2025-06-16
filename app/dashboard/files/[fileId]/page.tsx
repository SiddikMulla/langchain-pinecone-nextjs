import { adminDatabases } from "@/lib/appwrite-admin";
import { auth } from "@clerk/nextjs/server"
import PdfView from "@/components/PdfView";
import ChatScreen from "@/components/ChatScreen";
interface Props {
    params: {
        fileId: string
    }
}
const ChatWithPDFPage = async ({ params }: Props) => {
    auth.protect()
    // const { userId } = await auth();
    const { fileId } = await params;
    const document = await adminDatabases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
        fileId
    );

    const url = document.downloadUrl;
    return (
        <div className="grid lg:grid-cols-4 h-full overflow-hidden">
            {/* right */}
            <div className="col-span-5 lg:col-span-2 overflow-y-auto">
                {/* chat */}
                <ChatScreen id={fileId} />
            </div>
            {/* left */}
            <div className="col-span-5 lg:col-span-2 bg-gray-100 border-r-2 lg:border-indigo-300 lg:-order-1 overflow-auto">
                <PdfView url={url} />
            </div>
        </div>
    )
}
export default ChatWithPDFPage


