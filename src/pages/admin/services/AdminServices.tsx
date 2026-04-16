import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type Service = {
  id: string
  title: string
  description: string
  costValue: number
  saleValue: number
  execTime: string
  marginTime: number
  addTime: string
}

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Consultoria de Campo',
    description: 'Análise completa do gramado',
    costValue: 100,
    saleValue: 250,
    execTime: '04:00:00',
    marginTime: 10,
    addTime: '01:00:00',
  },
  {
    id: '2',
    title: 'Treinamento Tático',
    description: 'Treino para equipes',
    costValue: 150,
    saleValue: 300,
    execTime: '03:00:00',
    marginTime: 0,
    addTime: '00:00:00',
  },
  {
    id: '3',
    title: 'Manutenção Preventiva',
    description: 'Ajustes no campo',
    costValue: 200,
    saleValue: 500,
    execTime: '08:00:00',
    marginTime: 20,
    addTime: '02:00:00',
  },
  {
    id: '4',
    title: 'Auditoria de Regras',
    description: 'Verificação de conformidade',
    costValue: 80,
    saleValue: 200,
    execTime: '02:00:00',
    marginTime: 15,
    addTime: '00:30:00',
  },
  {
    id: '5',
    title: 'Gestão de Evento',
    description: 'Organização de torneio',
    costValue: 1000,
    saleValue: 2500,
    execTime: '24:00:00',
    marginTime: 10,
    addTime: '04:00:00',
  },
]

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Service>>({})

  const maskTime = (v: string) => {
    v = v.replace(/\D/g, '')
    if (v.length > 6) v = v.substring(0, 6)
    if (v.length > 4) return v.replace(/(\d{2})(\d{2})(\d{1,2})/, '$1:$2:$3')
    if (v.length > 2) return v.replace(/(\d{2})(\d{1,2})/, '$1:$2')
    return v
  }

  const calculateAddTime = (execTime: string | undefined, margin: number | undefined) => {
    const timeStr = execTime || '00:00:00'
    const marginVal = margin || 0

    const parts = timeStr.split(':')
    const h = parseInt(parts[0] || '0', 10)
    const m = parseInt(parts[1] || '0', 10)
    const s = parseInt(parts[2] || '0', 10)

    const totalSeconds = h * 3600 + m * 60 + s
    const addedSeconds = Math.round(totalSeconds * (marginVal / 100))

    const addH = Math.floor(addedSeconds / 3600)
    const addM = Math.floor((addedSeconds % 3600) / 60)
    const addS = addedSeconds % 60

    return `${addH.toString().padStart(2, '0')}:${addM.toString().padStart(2, '0')}:${addS.toString().padStart(2, '0')}`
  }

  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    if (!formData.title) {
      return toast({
        title: 'Atenção',
        description: 'O título do serviço é obrigatório.',
        variant: 'destructive',
      })
    }

    setIsSaving(true)
    try {
      if (editingId) {
        setServices(
          services.map((s) => (s.id === editingId ? ({ ...s, ...formData } as Service) : s)),
        )
        toast({ title: 'Sucesso', description: 'Serviço atualizado com sucesso!' })
      } else {
        setServices([...services, { ...formData, id: Date.now().toString() } as Service])
        toast({ title: 'Sucesso', description: 'Serviço cadastrado com sucesso!' })
      }
      setOpen(false)
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: err.message || 'Erro inesperado.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (s: Service) => {
    setFormData(s)
    setEditingId(s.id)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const openNew = () => {
    setFormData({
      costValue: 0,
      saleValue: 0,
      execTime: '00:00:00',
      marginTime: 0,
      addTime: '00:00:00',
    })
    setEditingId(null)
    setOpen(true)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços disponíveis para orçamentos e agendamentos.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-[#1B7D3A] hover:bg-[#1B7D3A]/90 gap-2">
              <Plus className="w-4 h-4" /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2 grid gap-2">
                <Label>Título do Serviço</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor Custo (R$)</Label>
                <Input
                  type="number"
                  value={formData.costValue || 0}
                  onChange={(e) => setFormData({ ...formData, costValue: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor Venda (R$)</Label>
                <Input
                  type="number"
                  value={formData.saleValue || 0}
                  onChange={(e) => setFormData({ ...formData, saleValue: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tempo Execução (HH:MM:SS)</Label>
                <Input
                  placeholder="00:00:00"
                  value={formData.execTime || ''}
                  onChange={(e) => {
                    const masked = maskTime(e.target.value)
                    setFormData({
                      ...formData,
                      execTime: masked,
                      addTime: calculateAddTime(masked, formData.marginTime),
                    })
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>% Margem (Tempo)</Label>
                <Input
                  type="number"
                  value={formData.marginTime || 0}
                  onChange={(e) => {
                    const margin = Number(e.target.value)
                    setFormData({
                      ...formData,
                      marginTime: margin,
                      addTime: calculateAddTime(formData.execTime, margin),
                    })
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Total Acréscimo (HH:MM:SS)</Label>
                <Input
                  disabled
                  placeholder="00:00:00"
                  value={formData.addTime || ''}
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#1B7D3A] hover:bg-[#1B7D3A]/90"
              >
                {isSaving ? 'Salvando...' : 'Salvar Registro'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4">Título do Serviço</th>
              <th className="p-4">V. Custo</th>
              <th className="p-4">V. Venda</th>
              <th className="p-4">T. Execução</th>
              <th className="p-4">Margem/Acrés.</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-bold">{s.title}</td>
                <td className="p-4 text-muted-foreground">R$ {s.costValue.toFixed(2)}</td>
                <td className="p-4 font-bold text-[#1B7D3A]">R$ {s.saleValue.toFixed(2)}</td>
                <td className="p-4">{s.execTime}</td>
                <td className="p-4 text-muted-foreground">
                  {s.marginTime}% / +{s.addTime}
                </td>
                <td className="p-4 text-right flex gap-2 justify-end">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
