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
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import pb from '@/lib/pocketbase/client'

export default function Profile() {
  const { user, profile: authProfile, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

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
            console.error('Error fetching profile:', error)
          } else {
            // Use auth user data if no athlete profile found yet
            setProfile((prev) => ({ ...prev, name: user.name || '' }))
          }
        } else if (data) {
          setProfile({
            name: data.name || user.name || '',
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await pb.collection('users').update(user.id, formData)
      await pb.collection('users').authRefresh()
      toast({
        title: t('profile.profileUpdated'),
        description: 'Avatar atualizado com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer upload',
        description: error.message || 'Não foi possível atualizar o avatar.',
        variant: 'destructive',
      })
    } finally {
      setAvatarUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleAvatarDelete = async () => {
    if (!user) return
    setAvatarUploading(true)
    try {
      await pb.collection('users').update(user.id, { avatar: null })
      await pb.collection('users').authRefresh()
      toast({
        title: t('profile.profileUpdated'),
        description: 'Avatar removido com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message || 'Não foi possível remover o avatar.',
        variant: 'destructive',
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { data: existingAthlete } = await supabase
        .from('athletes')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingAthlete) {
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
        const { error } = await supabase.from('athletes').insert({
          user_id: user.id,
          name: profile.name,
          cpf: profile.cpf,
          phone: profile.phone,
          email: user.email,
        })

        if (error) throw error
      }

      if (profile.name !== user.name) {
        await pb.collection('users').update(user.id, { name: profile.name })
        await pb.collection('users').authRefresh()
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
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    authProfile?.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || user.email}`
                  }
                />
                <AvatarFallback>{profile.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer p-1 hover:text-primary text-white"
                  title="Alterar foto"
                >
                  {avatarUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                />
                {authProfile?.avatarUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:text-destructive hover:bg-transparent p-0"
                    onClick={handleAvatarDelete}
                    disabled={avatarUploading}
                    title="Remover foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
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
