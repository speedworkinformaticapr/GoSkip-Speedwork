import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '@/lib/supabase/client'

export function useUserRole() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isClubAdmin, setIsClubAdmin] = useState(false)
  const [clubId, setClubId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function checkRoles() {
      if (!user) {
        if (mounted) {
          setIsAdmin(false)
          setIsClubAdmin(false)
          setClubId(null)
          setLoading(false)
        }
        return
      }

      // Check global admin
      const adminEmails = ['ias2371@gmail.com', 'souzaivan31@gmail.com', 'admin@footgolfpr.com.br']
      const userIsAdmin = adminEmails.includes(user.email || '')

      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_club_admin, club_id')
          .eq('id', user.id)
          .maybeSingle()

        if (mounted) {
          setIsAdmin(userIsAdmin)
          if (data) {
            setIsClubAdmin(!!data.is_club_admin)
            setClubId(data.club_id)
          } else {
            setIsClubAdmin(false)
            setClubId(null)
          }
          setLoading(false)
        }
      } catch (e) {
        // If athlete record doesn't exist, ignore and just set admin roles
        if (mounted) {
          setIsAdmin(userIsAdmin)
          setIsClubAdmin(false)
          setClubId(null)
          setLoading(false)
        }
      }
    }
    checkRoles()
    return () => {
      mounted = false
    }
  }, [user])

  return { isAdmin, isClubAdmin, clubId, loading }
}
