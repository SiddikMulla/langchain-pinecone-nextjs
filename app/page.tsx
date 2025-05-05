import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon
} from "lucide-react"

const features = [
  {
    name: 'Store Your PDF Documents',
    description: 'Keep all your important PDF files Securely stored and easily accessible anytime,anywhere',
    icon: GlobeIcon
  },
  {
    name: 'Blazing Fast Responses',
    description: 'Experience Lightning Fast answers to your queries',
    icon: ZapIcon
  },
  {
    name: 'Chat Memorisation',
    description: 'our Intelligent chatbot remembers previous interactions',
    icon: BrainCogIcon
  },
  {
    name: 'Interactive PDF viewer',
    description: 'Engage with your PDFs like never before using our intruitive and interactive viewer',
    icon: EyeIcon
  },
  {
    name: 'Cloud Backup',
    description: 'Rest assure knowing your documents are safely backed up on cloud',
    icon: ServerCogIcon
  },
  {
    name: 'Responsive Across Devices',
    description: 'Access and chat with your PDFs Seamlessly',
    icon: MonitorSmartphoneIcon
  },
]

export default function Home() {
  return (
    <>
      <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
        <div>
          <div className="bg-white py-24 text-center font-bold lg:text-2xl sm:py-32 rounded-md drop-shadow-xl">
            Started pdf to chat
          </div>
        </div>
      </main>
    </>
  );
}
