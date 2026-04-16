import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface Profile {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  roles: string[]
  activeRole: string | null
  setActiveRole: (role: string) => void
  signUp: (
    email: string,
    password: string,
    metaData?: any,
  ) => Promise<{ user: User | null; session: Session | null; error: any }>
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
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [activeRole, setActiveRoleState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setActiveRole = (role: string) => {
    setActiveRoleState(role)
    localStorage.setItem('activeRole', role)
  }

  useEffect(() => {
    const fetchProfileAndRoles = async (userId: string) => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        setProfile(profileData as Profile)

        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
        let userRoles = rolesData?.map((r: any) => r.role) || []

        if (userRoles.length === 0 && profileData?.role) {
          userRoles = [profileData.role]
        }
        if (userRoles.length === 0) {
          userRoles = ['user']
        }

        setRoles(userRoles)

        const savedRole = localStorage.getItem('activeRole')
        if (savedRole && userRoles.includes(savedRole)) {
          setActiveRoleState(savedRole)
        } else {
          setActiveRoleState(userRoles[0])
          localStorage.setItem('activeRole', userRoles[0])
        }
      } catch (error) {
        console.error('Error fetching profile and roles:', error)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileAndRoles(session.user.id).finally(() => setLoading(false))
      } else {
        setProfile(null)
        setRoles([])
        setActiveRoleState(null)
        localStorage.removeItem('activeRole')
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileAndRoles(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, metaData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metaData,
      },
    })
    return { user: data?.user || null, session: data?.session || null, error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
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
