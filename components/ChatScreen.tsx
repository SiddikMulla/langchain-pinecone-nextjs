'use client'

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Loader2Icon, SendIcon, AlertCircle, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown, CloudCog } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { databases, ID, Query } from "@/lib/appwrite-client"
import { FormEvent, useEffect, useState, useTransition, useRef } from "react"
import { askQuestion } from "@/actions/askQuestion"
import ReactMarkdown from 'react-markdown'

export type Message = {
    id?: string;
    role: "human" | "ai" | "placeholder";
    message: string;
    createdAt: Date;
};

const ChatScreen = ({ id }: { id: string }) => {
    const { user } = useUser()
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const loadMessages = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                setError(null);

                const res = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                    "chats",
                    [
                        Query.equal("userId", user.id),
                        Query.equal("docId", id),
                        Query.orderAsc("createdAt"),
                        Query.limit(100)
                    ]
                );

                const newMessages: Message[] = res.documents.map((doc) => ({
                    id: doc.$id,
                    role: doc.role,
                    message: doc.message,
                    createdAt: new Date(doc.createdAt),
                }));

                setMessages(newMessages);
            } catch (err) {
                console.error("Error loading messages:", err);
                setError("Failed to load chat history");
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [user, id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input.trim();
        if (!q) return;

        setInput("");
        setError(null);

        // Optimistic UI update - add user message immediately
        const userMessage: Message = {
            role: "human",
            message: q,
            createdAt: new Date(),
        };

        const placeholderMessage: Message = {
            role: "placeholder",
            message: "Thinking...",
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, placeholderMessage]);

        startTransition(async () => {
            try {
                const { success, message } = await askQuestion(id, q);

                if (success) {
                    // Replace placeholder with AI response
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        newMessages[lastIndex] = {
                            role: "ai",
                            message: message || "I received your question but couldn't generate a response.",
                            createdAt: new Date(),
                        };
                        return newMessages;
                    });
                } else {
                    // Replace placeholder with error message
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        newMessages[lastIndex] = {
                            role: "ai",
                            message: message || "Sorry, I encountered an error. Please try again.",
                            createdAt: new Date(),
                        };
                        return newMessages;
                    });
                    setError(message || "Something went wrong");
                }
            } catch (err) {
                console.error("Error asking question:", err);
                // Replace placeholder with error message
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        role: "ai",
                        message: "Sorry, I encountered a network error. Please try again.",
                        createdAt: new Date(),
                    };
                    return newMessages;
                });
                setError("Network error occurred");
            }
        });
    };

    const copyToClipboard = async (text: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const getUserInitials = () => {
        if (!user?.firstName && !user?.lastName) {
            return user?.username?.slice(0, 2).toUpperCase() ||
                user?.emailAddresses[0]?.emailAddress?.slice(0, 2).toUpperCase() || 'U';
        }
        return `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
        const isHuman = message.role === "human";
        const isPlaceholder = message.role === "placeholder";
        const messageId = message.id || index.toString();

        return (
            <div className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : 'flex-row'} group`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {isHuman ? (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                                {getUserInitials()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                            {isPlaceholder ? (
                                <Loader2Icon className="h-4 w-4 text-white animate-spin" />
                            ) : (
                                <Bot className="h-4 w-4 text-white" />
                            )}
                        </div>
                    )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${isHuman ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {/* Header with name and time */}
                    <div className={`flex items-center gap-2 mb-1 ${isHuman ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-medium text-gray-600">
                            {isHuman
                                ? (user?.firstName || user?.username || 'You')
                                : isPlaceholder
                                    ? 'AI Assistant'
                                    : 'AI Assistant'
                            }
                        </span>
                        {!isHuman && !isPlaceholder && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                <Sparkles className="h-2.5 w-2.5 mr-1" />
                                AI
                            </Badge>
                        )}
                        <span className="text-xs text-gray-400">
                            {message.createdAt.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative rounded-2xl px-4 py-3 shadow-sm ${isHuman
                        ? 'bg-blue-500 text-white rounded-tr-md'
                        : isPlaceholder
                            ? 'bg-gray-100 text-gray-600 rounded-tl-md animate-pulse'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
                        }`}>
                        {/* Render markdown for AI messages, plain text for others */}
                        {!isHuman && !isPlaceholder ? (
                            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                                <ReactMarkdown
                                    components={{
                                        // Custom styling for markdown elements
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                        li: ({ children }) => <li className="text-sm">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                        code: ({ children }) => (
                                            <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
                                                {children}
                                            </code>
                                        ),
                                        pre: ({ children }) => (
                                            <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                                                {children}
                                            </pre>
                                        ),
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 mb-2">
                                                {children}
                                            </blockquote>
                                        ),
                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                                        h4: ({ children }) => <h4 className="text-sm font-semibold mb-1">{children}</h4>,
                                        h5: ({ children }) => <h5 className="text-sm font-semibold mb-1">{children}</h5>,
                                        h6: ({ children }) => <h6 className="text-sm font-semibold mb-1">{children}</h6>,
                                        hr: () => <hr className="border-gray-300 my-2" />,
                                        table: ({ children }) => (
                                            <table className="min-w-full border-collapse border border-gray-300 mb-2 text-xs">
                                                {children}
                                            </table>
                                        ),
                                        th: ({ children }) => (
                                            <th className="border border-gray-300 px-2 py-1 bg-gray-50 font-semibold text-left">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="border border-gray-300 px-2 py-1">
                                                {children}
                                            </td>
                                        ),
                                    }}
                                >
                                    {message.message}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.message}
                            </p>
                        )}

                        {/* Action buttons for AI messages */}
                        {!isHuman && !isPlaceholder && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 left-0 flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-gray-400 hover:text-gray-600"
                                    onClick={() => copyToClipboard(message.message, messageId)}
                                >
                                    <Copy className="h-3 w-3" />
                                    {copiedMessageId === messageId && (
                                        <span className="ml-1 text-xs">Copied!</span>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-gray-400 hover:text-green-600"
                                >
                                    <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-gray-400 hover:text-red-600"
                                >
                                    <ThumbsDown className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <Loader2Icon className="animate-spin h-6 w-6 text-indigo-600 mb-3" />
                    <p className="text-gray-600 font-medium">Loading your conversation...</p>
                    <p className="text-gray-400 text-sm mt-1">Preparing AI assistant</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                        <CloudCog className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">DocuChat</h3>
                        <p className="text-xs text-gray-500">Always ready to help with your documents</p>
                    </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                </Badge>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-400 hover:text-red-600 text-lg"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <Bot className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            👋 Hello, {user?.firstName || 'there'}!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            I'm your AI document assistant. I can help you understand, analyze, and extract insights from your document.
                        </p>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-md mx-auto">
                            <p className="text-sm font-medium text-gray-700 mb-2">Try asking me:</p>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>• "What is this document about?"</p>
                                <p>• "Summarize the main points"</p>
                                <p>• "Find information about..."</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageBubble
                            key={message.id || index}
                            message={message}
                            index={index}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border-t border-gray-200 p-4"
            >
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <Input
                            className="pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-full py-6 px-4"
                            placeholder={`Ask me anything about your document, ${user?.firstName || 'there'}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isPending}
                            maxLength={500}
                        />
                        {/* Character count for long messages */}
                        {input.length > 400 && (
                            <div className="absolute -top-6 right-0 text-xs text-gray-500">
                                {input.length}/500
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={!input.trim() || isPending}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full px-6 py-3 shadow-lg"
                    >
                        {isPending ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                        ) : (
                            <SendIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* User info and tips */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>Chatting as {user?.firstName || user?.username || 'User'}</span>
                    </div>
                    {messages.length === 0 && (
                        <span>💡 AI responses are generated - verify important information</span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ChatScreen;