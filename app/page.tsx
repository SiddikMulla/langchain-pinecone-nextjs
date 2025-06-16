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
  CheckCircleIcon
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";
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

export default function Home() {
  return (
    <>
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
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-medium rounded-lg border-2 border-gray-300 hover:border-indigo-300 transition-colors">
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
              {features.map((feature, index) => (
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

        {/* Stats Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Trusted by professionals worldwide
              </h2>
              <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white lg:text-5xl">1K+</div>
                  <div className="mt-2 text-indigo-100">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white lg:text-5xl">1M+</div>
                  <div className="mt-2 text-indigo-100">Documents Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white lg:text-5xl">99.9%</div>
                  <div className="mt-2 text-indigo-100">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white lg:text-5xl">24/7</div>
                  <div className="mt-2 text-indigo-100">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}