import { UseFormReturn } from 'react-hook-form'
import { SystemDataFormData } from '../SystemDataSchema'
import { VisualIdentitySection } from './sections/VisualIdentitySection'
import { CompanyDataSection } from './sections/CompanyDataSection'
import { LayoutSettingsSection } from './sections/LayoutSettingsSection'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function VisualIdentityTab({ form }: { form: UseFormReturn<SystemDataFormData> }) {
  const watchWhatsapp = form.watch('whatsapp_enabled')

  return (
    <div className="space-y-8 animate-fade-in">
      <VisualIdentitySection form={form} />
      <CompanyDataSection form={form} />
      <LayoutSettingsSection form={form} />

      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Tema Visual Global
        </h3>
        <FormField
          control={form.control}
          name="active_theme"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'default', name: 'Padrão', desc: 'Tema original do sistema' },
                  {
                    id: 'dark-tech',
                    name: 'Dark Tech Premium',
                    desc: 'Aparência escura e tecnológica',
                  },
                  {
                    id: 'gradient-momentum',
                    name: 'Gradient Momentum',
                    desc: 'Claro com gradientes vibrantes',
                  },
                  {
                    id: 'corporate-elegance',
                    name: 'Corporate Elegance',
                    desc: 'Profissional e corporativo',
                  },
                  { id: 'neon-edge', name: 'Neon Edge', desc: 'Cyberpunk com bordas neon' },
                  { id: 'minimal-zen', name: 'Minimal Zen', desc: 'Suave, espaçoso e minimalista' },
                ].map((theme) => (
                  <div
                    key={theme.id}
                    className={cn(
                      'p-4 rounded-lg cursor-pointer transition-colors border shadow-sm',
                      field.value === theme.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-1'
                        : 'border-border bg-card hover:border-primary/50',
                    )}
                    onClick={() => field.onChange(theme.id)}
                  >
                    <h4 className="font-bold text-base mb-1">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground">{theme.desc}</p>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Acessibilidade e Chat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="libras_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                <FormLabel>VLibras</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessibility_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background">
                <FormLabel>Menu de Acessibilidade</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="rounded-lg border p-4 shadow-sm bg-background space-y-4 md:col-span-2">
            <FormField
              control={form.control}
              name="whatsapp_enabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Botão de WhatsApp</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            {watchWhatsapp && (
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número (apenas números com DDD)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
