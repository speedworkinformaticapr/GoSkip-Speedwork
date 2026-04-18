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
  return {
    id: '00000000-0000-0000-0000-000000000001',
    is_active: false,
    title: 'Manutenção',
    message: 'Voltamos em breve',
    return_date: null,
    bg_color: '#ffffff',
    text_color: '#000000',
    font_family: 'sans',
    bg_image_url: null,
    whatsapp_url: null,
    instagram_url: null,
    facebook_url: null,
  } as MaintenanceConfig
}

export const updateMaintenanceConfig = async (config: Partial<MaintenanceConfig>) => {
  const current = await getMaintenanceConfig()
  return { ...current, ...config } as MaintenanceConfig
}
