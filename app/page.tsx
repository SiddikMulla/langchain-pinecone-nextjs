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
import { useState, useEffect } from "react";
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

// Demo steps data - you can replace these with your actual GIF URLs
const demoSteps = [
  {
    id: 1,
    title: "Upload Your Documents",
    description: "Simply drag and drop your PDF files or click to browse and upload from your device.",
    gifUrl: "/demo-gifs/step1-upload.gif", // Replace with your actual GIF path
    duration: 4000 // 4 seconds
  },
  {
    id: 2,
    title: "AI Processing",
    description: "Our advanced AI analyzes your document structure and content for intelligent interaction.",
    gifUrl: "/demo-gifs/step2-processing.gif", // Replace with your actual GIF path
    duration: 3000 // 3 seconds
  },
  {
    id: 3,
    title: "Start Conversations",
    description: "Ask questions about your document content and get instant, accurate responses.",
    gifUrl: "/demo-gifs/step3-chat.gif", // Replace with your actual GIF path
    duration: 5000 // 5 seconds
  },
  {
    id: 4,
    title: "Extract Insights",
    description: "Get summaries, key points, and detailed analysis from your documents effortlessly.",
    gifUrl: "/demo-gifs/step4-insights.gif", // Replace with your actual GIF path
    duration: 4000 // 4 seconds
  }
];

// Demo Modal Component
function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-advance to next step
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const currentStepData = demoSteps[currentStep];
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (currentStepData.duration / 100));
        if (newProgress >= 200) {
          // Move to next step
          setCurrentStep((prevStep) => {
            const nextStep = (prevStep + 1) % demoSteps.length;
            return nextStep;
          });
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, isOpen, isPlaying]);

  // Reset progress when step changes
  useEffect(() => {
    setProgress(0);
  }, [currentStep]);

  const goToNextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DocuChat Demo</h2>
            <p className="text-gray-600 mt-1">See how DocuChat transforms your document workflow</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

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
                    onClick={() => setCurrentStep(index)}
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
                className="bg-indigo-600 h-1 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Demo Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
            {/* GIF/Image Display */}
            <div className="relative bg-gray-50 rounded-xl overflow-hidden">
              <div className="aspect-video flex items-center justify-center">
                {/* Replace this div with your actual GIF */}
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl font-bold text-indigo-600">{currentStep + 1}</span>
                    </div>
                    <p className="text-gray-600">
                      GIF: {demoSteps[currentStep].gifUrl}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Replace this placeholder with your actual GIF
                    </p>
                  </div>
                </div>
                {/* Uncomment this when you have actual GIFs */}
                {/* <Image
                  src={demoSteps[currentStep].gifUrl}
                  alt={demoSteps[currentStep].title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                /> */}
              </div>
            </div>

            {/* Step Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {demoSteps[currentStep].title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {demoSteps[currentStep].description}
                </p>
              </div>

              {/* Feature highlights for current step */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Key Features:</h4>
                <div className="space-y-2">
                  {currentStep === 0 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Drag & drop interface</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Multiple file format support</span>
                      </div>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>AI-powered content analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Intelligent indexing</span>
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
                        <span>Automated summaries</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Key insight extraction</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
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
        <main className="flex-1 overflow-y-auto  bg-gradient-to-br from-slate-50 via-white to-slate-100">
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