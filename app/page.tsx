"use client"

import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import landingIMG from '@/public/landing.png'

const features = [
  {
    name: 'Secure Document Storage',
    description: 'Enterprise-grade security for all your PDF documents with encrypted storage and controlled access.',
    icon: GlobeIcon
  },
  {
    name: 'Lightning-Fast Processing',
    description: 'Advanced AI algorithms deliver instant responses to complex document queries with 99.9% accuracy.',
    icon: ZapIcon
  },
  {
    name: 'Contextual Memory',
    description: 'Our AI maintains conversation context, providing more relevant and personalized responses over time.',
    icon: BrainCogIcon
  },
  {
    name: 'Interactive Document Viewer',
    description: 'Navigate and interact with your documents through our intuitive, feature-rich PDF viewer.',
    icon: EyeIcon
  },
  {
    name: 'Automated Cloud Backup',
    description: 'Your documents are automatically backed up with 99.99% uptime guarantee and disaster recovery.',
    icon: ServerCogIcon
  },
  {
    name: 'Cross-Platform Access',
    description: 'Seamlessly work across desktop, tablet, and mobile devices with our responsive design.',
    icon: MonitorSmartphoneIcon
  },
]

const benefits = [
  "Reduce document review time by 80%",
  "Extract insights from complex documents instantly",
  "Collaborate with team members in real-time",
  "Enterprise-grade security and compliance"
]

// Demo steps data with MP4 videos
const demoSteps = [
  {
    id: 1,
    title: "Get Started with Login Into Dashboard",
    description: "Click on get started and get authenticate and navigate to dashboardy.",
    videoUrl: "/1.mp4", // Updated to match your file structure
    autoAdvanceDelay: 8000 // 8 seconds - longer for video content
  },
  {
    id: 2,
    title: "Upload Your Documents",
    description: "Simply drag and drop your PDF files or click to browse and upload from your device.",
    videoUrl: "/2.mp4", // Replace with your actual video path
    autoAdvanceDelay: 6000 // 6 seconds
  },
  {
    id: 3,
    title: "Start Conversations",
    description: "Ask questions about your document content and get instant, accurate responses.",
    videoUrl: "/3.mp4", // Replace with your actual video path
    autoAdvanceDelay: 10000 // 10 seconds
  },
  {
    id: 4,
    title: "Upgrade Your Plan",
    description: "Unlimited PDF uploads, No page limit per PDF, Unlimited messages, Advanced AI responses.",
    videoUrl: "/4.mp4", // Replace with your actual video path
    autoAdvanceDelay: 8000 // 8 seconds
  }
];

// Demo Modal Component
function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up intervals and timeouts
  const cleanupTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  };

  // Handle video events and progress tracking
  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = () => {
      if (isPlaying) {
        video.play().catch(console.error);
      }
    };

    const handleVideoEnded = () => {
      // Auto-advance to next step when video ends
      setCurrentStep((prevStep) => (prevStep + 1) % demoSteps.length);
    };

    const updateProgress = () => {
      if (video.duration && video.currentTime) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
      }
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('timeupdate', updateProgress);

    // Fallback auto-advance in case video doesn't load or play
    if (isPlaying) {
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        setCurrentStep((prevStep) => (prevStep + 1) % demoSteps.length);
      }, demoSteps[currentStep].autoAdvanceDelay);
    }

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('timeupdate', updateProgress);
      cleanupTimers();
    };
  }, [currentStep, isOpen, isPlaying]);

  // Handle play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Reset progress and video when step changes
  useEffect(() => {
    setProgress(0);
    const video = videoRef.current;
    if (video) {
      // Force video to load new source
      video.load();
      video.currentTime = 0;
      if (isPlaying) {
        video.play().catch(console.error);
      }
    }
  }, [currentStep, isPlaying]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanupTimers();
      setProgress(0);
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  const goToNextStep = () => {
    cleanupTimers();
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const goToPrevStep = () => {
    cleanupTimers();
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStep = (stepIndex: number) => {
    cleanupTimers();
    setCurrentStep(stepIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}

        {/* Content */}
        <div className="p-6">
          {/* Step Counter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <div className="flex gap-1">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevStep}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={togglePlayPause}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <PlayIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={goToNextStep}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-indigo-600 h-1 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Demo Content */}
          <div className="grid md:grid-cols-1 gap-8 items-center min-h-[00px]">
            {/* Video Display */}
            <div className="relative bg-gray-50 border-2 rounded-xl overflow-hidden">
              <div className="aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-xl"
                  muted
                  loop={false}
                  playsInline
                  preload="metadata"
                  key={currentStep} // Force re-render when step changes
                >
                  <source src={demoSteps[currentStep].videoUrl} type="video/mp4" />
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-2xl font-bold text-indigo-600">{currentStep + 1}</span>
                      </div>
                      <p className="text-gray-600">Video not available</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {demoSteps[currentStep].videoUrl}
                      </p>
                    </div>
                  </div>
                </video>
              </div>
            </div>

            {/* Step Description */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {demoSteps[currentStep].description}
                </p>
              </div>

              {/* Feature highlights for current step */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Key Features:</h4>
                <div className="space-y-2">
                  {currentStep === 0 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Authenticate with Your Email</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Secure session for user</span>
                      </div>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Drag n Drop Your pdf to secure cloud</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Vector Embedding</span>
                      </div>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Natural language queries</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Contextual understanding</span>
                      </div>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Upgrade to Pro</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Ready to transform your document workflow?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close Demo
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href='/dashboard' className="flex items-center gap-2">
                Get Started Free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <>
      <div className="flex-1 overflow-scroll p-2 lg:p-3 bg-gradient-to-bl from-white to-indigo-700">
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100">
          {/* Hero Section */}
          <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200">
                    DocuChat
                  </span>
                </div>

                <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Transform Your Documents into
                  <span className="block text-indigo-600 mt-2">Intelligent Conversations</span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                  DocuChat empowers professionals to interact with their documents using advanced AI.
                  Upload, analyze, and extract insights from your PDFs through natural conversation.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Link href='/dashboard' className="flex items-center gap-2">
                      Get Started Free
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsDemoModalOpen(true)}
                    className="px-8 py-3 text-lg font-medium rounded-lg border-2 border-gray-300 hover:border-indigo-300 transition-colors"
                  >
                    Watch Demo
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Product Preview Section */}
          <section className="relative px-4 pb-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                <div className="relative rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-gray-200 sm:p-8">
                  <Image
                    alt="DocuChat application interface showing PDF interaction capabilities"
                    src={landingIMG}
                    width={3532}
                    height={1542}
                    className="w-full rounded-xl shadow-lg ring-1 ring-gray-900/10"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                  Everything you need to work smarter
                </h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                  Powerful features designed for professionals who demand efficiency, security, and intelligence in their document workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-indigo-300 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                        <feature.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
}