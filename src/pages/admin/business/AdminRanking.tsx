import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Trash2, Trophy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function AdminRanking() {
  const [rankings, setRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    player_name: '',
    category: '',
    points: 0,
    position: 1,
  })

  const fetchRankings = async () => {
    try {
      const records = await pb.collection('rankings').getFullList({
        sort: 'position,-points',
      })
      setRankings(records)
    } catch (error) {
      console.warn('Rankings collection might not exist yet or empty:', error)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRankings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await pb.collection('rankings').create(formData)
      toast({ title: 'Ranking adicionado com sucesso!' })
      setIsDialogOpen(false)
      setFormData({ player_name: '', category: '', points: 0, position: 1 })
      fetchRankings()
    } catch (error: any) {
      console.error(error)
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este ranking?')) return
    try {
      await pb.collection('rankings').delete(id)
      toast({ title: 'Ranking removido' })
      fetchRankings()
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro ao remover', variant: 'destructive' })
    }
  }

  return (
    <div className="p-6 space-y-6 w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Rankings
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os rankings e pontuações dos jogadores.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Ranking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Ranking</DialogTitle>
              <DialogDescription>
                Insira as informações do jogador e sua pontuação.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome do Jogador</Label>
                <Input
                  value={formData.player_name}
                  onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Profissional"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Pontos</Label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Posição</Label>
                  <Input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classificação Atual</CardTitle>
          <CardDescription>Todos os registros de ranking do sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum ranking cadastrado ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rankings.map((ranking) => (
                <div
                  key={ranking.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      {ranking.position || '-'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ranking.player_name || 'Jogador'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ranking.category || 'Sem Categoria'} • {ranking.points || 0} pontos
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(ranking.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
