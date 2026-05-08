import { useEffect, useState } from "react"
import { useParams } from "@tanstack/react-router"

import { supabase } from "../integrations/supabase/client"
import { runJavaScript } from "../lib/run-js"

import FileExplorer from "../components/workspace/FileExplorer"
import EditorPanel from "../components/workspace/EditorPanel"
import ConsolePanel from "../components/workspace/ConsolePanel"
import ChatPanel from "../components/workspace/ChatPanel"

export default function ProjectWorkspace() {
  const { id } = useParams({ from: "/project/$id" })

  const [files, setFiles] = useState<any[]>([])
  const [activeFile, setActiveFile] = useState<any>(null)

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")

  // =========================
  // Load Files
  // =========================

  const loadFiles = async () => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("project_id", id)

    if (error) {
      console.error(error)
      return
    }

    if (data) {
      setFiles(data)

      if (data.length > 0) {
        setActiveFile(data[0])
        setCode(data[0].content)
      }
    }
  }

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    loadFiles()
  }, [])

  // =========================
  // Realtime Collaboration
  // =========================

  useEffect(() => {
    const channel = supabase
      .channel("realtime-files")

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "files",
        },
        (payload) => {
          const updatedFile = payload.new as any

          // Update file list
          setFiles((prev) =>
            prev.map((file) =>
              file.id === updatedFile.id
                ? updatedFile
                : file
            )
          )

          // Prevent overwrite while typing
          if (
            activeFile?.id === updatedFile.id &&
            updatedFile.content !== code
          ) {
            setCode(updatedFile.content)
          }
        }
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeFile, code])

  // =========================
  // Change Active File
  // =========================

  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content)
    }
  }, [activeFile])

  // =========================
  // Auto Save
  // =========================

  useEffect(() => {
    if (!activeFile) return

    const timeout = setTimeout(async () => {
      await supabase
        .from("files")
        .update({
          content: code,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeFile.id)
    }, 500)

    return () => clearTimeout(timeout)
  }, [code, activeFile])

  const runCode = async () => {

  if (!activeFile) return

  if (activeFile.language === "javascript") {

    const result = await runJavaScript(code)

    setOutput(result)
  }
}
  return (
    <div className="h-screen flex flex-col bg-black text-white">

      {/* Top Bar */}
<div className="h-12 border-b border-gray-800 flex items-center px-4">

  <div className="flex justify-between w-full items-center">

    <span>
      Collaborative Workspace
    </span>

    <button
      onClick={runCode}
      className="bg-green-600 px-4 py-1 rounded"
    >
      Run Code
    </button>

  </div>

</div>

      {/* Main IDE */}
      <div className="flex flex-1 overflow-hidden">

        {/* File Explorer */}
        <div className="w-60 border-r border-gray-800">
          <FileExplorer
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />
        </div>

        {/* Editor Section */}
        <div className="flex-1 flex flex-col">

          {/* Editor */}
          <div className="flex-1">
            <EditorPanel
              code={code}
              setCode={setCode}
              language={activeFile?.language || "javascript"}
            />
          </div>

          {/* Console */}
          <div className="h-40">
            <ConsolePanel output={output} />
          </div>

        </div>

        {/* Chat */}
        <div className="w-72 border-l border-gray-800">
          <ChatPanel projectId={id} />
        </div>

      </div>
    </div>
  )
}