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
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import landingIMG from '@/public/landing.png'
import UpdateNotificationHeader from "@/components/newUpdates";

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
      <div className="flex-1 overflow-scroll p-1 lg:p-2 bg-gradient-to-bl from-violet-500 via-indigo-400 to-purple-700">
        <UpdateNotificationHeader />
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Hero Section */}
          <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-indigo-50/40 px-4 py-2 text-base font-bold text-indigo-700 ring-1 ring-indigo-200">
                    DocuChat
                  </span>
                </div>

                <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                  Transform Your
                  <span className="relative">
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                      {" "}Documents
                    </span>
                  </span>
                  <br />
                  into Intelligent
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {" "}Chats
                  </span>
                </h1>

                <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-gray-700 sm:text-xl">
                  Experience the future of document interaction with AI that understands context,
                  remembers conversations, and delivers insights at the speed of thought.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg" className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-15 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Link href='/dashboard' className="flex items-center gap-3">
                      Get Started
                      <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 tracking-wide">
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
          <section className="relative px-4 pb-20 sm:px-6 lg:px-28">
            <div className="mx-auto max-w-8xl">
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
          <section className="px-4 py-10 sm:px-6 lg:px-8 bg-white">
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
    </>
  );
}