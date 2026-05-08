import { Outlet } from "@tanstack/react-router"
import { useAuth } from "./lib/auth-context"

function App() {
  const { user, signOut } = useAuth()

  return (
    <div className="h-screen bg-black text-white">
      <div className="p-4 border-b border-gray-700 flex justify-between">
        🚀 CodeSync Platform

        {user && (
          <button onClick={signOut} className="text-red-400">
            Logout
          </button>
        )}
      </div>

      <Outlet />
    </div>
  )
}

export default App