import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router"

import App from "./App"
import Login from "./routes/login"

// ✅ Auth imports
import { useAuth } from "./lib/auth-context"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import Dashboard from "./routes/dashboard"
import ProjectWorkspace from "./routes/project"

// 🔐 Protected Home Component
const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" })
    }
  }, [user, navigate])

  return (
    <div className="p-5 text-white">
      Dashboard (Protected)
    </div>
  )
}

// 🌳 Root Route
const rootRoute = createRootRoute({
  component: App,
})

// 🏠 Home Route (Protected)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
})

// 🔐 Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
})

// 💻 Project Route
const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$id",
  component: ProjectWorkspace,
})

// 🌲 Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  projectRoute,
])

// 🚀 Router Instance
export const router = createRouter({
  routeTree,
})