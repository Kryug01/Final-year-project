import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

import {
  Code2,
  Users,
  Zap,
  MessageSquare,
  Play,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,transparent_70%)] opacity-40" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-800">

        <div className="flex items-center gap-2 text-2xl font-bold">
          <Code2 className="text-green-500" />
          <span>CodeSync</span>
        </div>

        <div className="flex gap-4">

          <Link to="/login">
            <button className="px-5 py-2 border border-gray-700 rounded-lg hover:bg-gray-900 transition">
              Login
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition">
              Open Dashboard
            </button>
          </Link>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">

        <div className="mb-6 text-green-500 font-semibold uppercase tracking-widest">
          Real-time Collaborative IDE
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold max-w-5xl leading-tight">

          Code Together.
          <br />

          Build Faster.

        </h1>

        <p className="mt-8 text-gray-400 text-lg max-w-2xl leading-relaxed">

          A cloud-based collaborative coding platform with
          realtime editing, live chat, code execution,
          and multi-user workspaces.

        </p>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">

          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-green-500/20 transition">
              Start Coding Free
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="border border-gray-700 hover:bg-gray-900 px-8 py-4 rounded-xl text-lg transition">
              Open Workspace
            </button>
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="relative z-10 px-8 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          <FeatureCard
            icon={<Zap className="text-green-500" />}
            title="Realtime Sync"
            description="Collaborate instantly with live code synchronization."
          />

          <FeatureCard
            icon={<Users className="text-green-500" />}
            title="Team Collaboration"
            description="Invite teammates and code together in shared projects."
          />

          <FeatureCard
            icon={<MessageSquare className="text-green-500" />}
            title="Integrated Chat"
            description="Communicate with collaborators without leaving the IDE."
          />

          <FeatureCard
            icon={<Play className="text-green-500" />}
            title="Run Code"
            description="Execute JavaScript directly inside the browser workspace."
          />

        </div>

      </section>

    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur-md hover:border-green-500 transition-all duration-300">

      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>

    </div>
  )
}