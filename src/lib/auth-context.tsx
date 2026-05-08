import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import type { ReactNode } from "react"

import type { User } from "@supabase/supabase-js"

import { supabase } from "../integrations/supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean

  signUp: (
    email: string,
    password: string
  ) => Promise<any>

  signIn: (
    email: string,
    password: string
  ) => Promise<any>

  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }

  }, [])

  const signUp = async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  }

  const signIn = async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    )
  }

  return context
}