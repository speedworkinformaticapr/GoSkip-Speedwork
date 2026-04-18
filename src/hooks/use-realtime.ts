import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

/**
 * Hook for real-time subscriptions to a Supabase table.
 * Adapted from the original PocketBase hook to ensure compatibility
 * with existing components using useRealtime.
 */
export function useRealtime(
  tableName: string,
  callback: (data: any) => void,
  enabled: boolean = true,
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload: any) => {
          // Map Supabase events to the expected legacy PocketBase structure if needed
          const mappedEvent = {
            action:
              payload.eventType === 'INSERT'
                ? 'create'
                : payload.eventType === 'UPDATE'
                  ? 'update'
                  : 'delete',
            record: payload.eventType === 'DELETE' ? payload.old : payload.new,
          }
          callbackRef.current(mappedEvent)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tableName, enabled])
}

export default useRealtime
