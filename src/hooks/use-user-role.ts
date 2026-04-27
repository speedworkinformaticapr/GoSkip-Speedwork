import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'

export function useUserRole() {
  const { user, profile } = useAuth()
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

      // Check global admin based on emails or master role
      const adminEmails = ['ias2371@gmail.com', 'souzaivan31@gmail.com', 'admin@footgolfpr.com.br']
      const userIsAdmin =
        adminEmails.includes(user.email || '') ||
        profile?.role === 'master' ||
        profile?.role === 'admin'

      if (mounted) {
        setIsAdmin(userIsAdmin)
        setIsClubAdmin(profile?.role === 'club' || profile?.role === 'club_admin')
        setClubId(user.club_id || null)
        setLoading(false)
      }
    }
    checkRoles()
    return () => {
      mounted = false
    }
  }, [user, profile])

  return { isAdmin, isClubAdmin, clubId, loading }
}
