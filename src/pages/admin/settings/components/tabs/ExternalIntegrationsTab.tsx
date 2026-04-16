import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { UseFormReturn } from 'react-hook-form'
import { SystemDataFormData } from '../SystemDataSchema'

export function ExternalIntegrationsTab({ form }: { form: UseFormReturn<SystemDataFormData> }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          APIs e Serviços Externos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recaptcha_site_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google reCaptcha Site Key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recaptcha_secret_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google reCaptcha Secret Key</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stripe_public_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stripe Public Key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stripe_secret_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stripe Secret Key</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtp_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SMTP2GO API Key</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="correios_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correios Token</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mercadolivre_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mercado Livre Access Token</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
