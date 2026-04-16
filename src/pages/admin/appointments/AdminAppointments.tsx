import { useState, useMemo, useEffect } from 'react'
import { format, addDays, startOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarDays, Clock, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getAppointments,
  createAppointment,
  getServices,
  getClients,
  Appointment,
} from '@/services/appointments'
import { useSystemData } from '@/hooks/use-system-data'
import { formatTime, formatTimeShort, getValidSlotsForDate } from '@/lib/utils/appointments'
import { AppointmentCard } from './components/AppointmentCard'
import { AppointmentEditModal } from './components/AppointmentEditModal'
import { AppointmentDelayModal } from './components/AppointmentDelayModal'
import { useAppointmentActions } from '@/hooks/use-appointment-actions'

export default function AdminAppointments() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { toast } = useToast()
  const { data: systemData } = useSystemData()

  const [selClient, setSelClient] = useState('')
  const [selServices, setSelServices] = useState<string[]>([])

  const [newAppDetails, setNewAppDetails] = useState<{ startMin: number; dateStr: string } | null>(
    null,
  )
  const [obs, setObs] = useState('')

  const [editApp, setEditApp] = useState<Appointment | null>(null)
  const [delayApp, setDelayApp] = useState<Appointment | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const startStr = format(startOfDay(new Date()), 'yyyy-MM-dd')
      const endStr = format(addDays(new Date(), 60), 'yyyy-MM-dd')
      const [data, srvData, cliData] = await Promise.all([
        getAppointments(startStr, endStr),
        getServices(),
        getClients(),
      ])
      setAppointments(data)
      setServices(srvData)
      setClients(cliData)
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao carregar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const actions = useAppointmentActions(loadData)

  const totalExecutionTime = useMemo(() => {
    return selServices.reduce(
      (acc, id) => acc + (services.find((s) => s.id === id)?.execution_time_minutes || 0),
      0,
    )
  }, [selServices, services])

  const validDays = useMemo(() => {
    if (selServices.length === 0 || !systemData?.business_hours) return []
    const requiredMins = totalExecutionTime || 30
    const days: Date[] = []
    let curr = startOfDay(new Date())
    const end = addDays(curr, 60)

    while (curr <= end && days.length < 14) {
      const slots = getValidSlotsForDate(
        curr,
        requiredMins,
        appointments,
        systemData.business_hours,
      )
      if (slots.length > 0) days.push(new Date(curr))
      curr = addDays(curr, 1)
    }
    return days
  }, [totalExecutionTime, appointments, systemData?.business_hours, selServices])

  useEffect(() => {
    if (validDays.length > 0) {
      const isSelectedValid =
        selectedDate && validDays.find((d) => d.toDateString() === selectedDate.toDateString())
      if (!isSelectedValid) {
        setSelectedDate(validDays[0])
      }
    } else {
      setSelectedDate(null)
    }
  }, [validDays])

  const availableSlots = useMemo(() => {
    if (!selectedDate || selServices.length === 0 || !systemData?.business_hours) return []
    return getValidSlotsForDate(
      selectedDate,
      totalExecutionTime || 30,
      appointments,
      systemData.business_hours,
    )
  }, [selectedDate, appointments, selServices, systemData?.business_hours, totalExecutionTime])

  const clientAppointments = useMemo(() => {
    const cli = clients.find((c) => c.id === selClient)
    if (!cli) return []
    return appointments.filter((a) => a.client_name === cli.name)
  }, [appointments, selClient, clients])

  const handleSlotClick = (startMin: number) => {
    if (!selectedDate) return
    setNewAppDetails({ startMin, dateStr: format(selectedDate, 'yyyy-MM-dd') })
    setObs('')
  }

  const confirmSave = async () => {
    const srvs = selServices.map((id) => services.find((s) => s.id === id)).filter(Boolean)
    const cli = clients.find((c) => c.id === selClient)
    if (srvs.length === 0 || !cli || !newAppDetails) return

    const payload = {
      date: newAppDetails.dateStr,
      start_time: formatTime(newAppDetails.startMin),
      end_time: formatTime(newAppDetails.startMin + totalExecutionTime),
      service_name: srvs.map((s) => s.name).join(', '),
      client_name: cli.name,
      status: 'Pendente',
      notes: obs,
    }

    try {
      await createAppointment(payload)
      toast({ title: 'Sucesso', description: 'Agendamento criado com sucesso!' })
      setNewAppDetails(null)
      setSelClient('')
      setSelServices([])
      setObs('')
      loadData()
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao criar agendamento.', variant: 'destructive' })
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-[#1B7D3A]" /> Gestão de Agendamentos
        </h1>
        <p className="text-muted-foreground">
          Agende novos serviços validados em tempo real com a carga horária diária.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="grid gap-2">
          <Label className="text-base font-bold text-[#1B7D3A]">1. Selecione o Cliente</Label>
          <Select value={selClient} onValueChange={setSelClient}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Escolha um cliente..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label className="text-base font-bold text-[#1B7D3A]">2. Selecione os Serviços</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-12 text-lg font-normal bg-transparent hover:bg-transparent border-input"
              >
                {selServices.length > 0
                  ? `${selServices.length} serviço(s) (${totalExecutionTime} min)`
                  : 'Escolha os serviços...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`srv-${s.id}`}
                      checked={selServices.includes(s.id)}
                      onCheckedChange={(checked) => {
                        if (checked) setSelServices([...selServices, s.id])
                        else setSelServices(selServices.filter((id) => id !== s.id))
                      }}
                    />
                    <label
                      htmlFor={`srv-${s.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {s.name}{' '}
                      <span className="text-muted-foreground">({s.execution_time_minutes}m)</span>
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {selServices.length === 0 || !selClient ? (
        <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
          <CalendarDays className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground mb-2">
            Selecione o Cliente e os Serviços
          </h2>
          <p className="text-muted-foreground max-w-md">
            A agenda considerará o tempo estimado dos serviços para mostrar apenas horários livres
            compatíveis.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Datas Disponíveis</h3>
                  {validDays.length > 0 &&
                    selectedDate?.toDateString() === validDays[0].toDateString() && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold animate-fade-in">
                        Próxima Data Livre Selecionada
                      </span>
                    )}
                </div>
                {validDays.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhuma data encontrada com horário livre suficiente para o total de{' '}
                    {totalExecutionTime} minutos.
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {validDays.map((day) => {
                      const isSelected = selectedDate?.toDateString() === day.toDateString()
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-colors border shadow-sm min-w-[80px] shrink-0 ${
                            isSelected
                              ? 'bg-[#1B7D3A] border-[#1B7D3A] text-white ring-2 ring-[#1B7D3A]/20'
                              : 'bg-white border-border hover:border-[#1B7D3A] hover:bg-green-50'
                          }`}
                        >
                          <span className="text-xs uppercase font-bold mb-1 opacity-80">
                            {format(day, 'EEEE', { locale: ptBR }).split('-')[0].substring(0, 3)}
                          </span>
                          <span className="text-2xl font-black">{format(day, 'd')}</span>
                          <span className="text-[10px] uppercase font-semibold mt-1 opacity-70">
                            {format(day, 'MMM', { locale: ptBR })}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border p-4">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#1B7D3A]" /> Horários Livres
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.length === 0 ? (
                    <div className="col-span-full text-center p-4 text-muted-foreground">
                      Selecione uma data acima.
                    </div>
                  ) : (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleSlotClick(slot)}
                        className="border border-border rounded-lg py-2 px-3 text-sm font-bold text-center hover:bg-[#1B7D3A] hover:text-white hover:border-[#1B7D3A] transition-colors flex flex-col items-center gap-1 group"
                      >
                        {formatTimeShort(slot)}
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-4 bg-muted/30 border-b border-border">
                  <h3 className="font-bold text-lg mb-1">Agendamentos do Cliente</h3>
                  <p className="text-sm text-muted-foreground">
                    {clients.find((c) => c.id === selClient)?.name}
                  </p>
                </div>
                <div className="flex-1 p-4 bg-muted/10 space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                  {clientAppointments.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                      Nenhum agendamento ativo.
                    </div>
                  ) : (
                    clientAppointments.map((a) => (
                      <AppointmentCard
                        key={a.id}
                        app={a}
                        onStart={actions.handleStart}
                        onPause={actions.handlePause}
                        onComplete={actions.handleComplete}
                        onCommunicateDelay={(app) => setDelayApp(app)}
                        onEdit={(app) => setEditApp(app)}
                        onDelete={(app) => setDeleteId(app.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!newAppDetails} onOpenChange={(o) => !o && setNewAppDetails(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              Confirmar Agendamento
            </DialogTitle>
          </DialogHeader>
          {newAppDetails && (
            <div className="py-4 space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg border border-border text-sm">
                <p>
                  <strong>Data:</strong> {format(parseISO(newAppDetails.dateStr), 'dd/MM/yyyy')}
                </p>
                <p>
                  <strong>Horário:</strong> {formatTimeShort(newAppDetails.startMin)} às{' '}
                  {formatTimeShort(newAppDetails.startMin + totalExecutionTime)}
                </p>
                <p>
                  <strong>Cliente:</strong> {clients.find((c) => c.id === selClient)?.name}
                </p>
                <p>
                  <strong>Tempo Total:</strong> {totalExecutionTime} minutos
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Observações adicionais (opcional)</Label>
                <Textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Detalhes..."
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAppDetails(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmSave} className="bg-[#1B7D3A] hover:bg-[#1B7D3A]/90">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AppointmentEditModal
        app={editApp}
        isOpen={!!editApp}
        onClose={() => setEditApp(null)}
        onSuccess={loadData}
        services={services}
      />
      <AppointmentDelayModal
        app={delayApp}
        isOpen={!!delayApp}
        onClose={() => setDelayApp(null)}
        onConfirm={actions.handleDelayCommunicate}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={() => {
                if (deleteId) {
                  actions.handleConfirmDelete(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
