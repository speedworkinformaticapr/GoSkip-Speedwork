import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

export interface Profile {
  id: string
  email: string
  name: string | null
  role: string
  avatarUrl: string | null
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
  const getProfileFromRecord = (record: any): Profile | null => {
    if (!record) return null
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role || 'user',
      avatarUrl: record.avatar ? pb.files.getURL(record, record.avatar) : null,
    }
  }

  const getRolesFromRecord = (record: any): string[] => {
    if (!record) return ['user']
    const role = record.role || 'user'
    // Map master to include admin so existing UI routes work transparently
    if (role.toLowerCase() === 'master') return ['admin', 'master']
    return [role]
  }

  const [user, setUser] = useState<any | null>(pb.authStore.record)
  const [session, setSession] = useState<any | null>(
    pb.authStore.token ? { access_token: pb.authStore.token } : null,
  )
  const [profile, setProfile] = useState<Profile | null>(getProfileFromRecord(pb.authStore.record))
  const [roles, setRoles] = useState<string[]>(getRolesFromRecord(pb.authStore.record))
  const [activeRole, setActiveRoleState] = useState<string | null>(
    getRolesFromRecord(pb.authStore.record)[0],
  )

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection('users').authRefresh()
        } else {
          pb.authStore.clear()
        }
      } catch (error) {
        pb.authStore.clear()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (!mounted) return
      setUser(record)
      setSession(token ? { access_token: token } : null)

      const newProfile = getProfileFromRecord(record)
      const newRoles = getRolesFromRecord(record)

      setProfile(newProfile)
      setRoles(newRoles)
      setActiveRoleState(newRoles[0])
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const setActiveRole = (role: string) => {
    setActiveRoleState(role)
  }

  const signUp = async (email: string, password: string, metaData?: any) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name: metaData?.name || '',
        role: metaData?.role || 'user',
      })
      const authData = await pb.collection('users').authWithPassword(email, password)
      return { user: authData.record, session: { access_token: authData.token }, error: null }
    } catch (error) {
      return { user: null, session: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      pb.authStore.clear()
      return { error: null }
    } catch (error) {
      return { error }
    }
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
