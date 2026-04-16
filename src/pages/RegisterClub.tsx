import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Loader2, Upload, Building2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { RegistrationPaymentModal } from '@/components/financial/RegistrationPaymentModal'
import { useEffect } from 'react'

const maskCNPJ = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')

const maskPhone = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')

const registerClubSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  city: z.string().min(2, 'Nome da cidade inválido'),
  state: z.string().min(2, 'Selecione um estado'),
  phone: z.string().min(14, 'Telefone inválido'),
  hours: z.string().min(3, 'Preencha os horários'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
})

type RegisterClubFormValues = z.infer<typeof registerClubSchema>

export default function RegisterClub() {
  const [isLoading, setIsLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentConfig, setPaymentConfig] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<{
    entityId: string
    amount: number
    method: string
  } | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    supabase
      .from('billing_registration_config' as any)
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) setPaymentConfig(data)
      })
  }, [])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterClubFormValues>({
    resolver: zodResolver(registerClubSchema),
  })

  const handlePaymentSuccess = () => {
    toast({
      title: 'Clube cadastrado e pago com sucesso!',
      description: 'Bem-vindo à plataforma.',
      className: 'bg-[#4ADE80] text-white border-none',
    })
    navigate('/login')
  }

  const onSubmit = async (data: RegisterClubFormValues) => {
    setIsLoading(true)

    try {
      const { data: existingClub } = await supabase
        .from('clubs')
        .select('id')
        .eq('cnpj', data.cnpj)
        .maybeSingle()

      if (existingClub) {
        setError('cnpj', { type: 'manual', message: 'Este CNPJ já está cadastrado' })
        setIsLoading(false)
        return
      }

      let logoUrl = null
      if (selectedFile) {
        try {
          const fileExt = selectedFile.name.split('.').pop()
          const fileName = `club-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `logos/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, selectedFile)

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath)
            logoUrl = publicUrlData.publicUrl
          }
        } catch (error) {
          console.error('Logo upload failed:', error)
        }
      }

      const initialStatus = paymentConfig?.charge_on_club_registration
        ? 'pendente_pagamento'
        : 'active'
      const initialAffiliation = paymentConfig?.charge_on_club_registration ? 'pending' : 'active'

      const { data: newClub, error: insertError } = await supabase
        .from('clubs')
        .insert({
          name: data.name,
          email: data.email,
          cnpj: data.cnpj,
          city: data.city,
          state: data.state,
          phone: data.phone,
          logo_url: logoUrl,
          status: initialStatus,
          affiliation_status: initialAffiliation,
        })
        .select('id')
        .single()

      if (insertError) throw insertError

      // Sempre enviar e-mail de boas-vindas do clube
      supabase.functions
        .invoke('send-email', {
          body: {
            type: 'welcome_club',
            email: data.email,
            name: data.name,
          },
        })
        .catch((err) => console.error('Failed to send club email:', err))

      if (paymentConfig?.charge_on_club_registration && newClub) {
        // Gerar Título Financeiro
        await supabase.from('financial_charges').insert({
          client_name: data.name,
          amount: paymentConfig.club_registration_amount || 0,
          due_date: new Date().toISOString().split('T')[0],
          status: 'pendente',
          category: 'filiação',
          type: 'receivable',
          description: 'Taxa de Filiação - Clube',
          club_id: newClub.id,
        })

        setPaymentData({
          entityId: newClub.id,
          amount: paymentConfig.club_registration_amount || 0,
          method: paymentConfig.payment_method || 'both',
        })
        setShowPayment(true)
      } else {
        toast({
          title: 'Clube cadastrado com sucesso!',
          description: 'Aguarde a aprovação da nossa equipe.',
          className: 'bg-[#4ADE80] text-white border-none',
        })
        navigate('/email-confirmation')
      }
    } catch (err: any) {
      let errorMessage = err.message
      if (errorMessage?.toLowerCase().includes('rate limit')) {
        errorMessage = 'Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.'
      }
      toast({ title: 'Erro ao cadastrar', description: errorMessage, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B7D3A] to-[#0052CC] flex items-center justify-center p-4 py-12 w-full">
      <Card className="w-full max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-poppins font-bold tracking-tight text-[#1B7D3A]">
            Cadastro de Clube
          </CardTitle>
          <CardDescription className="text-muted-foreground font-inter">
            Registre seu clube na comunidade oficial de Footgolf do Paraná
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
            <div className="flex flex-col items-center space-y-3 pb-2">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="relative">
                <Button type="button" variant="outline" size="sm" className="relative z-10">
                  <Upload className="w-4 h-4 mr-2" /> Escolher Logo
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do clube</Label>
                <Input
                  id="name"
                  placeholder="Ex: Curitiba Footgolf Club"
                  {...register('name')}
                  className={errors.name ? 'border-[#EF4444]' : ''}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@clube.com"
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
                <Label htmlFor="cnpj">CNPJ (Use 00.000... para testar erro)</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className={errors.cnpj ? 'border-[#EF4444]' : ''}
                  {...register('cnpj')}
                  onChange={(e) => {
                    e.target.value = maskCNPJ(e.target.value)
                    setValue('cnpj', e.target.value, { shouldValidate: true })
                  }}
                />
                {errors.cnpj && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.cnpj.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contato (Telefone/WhatsApp)</Label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: Curitiba"
                  {...register('city')}
                  className={errors.city ? 'border-[#EF4444]' : ''}
                />
                {errors.city && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={errors.state ? 'border-[#EF4444]' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PR">Paraná (PR)</SelectItem>
                        <SelectItem value="SC">Santa Catarina (SC)</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
                        <SelectItem value="SP">São Paulo (SP)</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
                        <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && (
                  <p className="text-sm font-medium text-[#EF4444]">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Horários de funcionamento</Label>
              <Input
                id="hours"
                placeholder="Ex: Terça a Domingo, das 08:00 às 18:00"
                {...register('hours')}
                className={errors.hours ? 'border-[#EF4444]' : ''}
              />
              {errors.hours && (
                <p className="text-sm font-medium text-[#EF4444]">{errors.hours.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Clube</Label>
              <Textarea
                id="description"
                placeholder="Conte-nos um pouco sobre a história e estrutura do seu clube..."
                className={`resize-none h-24 ${errors.description ? 'border-[#EF4444]' : ''}`}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm font-medium text-[#EF4444]">{errors.description.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1B7D3A] hover:bg-[#1B7D3A]/90 text-white font-semibold h-11 mt-6 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cadastrar Clube
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center border-t p-6 mt-2 font-inter">
          <div className="text-sm text-muted-foreground">
            É um atleta?{' '}
            <Link to="/register" className="text-[#1B7D3A] font-semibold hover:underline">
              Cadastre-se aqui
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
                description: 'Você precisará realizar o pagamento para ativar sua conta do clube.',
              })
              navigate('/login')
            }
            setShowPayment(val)
          }}
          entityId={paymentData.entityId}
          entityType="club"
          amount={paymentData.amount}
          methodConfig={paymentData.method}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
