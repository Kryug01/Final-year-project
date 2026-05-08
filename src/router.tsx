import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router"

import App from "./App"

import HomePage from "./routes/index"
import Login from "./routes/login"
import Dashboard from "./routes/dashboard"
import ProjectWorkspace from "./routes/project"

// 🌳 Root Route
const rootRoute = createRootRoute({
  component: App,
})

// 🏠 Public Landing Page
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

// 🔐 Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
})

// 📁 Dashboard Route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
})

// 💻 Project Workspace Route
const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$id",
  component: ProjectWorkspace,
})

// 🌲 Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  projectRoute,
])

// 🚀 Router Instance
export const router = createRouter({
  routeTree,
})