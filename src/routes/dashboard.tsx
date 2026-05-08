import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { supabase } from "../integrations/supabase/client"
import { useAuth } from "../lib/auth-context"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<any[]>([])
  const [projectName, setProjectName] = useState("")

  // Load Projects
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", user?.id)

    if (!error && data) {
      setProjects(data)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" })
    } else {
      loadProjects()
    }
  }, [user])

  // Create Project
  const createProject = async () => {
    if (!projectName.trim()) return

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: projectName,
          owner_id: user.id,
        },
      ])
      .select()

    if (!error && data) {
  const project = data[0]

  await supabase.from("files").insert([
    {
      project_id: project.id,
      filename: "main.js",
      language: "javascript",
      content: 'console.log("Hello World")',
    },
  ])

  setProjectName("")
  loadProjects()
}
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6 font-bold">
        Your Projects
      </h1>

      {/* Create Project */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-gray-900 border border-gray-700 p-3 rounded w-80"
        />

        <button
          onClick={createProject}
          className="bg-green-600 px-5 rounded"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-900 border border-gray-700 p-5 rounded cursor-pointer hover:border-green-500"
            onClick={() =>
              navigate({
                to: "/project/$id",
                params: { id: project.id },
              })
            }
          >
            <h2 className="text-xl font-semibold">
              {project.name}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              {new Date(project.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}