import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import pb from '@/lib/pocketbase/client'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, 'O nome do clube deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  contactEmail: z.string().email('Endereço de e-mail inválido'),
  location: z.string().optional(),
})

export default function RegisterClub() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      location: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await pb.collection('clubs').create(values)
      toast({
        title: 'Sucesso',
        description: 'Clube registrado com sucesso.',
      })
      navigate('/')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao registrar o clube.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto py-10 px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registrar Clube</CardTitle>
          <CardDescription>Crie um novo clube de footgolf na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Clube</Label>
              <Input
                id="name"
                placeholder="Ex: Speedwork Footgolf Club"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">E-mail de Contato</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contato@exemplo.com"
                {...form.register('contactEmail')}
              />
              {form.formState.errors.contactEmail && (
                <p className="text-sm text-red-500">{form.formState.errors.contactEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input id="location" placeholder="Ex: São Paulo, SP" {...form.register('location')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Breve descrição do clube"
                {...form.register('description')}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Clube'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
