import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Profile {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: any | null
  session: any | null
  profile: Profile | null
  roles: string[]
  activeRole: string | null
  setActiveRole: (role: string) => void
  signUp: (
    email: string,
    password: string,
    metaData?: any,
  ) => Promise<{ user: any | null; session: any | null; error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>(['user'])
  const [activeRole, setActiveRoleState] = useState<string | null>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (data && mounted) {
          setProfile({
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role || 'user',
          })
          const userRoles = [data.role || 'user']
          setRoles(userRoles)
          setActiveRoleState(userRoles[0])
        }
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
      } catch (error) {
        console.error('Exception fetching profile:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            fetchProfile(session.user.id)
          } else {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error getting session:', error)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
        setRoles(['user'])
        setActiveRoleState('user')
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const setActiveRole = (role: string) => {
    setActiveRoleState(role)
  }

  const signUp = async (email: string, password: string, metaData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metaData },
    })
    return { user: data?.user, session: data?.session, error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        activeRole,
        setActiveRole,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
