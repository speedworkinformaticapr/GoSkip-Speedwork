export interface BillingConfig {
  id: string
  tenant_id: string
  auto_generate_enabled: boolean
  due_day: number
  due_month: number
  days_before_generation: number
}

export interface BillingLog {
  id: string
  execution_date: string
  status: 'success' | 'error'
  total_generated: number
  total_duplicates_avoided: number
  error_message: string | null
}

export const getBillingConfig = async (): Promise<BillingConfig | null> => {
  return {
    id: '1',
    tenant_id: '1',
    auto_generate_enabled: false,
    due_day: 10,
    due_month: 1,
    days_before_generation: 5,
  }
}

export const updateBillingConfig = async (config: Partial<BillingConfig>) => {
  return {
    id: '1',
    tenant_id: '1',
    auto_generate_enabled: false,
    due_day: 10,
    due_month: 1,
    days_before_generation: 5,
    ...config,
  } as BillingConfig
}

export const getBillingLogs = async (): Promise<BillingLog[]> => {
  return []
}

export const triggerBillingGeneration = async (manual = false) => {
  return { success: true }
}

export const calculateBillingVolume = async () => {
  return { volume: 0 }
}

export const processBillingBatch = async (targets: { type: string; id: string }[]) => {
  return { success: true }
}

export const finalizeBilling = async (stats: {
  generated: number
  avoided: number
  errors: number
}) => {
  return { success: true }
}
