import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, UserRound } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useTranslation } from '@/hooks/use-translation'
import { RegistrationPaymentModal } from '@/components/financial/RegistrationPaymentModal'
import { supabase } from '@/lib/supabase/client'

const maskCPF = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
const maskPhone = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
const maskDate = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1')

const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  let soma = 0,
    resto
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.substring(9, 10))) return false
  soma = 0
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.substring(10, 11))) return false
  return true
}

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido')
      .refine((val) => isValidCPF(val), 'CPF inválido'),
    birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida'),
    phone: z.string().min(14, 'Telefone inválido'),
    club: z.string().min(1, 'Selecione um clube'),
    category: z.string().min(1, 'Selecione uma categoria'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [paymentConfig, setPaymentConfig] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<{
    entityId: string
    amount: number
    method: string
  } | null>(null)

  const navigate = useNavigate()
  const { toast } = useToast()
  const { signUp } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: clubsData }, { data: categoriesData }, { data: pc }] = await Promise.all([
          supabase.from('clubs').select('id, name').eq('status', 'active'),
          supabase.from('categories').select('id, name').eq('status', 'active'),
          supabase.from('billing_registration_config').select('*').maybeSingle(),
        ])

        if (clubsData) setClubs(clubsData)
        if (categoriesData) setCategories(categoriesData)
        if (pc) setPaymentConfig(pc)
      } catch (error) {
        console.error('Failed to load form data:', error)
      }
    }
    fetchData()
  }, [])

  const handlePaymentSuccess = () => {
    toast({
      title: 'Atleta cadastrado e pago com sucesso!',
      description: 'Bem-vindo(a) à plataforma.',
      className: 'bg-[#4ADE80] text-white border-none',
    })
    navigate('/')
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const { data: existingCpf } = await supabase
        .from('profiles')
        .select('id')
        .eq('cpf_cnpj', data.cpf)
        .maybeSingle()
      if (existingCpf) {
        toast({
          title: 'Erro de validação',
          description: 'Este CPF já está cadastrado em nossa plataforma.',
          className: 'bg-[#EF4444] text-white border-none',
        })
        setIsLoading(false)
        return
      }

      const {
        user,
        session,
        error: authError,
      } = await signUp(data.email, data.password, {
        name: data.fullName,
      })
      if (authError) {
        let errorMessage = authError.message
        if (
          errorMessage.toLowerCase().includes('rate limit') ||
          errorMessage.toLowerCase().includes('security purposes')
        ) {
          const match = errorMessage.match(/after (\d+) seconds/)
          const seconds = match ? match[1] : 'alguns'
          errorMessage = `Muitas tentativas de cadastro. Por favor, aguarde ${seconds} segundos e tente novamente.`
        } else if (
          errorMessage.toLowerCase().includes('already registered') ||
          errorMessage.toLowerCase().includes('user already exists')
        ) {
          errorMessage = 'Este e-mail já está cadastrado em nossa plataforma.'
        } else if (errorMessage.toLowerCase().includes('password')) {
          errorMessage = 'A senha informada é fraca ou inválida.'
        }

        toast({
          title: 'Erro no cadastro',
          description: errorMessage,
          className: 'bg-[#EF4444] text-white border-none',
        })
        setIsLoading(false)
        return
      }

      // Check if user already exists (Supabase returns user with empty identities array to prevent enumeration)
      if (user && user.identities && user.identities.length === 0) {
        toast({
          title: 'E-mail já cadastrado',
          description:
            'Este e-mail já está em uso na plataforma. Por favor, faça login ou use outro.',
          className: 'bg-[#EF4444] text-white border-none',
        })
        setIsLoading(false)
        return
      }

      if (!user?.id) {
        toast({
          title: 'Erro no cadastro',
          description: 'Não foi possível obter o ID do usuário após a criação.',
          className: 'bg-[#EF4444] text-white border-none',
        })
        setIsLoading(false)
        return
      }

      let photoUrl = null
      if (selectedFile) {
        try {
          const fileExt = selectedFile.name.split('.').pop()
          const fileName = `athlete-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `avatars/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, selectedFile)

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath)
            photoUrl = publicUrlData.publicUrl
          }
        } catch (error) {
          console.error('Photo upload failed:', error)
        }
      }

      const [day, month, year] = data.birthDate.split('/')
      const birthDateIso = `${year}-${month}-${day}`

      const selectedCategory = categories.find((c) => c.id === data.category)

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: data.fullName,
          role: 'athlete',
          is_athlete: true,
          cpf_cnpj: data.cpf,
          birth_date: birthDateIso,
          club_id: data.club !== 'sem_clube' ? data.club : null,
          categoria: selectedCategory?.name || data.category,
          category_id: selectedCategory?.id || null,
          phone: data.phone,
          photo_url: photoUrl,
          status: paymentConfig?.charge_on_athlete_registration ? 'pendente_pagamento' : 'active',
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      supabase.functions
        .invoke('send-email', {
          body: {
            type: 'welcome',
            email: data.email,
            name: data.fullName,
            confirmationLink: `${window.location.origin}/login`,
          },
        })
        .catch((err) => console.error('Failed to send welcome email:', err))

      if (paymentConfig?.charge_on_athlete_registration) {
        // Gerar Título Financeiro
        await supabase.from('financial_charges').insert({
          client_name: data.fullName,
          amount: paymentConfig.athlete_registration_amount || 0,
          due_date: new Date().toISOString().split('T')[0],
          status: 'pendente',
          category: 'filiação',
          type: 'receivable',
          description: 'Taxa de Filiação - Atleta',
          athlete_id: user.id,
        })

        setPaymentData({
          entityId: user.id,
          amount: paymentConfig.athlete_registration_amount || 0,
          method: paymentConfig.payment_method || 'both',
        })
        setShowPayment(true)
      } else {
        if (session) {
          toast({
            title: 'Atleta cadastrado com sucesso!',
            description: 'Bem-vindo(a) à plataforma.',
            className: 'bg-[#4ADE80] text-white border-none',
          })
          navigate('/')
        } else {
          toast({
            title: 'Atleta cadastrado com sucesso!',
            description: 'Por favor, confirme seu e-mail para ativar a conta.',
            className: 'bg-[#4ADE80] text-white border-none',
          })
          navigate('/email-confirmation')
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Ocorreu um erro ao realizar o cadastro.',
        className: 'bg-[#EF4444] text-white border-none',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B7D3A] to-[#0052CC] flex items-center justify-center p-4 py-12 w-full">
      <Card className="w-full max-w-xl border-none shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-poppins font-bold tracking-tight text-[#1B7D3A]">
            {t('auth.registerTitle')}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-inter">
            {t('auth.registerDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
            <div className="flex flex-col items-center space-y-3 pb-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserRound className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="relative">
                <Button type="button" variant="outline" size="sm" className="relative z-10">
                  <Upload className="w-4 h-4 mr-2" /> {t('auth.choosePhoto')}
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <Input
                  id="fullName"
                  placeholder="Ex: João Silva"
                  {...register('fullName')}
                  className={errors.fullName ? 'border-[#EF4444]' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...register('email')}
                  className={errors.email ? 'border-[#EF4444]' : ''}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={errors.cpf ? 'border-[#EF4444]' : ''}
                  {...register('cpf')}
                  onChange={(e) => {
                    e.target.value = maskCPF(e.target.value)
                    setValue('cpf', e.target.value, { shouldValidate: true })
                  }}
                />
                {errors.cpf && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.cpf.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t('auth.birthDate')}</Label>
                <Input
                  id="birthDate"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className={errors.birthDate ? 'border-[#EF4444]' : ''}
                  {...register('birthDate')}
                  onChange={(e) => {
                    e.target.value = maskDate(e.target.value)
                    setValue('birthDate', e.target.value, { shouldValidate: true })
                  }}
                />
                {errors.birthDate && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.birthDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className={errors.phone ? 'border-[#EF4444]' : ''}
                  {...register('phone')}
                  onChange={(e) => {
                    e.target.value = maskPhone(e.target.value)
                    setValue('phone', e.target.value, { shouldValidate: true })
                  }}
                />
                {errors.phone && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('auth.club')}</Label>
                <Controller
                  name="club"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.club ? 'border-[#EF4444]' : ''}>
                        <SelectValue placeholder={t('auth.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="sem_clube">{t('auth.noClub')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.club && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.club.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('auth.category')}</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.category ? 'border-[#EF4444]' : ''}>
                      <SelectValue placeholder={t('auth.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm font-medium text-[#EF4444]">{errors.category.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={errors.password ? 'border-[#EF4444]' : ''}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-[#EF4444]' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-[#EF4444]">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-1 pt-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('auth.acceptTerms')}
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm font-medium text-[#EF4444]">{errors.acceptTerms.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1B7D3A] hover:bg-[#1B7D3A]/90 text-white font-semibold h-11 mt-4 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('auth.registerBtn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center border-t p-6 mt-2 font-inter">
          <div className="text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-[#1B7D3A] font-semibold hover:underline">
              {t('auth.loginLink')}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('auth.isAdmin')}{' '}
            <Link to="/register-club" className="text-[#0052CC] font-semibold hover:underline">
              {t('auth.registerClub')}
            </Link>
          </div>
        </CardFooter>
      </Card>

      {paymentData && (
        <RegistrationPaymentModal
          open={showPayment}
          onOpenChange={(val) => {
            if (!val) {
              toast({
                title: 'Cadastro pendente de pagamento',
                description: 'Você precisará realizar o pagamento para ativar sua conta.',
              })
              navigate('/login')
            }
            setShowPayment(val)
          }}
          entityId={paymentData.entityId}
          entityType="athlete"
          amount={paymentData.amount}
          methodConfig={paymentData.method}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
