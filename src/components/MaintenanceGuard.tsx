import { useEffect, useState } from 'react'
import { getMaintenanceConfig, MaintenanceConfig } from '@/services/maintenance'
import MaintenancePage from '@/pages/MaintenancePage'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<MaintenanceConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    let mounted = true
    const fetchConfig = async () => {
      try {
        const data = await getMaintenanceConfig()
        if (mounted) setConfig(data)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchConfig()
    return () => {
      mounted = false
    }
  }, [])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (config?.is_active && !user) {
    return <MaintenancePage config={config} />
  }

  return <>{children}</>
}
