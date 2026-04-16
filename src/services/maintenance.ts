import { supabase } from '@/lib/supabase/client'

export interface MaintenanceConfig {
  id: string
  is_active: boolean
  title: string
  message: string
  return_date: string | null
  bg_color: string
  text_color: string
  font_family: string
  bg_image_url: string | null
  whatsapp_url: string | null
  instagram_url: string | null
  facebook_url: string | null
}

export const getMaintenanceConfig = async () => {
  const { data, error } = await supabase
    .from('maintenance_config')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching maintenance config:', error)
  }
  return data as MaintenanceConfig | null
}

export const updateMaintenanceConfig = async (config: Partial<MaintenanceConfig>) => {
  const { data, error } = await supabase
    .from('maintenance_config')
    .update(config)
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single()

  if (error) {
    console.error('Error updating maintenance config:', error)
    throw error
  }
  return data as MaintenanceConfig
}
