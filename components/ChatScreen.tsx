'use client'

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Loader2Icon, SendIcon, AlertCircle, Bot, User, Sparkles, Copy, MessageCircle, BrainCircuitIcon, Pause, Play, Volume2, VolumeX, X, RotateCcw, SkipForward, Mic } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { databases, Query } from "@/lib/appwrite-client"
import { FormEvent, useEffect, useState, useTransition, useRef } from "react"
import { askQuestion } from "@/actions/askQuestion"
import ReactMarkdown from 'react-markdown'
import { toast } from "sonner"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

export type Message = {
    id?: string;
    role: "human" | "ai" | "placeholder";
    message: string;
    createdAt: Date;
    audioUrl?: string
};

const AISpeakingModal = ({
    isOpen,
    onClose,
    audioProgress,
    onReplay,
    onSkip,
    isPlaying,
    onTogglePlayPause
}: {
    isOpen: boolean;
    onClose: () => void;
    audioProgress: number;
    onReplay: () => void;
    onSkip: () => void;
    currentMessage: string;
    isPlaying: boolean;
    onTogglePlayPause: () => void;
}) => {
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [glowIntensity, setGlowIntensity] = useState(0.5);

    useEffect(() => {
        // Generate dynamic waveform data
        const generateWaveform = () => {
            const data = Array.from({ length: 32 }, () => Math.random() * 100 + 20);
            setWaveformData(data);
        };

        if (isPlaying) {
            const interval = setInterval(generateWaveform, 150);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        // Animate glow intensity
        const interval = setInterval(() => {
            setGlowIntensity(0.3 + Math.sin(Date.now() * 0.003) * 0.4);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="relative max-w-lg w-full mx-4">
                {/* Floating particles background */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main modal container */}
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl animate-pulse"></div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>

                    {/* Header section */}
                    <div className="relative p-8 pb-6">
                        {/* AI Avatar with advanced animations */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative mb-4">
                                {/* Outer glow rings */}
                                <div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-xl"
                                    style={{
                                        opacity: glowIntensity,
                                        transform: `scale(${1.5 + glowIntensity * 0.3})`
                                    }}
                                />


                                {/* Main avatar */}
                                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <Mic className="h-10 w-10 text-white animate-pulse" />
                                    </div>
                                </div>

                                {/* Pulsing rings */}
                                {isPlaying && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                                        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse delay-75" />
                                    </>
                                )}
                            </div>

                            {/* Title section */}
                            <div className="text-center">
                                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                                    DocuTalk
                                </h2>
                            </div>
                        </div>

                        {/* Advanced waveform visualization */}
                        <div className="mb-8">
                            <div className="flex items-end justify-center gap-1 h-20 mb-4">
                                {waveformData.map((height, i) => (
                                    <div
                                        key={i}
                                        className="bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150"
                                        style={{
                                            width: '3px',
                                            height: isPlaying ? `${height}%` : '20%',
                                            opacity: isPlaying ? 0.7 + Math.sin(i * 0.5) * 0.3 : 0.3,
                                            transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.5)',
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                                    style={{ width: `${audioProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                onClick={onReplay}
                                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 hover:shadow-lg"
                            >
                                <RotateCcw className="h-5 w-5 text-white" />
                            </button>

                            <button
                                onClick={onTogglePlayPause}
                                className="p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:scale-110 hover:shadow-blue-500/25"
                            >
                                {isPlaying ? (
                                    <Pause className="h-6 w-6 text-white" />
                                ) : (
                                    <Play className="h-6 w-6 text-white ml-1" />
                                )}
                            </button>

                            <button
                                onClick={onSkip}
                                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 hover:shadow-lg"
                            >
                                <SkipForward className="h-5 w-5 text-white" />
                            </button>
                        </div>

                        {/* Status indicator */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-3 text-white/80">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className="text-sm font-medium">
                                        {isPlaying ? "Playing..." : "Paused"}
                                    </span>
                                </div>
                                <div className="h-1 w-1 bg-white/40 rounded-full" />
                                <div className="flex items-center gap-1">
                                    <Volume2 className="h-4 w-4" />
                                    <span className="text-sm">HD Audio</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
            `}</style>
        </div>
    );
};

const ChatScreen = ({ id }: { id: string }) => {
    const { user } = useUser()
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    // TTS related states
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);
    const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>({});

    // Modal states
    const [showSpeakingModal, setShowSpeakingModal] = useState(false);
    const [currentPlayingMessage, setCurrentPlayingMessage] = useState<string>("");
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const quickPrompts = [
        "What is this document about?",
        "Summarize the main points",
        "Find information about...",
        "Generate actionable insights"
    ];

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Update the loadMessages useEffect to include audioUrl
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
                    audioUrl: doc.audioUrl || undefined,
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

    // Update the handleSubmit function in your ChatScreen component
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
                // Pass the TTS enabled state to the askQuestion function
                const { success, message, audioUrl } = await askQuestion(id, q, ttsEnabled);

                if (success) {
                    // Replace placeholder with AI response
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        newMessages[lastIndex] = {
                            role: "ai",
                            message: message || "I received your question but couldn't generate a response.",
                            createdAt: new Date(),
                            audioUrl: audioUrl || undefined,
                        };
                        return newMessages;
                    });

                    // If audio was generated and TTS is enabled, play it automatically with modal
                    if (audioUrl && ttsEnabled) {
                        // Small delay to ensure the message is rendered
                        setTimeout(() => {
                            setCurrentPlayingMessage(message || "");
                            setShowSpeakingModal(true);
                            const audio = new Audio(audioUrl);
                            audioRef.current = audio;

                            // Set up audio event listeners
                            audio.onloadstart = () => setCurrentlyPlayingId('auto-play');
                            audio.onended = () => {
                                setCurrentlyPlayingId(null);
                                setShowSpeakingModal(false);
                            };
                            audio.onerror = () => {
                                setCurrentlyPlayingId(null);
                                setShowSpeakingModal(false);
                                toast.error("Failed to play audio");
                            };

                            // Track progress
                            audio.ontimeupdate = () => {
                                const progress = (audio.currentTime / audio.duration) * 100;
                                setAudioProgress(prev => ({ ...prev, 'auto-play': progress }));
                            };

                            audio.play().catch(err => {
                                console.error('Auto-play failed:', err);
                                setShowSpeakingModal(false);
                            });
                        }, 500);
                    }
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

    const generateAudioForMessage = async (messageId: string, text: string) => {
        if (!text || text.trim().length === 0) {
            toast.error("No text to convert to audio");
            return;
        }

        setIsGeneratingAudio(messageId);
        try {
            console.log("Generating audio for message:", messageId);

            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text.trim(),
                    voice: "Aaliyah-PlayAI",
                    responseFormat: "wav"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const { audioUrl } = await response.json();

            if (!audioUrl) {
                throw new Error("No audio URL received from server");
            }

            // Update message with audio URL
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, audioUrl }
                    : msg
            ));

            toast.success("Audio generated successfully!");

            // Enhanced modal and audio playback
            setCurrentPlayingMessage(text);
            setShowSpeakingModal(true);
            setIsAudioPlaying(true);

            setTimeout(() => {
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                // Enhanced audio event listeners
                audio.onloadstart = () => {
                    setCurrentlyPlayingId(messageId);
                    setIsAudioPlaying(true);
                };

                audio.onplay = () => setIsAudioPlaying(true);
                audio.onpause = () => setIsAudioPlaying(false);

                audio.onended = () => {
                    setCurrentlyPlayingId(null);
                    setShowSpeakingModal(false);
                    setIsAudioPlaying(false);
                };

                audio.onerror = () => {
                    setCurrentlyPlayingId(null);
                    setShowSpeakingModal(false);
                    setIsAudioPlaying(false);
                    toast.error("Failed to play audio");
                };

                // Enhanced progress tracking
                audio.ontimeupdate = () => {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    setAudioProgress(prev => ({ ...prev, [messageId]: progress }));
                };

                audio.play().catch(err => {
                    console.error('Audio play failed:', err);
                    setShowSpeakingModal(false);
                    setIsAudioPlaying(false);
                    toast.error("Audio playback failed");
                });
            }, 500);

        } catch (error: any) {
            console.error('Audio generation failed:', error);
            toast.error(`Failed to generate audio: ${error.message}`);
        } finally {
            setIsGeneratingAudio(null);
        }
    };

    // Enhanced playAudio function
    const playAudio = (messageId: string, audioUrl: string) => {
        if (currentlyPlayingId === messageId) {
            // Stop current audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setCurrentlyPlayingId(null);
            setShowSpeakingModal(false);
            setIsAudioPlaying(false);
            return;
        }

        // Stop any current audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Find the message to get its text
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
            setCurrentPlayingMessage(message.message);
            setShowSpeakingModal(true);
            setIsAudioPlaying(true);
        }

        // Create new audio element
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Enhanced audio event listeners
        audio.onloadstart = () => {
            setCurrentlyPlayingId(messageId);
            setIsAudioPlaying(true);
        };

        audio.onplay = () => setIsAudioPlaying(true);
        audio.onpause = () => setIsAudioPlaying(false);

        audio.onended = () => {
            setCurrentlyPlayingId(null);
            setShowSpeakingModal(false);
            setIsAudioPlaying(false);
        };

        audio.onerror = () => {
            setCurrentlyPlayingId(null);
            setShowSpeakingModal(false);
            setIsAudioPlaying(false);
            toast.error("Failed to play audio");
        };

        // Enhanced progress tracking
        audio.ontimeupdate = () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            setAudioProgress(prev => ({ ...prev, [messageId]: progress }));
        };

        audio.play().catch(err => {
            console.error('Audio play failed:', err);
            setCurrentlyPlayingId(null);
            setShowSpeakingModal(false);
            setIsAudioPlaying(false);
            toast.error("Failed to play audio");
        });
    };

    // Enhanced modal control functions
    const handleCloseModal = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setShowSpeakingModal(false);
        setCurrentlyPlayingId(null);
        setIsAudioPlaying(false);
    };

    const handleTogglePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
                setIsAudioPlaying(true);
            } else {
                audioRef.current.pause();
                setIsAudioPlaying(false);
            }
        }
    };

    const handleReplayAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setAudioProgress(prev => ({
                ...prev,
                [currentlyPlayingId || 'auto-play']: 0
            }));
            audioRef.current.play();
            setIsAudioPlaying(true);
        }
    };

    const handleSkipAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = audioRef.current.duration;
            setAudioProgress(prev => ({
                ...prev,
                [currentlyPlayingId || 'auto-play']: 100
            }));
        }
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
        const isCurrentlyPlaying = currentlyPlayingId === messageId;
        const isGeneratingAudioForThis = isGeneratingAudio === messageId;

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
                                <BrainCircuitIcon className="h-4 w-4 text-white" />
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
                                ? ('You')
                                : isPlaceholder
                                    ? 'DocuChat'
                                    : 'DocuChat'
                            }
                        </span>
                        <span className="text-xs text-gray-400">
                            {message.createdAt.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative rounded-2xl px-4 py-3 shadow-sm ${isHuman
                        ? 'bg-blue-600 text-white rounded-tr-md'
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
                                            <pre className="bg-gray-00 text-gray-800 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
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

                        {/* Audio Progress Bar */}
                        {isCurrentlyPlaying && audioProgress[messageId] && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                                    style={{ width: `${audioProgress[messageId]}%` }}
                                />
                            </div>
                        )}

                        {/* Action buttons for AI messages */}
                        {!isHuman && !isPlaceholder && (
                            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute -bottom-8 left-0 flex ">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-1 text-gray-400 hover:text-gray-600"
                                    onClick={() => copyToClipboard(message.message, messageId)}
                                >
                                    <Copy className="h-5 w-5" />
                                    {copiedMessageId === messageId && (
                                        <span className="ml-1 text-xs">Copied!</span>
                                    )}
                                </Button>

                                {/* Audio Controls */}
                                {message.audioUrl ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-1 text-gray-400 hover:text-blue-600"
                                        onClick={() => playAudio(messageId, message.audioUrl!)}
                                        disabled={isGeneratingAudioForThis}
                                    >
                                        {isCurrentlyPlaying ? (
                                            <Pause className="h-6 w-6" />
                                        ) : (
                                            <Play className="h-6 w-6" />
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-gray-400 hover:text-blue-600"
                                        onClick={() => generateAudioForMessage(messageId, message.message)}
                                        disabled={isGeneratingAudioForThis}
                                    >
                                        {isGeneratingAudioForThis ? (
                                            <Loader2Icon className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Volume2 className="h-6 w-6" />
                                        )}
                                    </Button>
                                )}
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
            {/* AI Speaking Modal */}
            <AISpeakingModal
                isOpen={showSpeakingModal}
                onClose={handleCloseModal}
                audioProgress={audioProgress[currentlyPlayingId || 'auto-play'] || 0}
                onReplay={handleReplayAudio}
                onSkip={handleSkipAudio}
                currentMessage={currentPlayingMessage}
                isPlaying={isAudioPlaying}
                onTogglePlayPause={handleTogglePlayPause}
            />
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center"> */}
                    <Sparkles className="h-5 w-5 text-indigo-800" />
                    {/* </div> */}
                    <div>
                        <h3 className="font-bold text-gray-900">
                            <span className="text-indigo-600">Docu</span>Chat
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* TTS Toggle */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="tts-mode"
                            checked={ttsEnabled}
                            onCheckedChange={setTtsEnabled}
                        />
                        <Label htmlFor="tts-mode" className="text-sm font-medium cursor-pointer">
                            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Label>
                        <span className="text-xs text-gray-500">
                            {ttsEnabled ? "Audio On" : "Audio Off"}
                        </span>
                    </div>

                    <Badge variant="outline" className="text-green-700 border-green-700">
                        <div className="h-2 w-2 bg-green-700 rounded-full mr-2"></div>
                        Online
                    </Badge>
                </div>
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
                    <div className="text-center py-16 px-6 max-w-4xl mx-auto">
                        {/* Hero Section */}
                        <div className="mb-12">
                            <div className="inline-flex items-center justify-center w-15 h-15 bg-gradient-to-br from-blue-400 to-violet-600 rounded-full mb-6 shadow-lg">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>

                            <h1 className="text-4xl font-bold mb-4">
                                Welcome back, {user?.firstName || 'there'}! 👋
                            </h1>

                            <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                I'm your intelligent document companion, powered by advanced AI to help you unlock insights,
                                analyze content, and get answers from your documents in seconds.
                            </p>

                        </div>

                        {/* Quick Start Section */}
                        <div className="mx-auto max-w-xl bg-gradient-to-r from-indigo-50/50 to-indigo-50/50 rounded-2xl p-8 border border-blue-100">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
                                <MessageCircle className="w-6 h-6 text-blue-500" />
                                Get Started - Try These Commands
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-xl">
                                {quickPrompts.map((prompt, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:bg-purple-500 transition-colors duration-200"></div>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {prompt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
                <div className="flex gap-3 items-center max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                        <Input
                            className="pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl py-6 px-4"
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
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-indigo-700 rounded-full px-6 py-3 shadow-lg"
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

export default ChatScreen