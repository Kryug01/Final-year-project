import { useState } from "react"
import { useAuth } from "../lib/auth-context"
import { useNavigate } from "@tanstack/react-router"

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    let res
    if (mode === "login") {
      res = await signIn(email, password)
    } else {
      res = await signUp(email, password)
    }

    if (res.error) {
      alert(res.error.message)
    } else {
      alert("Success ✅")
      navigate({ to: "/" })
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded w-80">
        <h2 className="text-xl mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-black border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 bg-black border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 p-2 mb-2">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p
          className="text-sm cursor-pointer"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          {mode === "login"
            ? "Create account"
            : "Already have account?"}
        </p>
      </form>
    </div>
  )
}