import { useEffect, useState } from "react"
import { supabase } from "../../integrations/supabase/client"
import { useAuth } from "../../lib/auth-context"

interface Props {
  projectId: string
}

export default function ChatPanel({
  projectId,
}: Props) {

  const { user } = useAuth()

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  // =========================
  // Load Messages
  // =========================

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
  }

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    loadMessages()
  }, [projectId])

  // =========================
  // Realtime Listener
  // =========================

  useEffect(() => {

    const channel = supabase
      .channel(`chat-${projectId}`)

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {

          const newMessage = payload.new as any

          // Only current project messages
          if (newMessage.project_id === projectId) {

            setMessages((prev) => {

              // Prevent duplicates
              const exists = prev.find(
                (msg) => msg.id === newMessage.id
              )

              if (exists) return prev

              return [...prev, newMessage]
            })
          }
        }
      )

      .subscribe((status) => {
        console.log("Realtime Status:", status)
      })

    return () => {
      supabase.removeChannel(channel)
    }

  }, [projectId])

  // =========================
  // Send Message
  // =========================

  const sendMessage = async () => {

    if (!text.trim()) return

    await supabase
      .from("messages")
      .insert([
        {
          project_id: projectId,
          user_email: user?.email,
          message: text,
        },
      ])

    setText("")
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-lg font-semibold">
          Team Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-gray-800 p-2 rounded"
          >
            <div className="text-xs text-green-400 mb-1">
              {msg.user_email}
            </div>

            <div className="text-sm">
              {msg.message}
            </div>
          </div>
        ))}

      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800">

        <div className="flex gap-2">

          <input
            type="text"
            placeholder="Type message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-black border border-gray-700 p-2 rounded"
          />

          <button
            onClick={sendMessage}
            className="bg-green-600 px-4 rounded"
          >
            Send
          </button>

        </div>

      </div>
    </div>
  )
}