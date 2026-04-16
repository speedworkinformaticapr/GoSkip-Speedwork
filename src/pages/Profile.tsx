import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    cpf: '',
    phone: '',
    handicap: 0,
    category: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('athletes')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          if (error.code !== 'PGRST116') {
            // PGRST116 = JSON object requested, multiple (or no) rows returned
            console.error('Error fetching profile:', error)
          }
        } else if (data) {
          setProfile({
            name: data.name || '',
            cpf: data.cpf || '',
            phone: data.phone || '',
            handicap: data.handicap || 0,
            category: data.category || '',
          })
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      // Check if athlete exists
      const { data: existingAthlete } = await supabase
        .from('athletes')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingAthlete) {
        // Update
        const { error } = await supabase
          .from('athletes')
          .update({
            name: profile.name,
            cpf: profile.cpf,
            phone: profile.phone,
          })
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase.from('athletes').insert({
          user_id: user.id,
          name: profile.name,
          cpf: profile.cpf,
          phone: profile.phone,
          email: user.email,
        })

        if (error) throw error
      }

      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.profileSaved'),
      })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: t('profile.errorSaving'),
        description: error.message || 'Ocorreu um erro ao atualizar o perfil.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B7D3A]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container max-w-2xl py-10 animate-fade-in-up">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 pb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || user.email}`}
              />
              <AvatarFallback>{profile.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name || t('profile.title')}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            {t('profile.signOut')}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.fullName')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder={t('profile.namePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">{t('profile.cpf')}</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={profile.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handicap">{t('profile.handicap')}</Label>
                <Input
                  id="handicap"
                  name="handicap"
                  value={profile.handicap}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#1B7D3A] hover:bg-[#1B7D3A]/90"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('profile.saveChanges')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
