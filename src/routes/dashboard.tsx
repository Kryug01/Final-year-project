import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import { supabase } from "../integrations/supabase/client"
import { useAuth } from "../lib/auth-context"

export default function Dashboard() {

  const { user } = useAuth()

  const navigate = useNavigate()

  const [projects, setProjects] = useState<any[]>([])

  const [projectName, setProjectName] = useState("")

  // =========================
  // Load Projects
  // =========================

  const loadProjects = async () => {

    if (!user) return

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", user.id)

    if (!error && data) {
      setProjects(data)
    }

  }

  // =========================
  // Auth Check
  // =========================

  useEffect(() => {

    if (!user) {

      navigate({
        to: "/login",
      })

    } else {

      loadProjects()

    }

  }, [user])

  // =========================
  // Create Project
  // =========================

  const createProject = async () => {

    if (!user) return

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

      await supabase
        .from("files")
        .insert([
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

    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Your Projects
          </h1>

          <p className="text-gray-400 mt-2">
            Create and manage collaborative coding workspaces.
          </p>

        </div>

      </div>

      {/* Create Project */}

      <div className="flex gap-3 mb-10">

        <input
          type="text"
          placeholder="Enter Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(e.target.value)
          }
          className="bg-gray-900 border border-gray-700 p-3 rounded-lg w-80 outline-none focus:border-green-500"
        />

        <button
          onClick={createProject}
          className="bg-green-600 hover:bg-green-500 transition px-6 rounded-lg font-medium"
        >
          Create Project
        </button>

      </div>

      {/* Project List */}

      {projects.length === 0 ? (

        <div className="text-gray-500 border border-gray-800 rounded-xl p-10 text-center">

          No projects found.
          <br />
          Create your first collaborative workspace.

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {projects.map((project) => (

            <div
              key={project.id}
              className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-2xl p-6 cursor-pointer"
              onClick={() =>
                navigate({
                  to: "/project/$id",
                  params: {
                    id: project.id,
                  },
                })
              }
            >

              <h2 className="text-2xl font-semibold mb-3">
                {project.name}
              </h2>

              <p className="text-gray-400 text-sm">
                Created:
              </p>

              <p className="text-gray-300 mt-1">
                {new Date(
                  project.created_at
                ).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  )

}