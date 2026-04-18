import { createContext, useContext, useState, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

export const SYSTEM_DATA_ID = '00000000-0000-0000-0000-000000000001'

export interface SystemData {
  id: string
  logo_url?: string
  slogan?: string
  cnpj?: string
  razao_social?: string
  address_street?: string
  address_number?: string
  address_complement?: string
  address_city?: string
  address_state?: string
  address_zip?: string
  phone?: string
  email?: string
  mobile?: string
  responsible_name?: string
  responsible_cpf?: string
  responsible_role?: string
  responsible_email?: string
  responsible_phone?: string
  updated_at?: string
  bg_opacity?: number
  bg_image_url?: string
  menu_logo_size?: number
  browser_icon_url?: string
  show_cnpj?: boolean
  show_contact_bar?: boolean
  session_lifetime?: number
  ai_context?: string
  dark_mode?: boolean
  language?: string
  libras_enabled?: boolean
  two_factor_auth?: boolean
  two_factor_method?: string
  integrations?: Record<string, any>
  terms?: Record<string, any>
  records_per_page?: number
  business_hours?: Record<string, any>
}

interface SystemDataContextType {
  data: SystemData | null
  loading: boolean
  updateData: (updates: Partial<SystemData>) => Promise<boolean>
}

const SystemDataContext = createContext<SystemDataContextType>({
  data: null,
  loading: false,
  updateData: async () => false,
})

export const useSystemData = () => {
  const context = useContext(SystemDataContext)
  if (!context) throw new Error('useSystemData must be used within a SystemDataProvider')
  return context
}

export const SystemDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SystemData | null>({
    id: SYSTEM_DATA_ID,
    razao_social: 'Speedwork Informática',
    slogan: 'A plataforma de gestão ideal',
    cnpj: '00.000.000/0001-00',
    email: 'contato@speedwork.com',
    phone: '(11) 99999-9999',
    dark_mode: false,
    language: 'pt-BR',
  })
  const [loading] = useState(false)
  const { toast } = useToast()

  const updateData = async (updates: Partial<SystemData>) => {
    setData((prev) => (prev ? { ...prev, ...updates } : null))
    toast({ title: 'Sucesso', description: 'Configurações atualizadas com sucesso.' })
    return true
  }

  return (
    <SystemDataContext.Provider value={{ data, loading, updateData }}>
      {children}
    </SystemDataContext.Provider>
  )
}
