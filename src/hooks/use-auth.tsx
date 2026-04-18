import { createContext, useContext, useState, ReactNode } from 'react'

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
  const [user] = useState<any | null>({ id: 'mock-user-1', email: 'admin@example.com' })
  const [session] = useState<any | null>({ access_token: 'mock-token' })
  const [profile] = useState<Profile | null>({
    id: 'mock-user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  })
  const [roles] = useState<string[]>(['admin', 'user'])
  const [activeRole, setActiveRoleState] = useState<string | null>('admin')
  const [loading] = useState(false)

  const setActiveRole = (role: string) => {
    setActiveRoleState(role)
  }

  const signUp = async () => ({ user: null, session: null, error: null })
  const signIn = async () => ({ error: null })
  const signOut = async () => ({ error: null })

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
