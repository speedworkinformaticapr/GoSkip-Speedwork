import { z } from 'zod'

export const systemDataSchema = z.object({
  logo_url: z.string().optional().nullable(),
  menu_logo_size: z.coerce.number().optional().nullable(),
  platform_name: z.string().optional().nullable(),
  slogan: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  razao_social: z.string().optional().nullable(),
  address_street: z.string().optional().nullable(),
  address_number: z.string().optional().nullable(),
  address_complement: z.string().optional().nullable(),
  address_city: z.string().optional().nullable(),
  address_state: z.string().optional().nullable(),
  address_zip: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  responsible_name: z.string().optional().nullable(),
  responsible_cpf: z.string().optional().nullable(),
  responsible_role: z.string().optional().nullable(),
  responsible_email: z.string().optional().nullable(),
  responsible_phone: z.string().optional().nullable(),
  dark_mode: z.boolean().optional().nullable(),
  browser_icon_url: z.string().optional().nullable(),
  show_cnpj: z.boolean().optional().nullable(),
  show_contact_bar: z.boolean().optional().nullable(),
  session_lifetime: z.coerce.number().optional().nullable(),
  ai_context: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  two_factor_auth: z.boolean().optional().nullable(),
  two_factor_method: z.string().optional().nullable(),
  libras_enabled: z.boolean().optional().nullable(),
  records_per_page: z.coerce.number().optional().nullable(),
  quote_footer_text: z.string().optional().nullable(),
  bg_image_url: z.string().optional().nullable(),
  bg_opacity: z.coerce.number().optional().nullable(),
  business_hours: z.any().optional().nullable(),

  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  recaptcha_site_key: z.string().optional().nullable(),
  recaptcha_secret_key: z.string().optional().nullable(),
  smtp_key: z.string().optional().nullable(),
  correios_token: z.string().optional().nullable(),
  mercadolivre_token: z.string().optional().nullable(),
  stripe_public_key: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val.trim() === '' || val.startsWith('pk_') || val.startsWith('rk_'), {
      message: "A chave pública deve começar com 'pk_' ou 'rk_'",
    }),
  stripe_secret_key: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val.trim() === '' || val.startsWith('sk_') || val.startsWith('rk_'), {
      message: "A chave secreta deve começar com 'sk_' ou 'rk_'",
    }),
  whatsapp_enabled: z.boolean().optional().nullable(),
  accessibility_enabled: z.boolean().optional().nullable(),
  cookie_consent_enabled: z.boolean().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),

  term_content_uso: z.string().optional().nullable(),
  term_content_lgpd: z.string().optional().nullable(),
  term_content_cookies: z.string().optional().nullable(),
  active_theme: z.string().optional().nullable(),
})

export type SystemDataFormData = z.infer<typeof systemDataSchema>
