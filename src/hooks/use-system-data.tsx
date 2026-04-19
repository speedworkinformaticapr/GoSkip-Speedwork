import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

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
  const [data, setData] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSystemData = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setData({
          id: SYSTEM_DATA_ID,
          razao_social: 'Speedwork Informática',
          slogan: 'A plataforma de gestão ideal',
          cnpj: '00.000.000/0001-00',
          email: 'contato@speedwork.com',
          phone: '(11) 99999-9999',
          dark_mode: false,
          language: 'pt-BR',
        })
        setLoading(false)
        return
      }

      try {
        const { data: sysData, error } = await supabase
          .from('system_data')
          .select('*')
          .eq('id', SYSTEM_DATA_ID)
          .single()

        if (error && error.code !== 'PGRST116') {
          const isFetchError =
            error.message === 'Failed to fetch' ||
            error.message?.includes('Failed to fetch') ||
            (error as any).details?.includes('Failed to fetch')
          if (!isFetchError) {
            console.error('Error fetching system data', error)
          }
        }

        if (sysData) {
          setData(sysData)
        } else {
          // Default data if table is empty or Supabase not connected
          setData({
            id: SYSTEM_DATA_ID,
            razao_social: 'Speedwork Informática',
            slogan: 'A plataforma de gestão ideal',
            cnpj: '00.000.000/0001-00',
            email: 'contato@speedwork.com',
            phone: '(11) 99999-9999',
            dark_mode: false,
            language: 'pt-BR',
          })
        }
      } catch (error: any) {
        const isFetchError =
          error?.message === 'Failed to fetch' ||
          error?.message?.includes?.('Failed to fetch') ||
          (error instanceof TypeError && error.message === 'Failed to fetch')
        if (!isFetchError) {
          console.error('Exception fetching system data', error)
        }
        setData({
          id: SYSTEM_DATA_ID,
          razao_social: 'Speedwork Informática',
          slogan: 'A plataforma de gestão ideal',
          cnpj: '00.000.000/0001-00',
          email: 'contato@speedwork.com',
          phone: '(11) 99999-9999',
          dark_mode: false,
          language: 'pt-BR',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSystemData()
  }, [])

  const updateData = async (updates: Partial<SystemData>) => {
    try {
      const { error } = await supabase.from('system_data').update(updates).eq('id', SYSTEM_DATA_ID)

      if (error) throw error

      setData((prev) => (prev ? { ...prev, ...updates } : null))
      toast({ title: 'Sucesso', description: 'Configurações atualizadas com sucesso.' })
      return true
    } catch (error) {
      console.error('Error updating system data:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar configurações.',
        variant: 'destructive',
      })
      return false
    }
  }

  return (
    <SystemDataContext.Provider value={{ data, loading, updateData }}>
      {children}
    </SystemDataContext.Provider>
  )
}
