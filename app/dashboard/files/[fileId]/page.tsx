import { adminDatabases } from "@/lib/appwrite-admin";
import { auth } from "@clerk/nextjs/server"
import PdfView from "@/components/PdfView";
import ChatScreen from "@/components/ChatScreen";

interface Props {
    params: Promise<{
        fileId: string
    }>
}

const ChatWithPDFPage = async ({ params }: Props) => {
    auth.protect()
    const { fileId } = await params;
    const document = await adminDatabases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
        fileId
    );

    const url = document.downloadUrl;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full overflow-hidden">
            {/* PDF View - shows first on mobile, second on desktop */}
            <div className="col-span-1 lg:col-span-2 bg-gray-100 border-r-2 lg:border-indigo-300 lg:-order-1 overflow-auto">
                <PdfView url={url} />
            </div>
            {/* Chat Screen - shows second on mobile, first on desktop */}
            <div className="col-span-1 lg:col-span-3 overflow-y-auto">
                <ChatScreen id={fileId} />
            </div>
        </div>
    )
}

export default ChatWithPDFPage