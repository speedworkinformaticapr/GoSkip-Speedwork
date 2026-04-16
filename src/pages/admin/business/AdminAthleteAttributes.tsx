import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function AdminAthleteAttributes() {
  const [attributes, setAttributes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({
    nome: '',
    descricao: '',
    tipo_dado: 'numero',
    unidade_medida: '',
    valor_minimo: '',
    valor_maximo: '',
    ativo: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAttributes = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('athlete_attributes').select('*').order('nome')
    if (error) {
      toast({
        title: 'Erro ao buscar atributos',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setAttributes(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAttributes()
  }, [])

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        valor_minimo: formData.valor_minimo === '' ? null : Number(formData.valor_minimo),
        valor_maximo: formData.valor_maximo === '' ? null : Number(formData.valor_maximo),
      }

      if (editingId) {
        const { error } = await supabase
          .from('athlete_attributes')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
        toast({ title: 'Atributo atualizado com sucesso!' })
      } else {
        const { error } = await supabase.from('athlete_attributes').insert(payload)
        if (error) throw error
        toast({ title: 'Atributo criado com sucesso!' })
      }

      setIsModalOpen(false)
      fetchAttributes()
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    }
  }

  const handleEdit = (attr: any) => {
    setEditingId(attr.id)
    setFormData({
      nome: attr.nome || '',
      descricao: attr.descricao || '',
      tipo_dado: attr.tipo_dado || 'numero',
      unidade_medida: attr.unidade_medida || '',
      valor_minimo: attr.valor_minimo !== null ? attr.valor_minimo : '',
      valor_maximo: attr.valor_maximo !== null ? attr.valor_maximo : '',
      ativo: attr.ativo ?? true,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este atributo?')) return
    const { error } = await supabase.from('athlete_attributes').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Atributo excluído com sucesso!' })
      fetchAttributes()
    }
  }

  const openNewModal = () => {
    setEditingId(null)
    setFormData({
      nome: '',
      descricao: '',
      tipo_dado: 'numero',
      unidade_medida: '',
      valor_minimo: '',
      valor_maximo: '',
      ativo: true,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Atributos da Bio</h1>
        <Button onClick={openNewModal}>
          <Plus className="mr-2 h-4 w-4" /> Novo Atributo
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum atributo encontrado.
                </TableCell>
              </TableRow>
            ) : (
              attributes.map((attr) => (
                <TableRow key={attr.id}>
                  <TableCell className="font-medium">{attr.nome}</TableCell>
                  <TableCell className="capitalize">{attr.tipo_dado}</TableCell>
                  <TableCell>{attr.unidade_medida || '-'}</TableCell>
                  <TableCell>{attr.ativo ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(attr)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(attr.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Atributo' : 'Novo Atributo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Altura, Peso, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição opcional..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Dado *</Label>
                <Select
                  value={formData.tipo_dado}
                  onValueChange={(val) => setFormData({ ...formData, tipo_dado: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numero">Número</SelectItem>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="percentual">Percentual</SelectItem>
                    <SelectItem value="booleano">Booleano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unidade de Medida</Label>
                <Input
                  value={formData.unidade_medida}
                  onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                  placeholder="Ex: cm, kg, %"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Valor Mínimo</Label>
                <Input
                  type="number"
                  value={formData.valor_minimo}
                  onChange={(e) => setFormData({ ...formData, valor_minimo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor Máximo</Label>
                <Input
                  type="number"
                  value={formData.valor_maximo}
                  onChange={(e) => setFormData({ ...formData, valor_maximo: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={formData.ativo}
                onCheckedChange={(val) => setFormData({ ...formData, ativo: val })}
                id="ativo"
              />
              <Label htmlFor="ativo">Atributo Ativo</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.nome}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
