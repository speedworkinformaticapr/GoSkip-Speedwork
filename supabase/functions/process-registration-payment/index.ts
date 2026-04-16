import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@^14.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const {
      tenant_id = '00000000-0000-0000-0000-000000000001',
      entity_type,
      entity_id,
      valor,
      metodo_pagamento = 'card',
    } = await req.json()

    // Limite de tentativas: máximo de 5 tentativas por hora para a mesma entidade
    if (entity_id) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count: attemptCount } = await supabase
        .from('registration_payments')
        .select('id', { count: 'exact', head: true })
        .eq('entity_type', entity_type)
        .eq('entity_id', entity_id)
        .gte('data_criacao', oneHourAgo)

      if (attemptCount !== null && attemptCount >= 5) {
        return new Response(
          JSON.stringify({
            status: 'error',
            error:
              'Limite de 5 tentativas excedido. Você tentou gerar o pagamento muitas vezes recentemente. Aguarde alguns minutos e tente novamente.',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }
    }

    const { data: config, error: configError } = await supabase
      .from('stripe_config')
      .select('*')
      .eq('tenant_id', tenant_id)
      .single()

    if (configError || !config || !config.secret_key) {
      throw new Error('Configuração do Stripe não encontrada. Configure no painel financeiro.')
    }

    const stripe = new Stripe(config.secret_key, { apiVersion: '2023-10-16' })

    let paymentIntentId = ''
    let clientSecret = ''
    let pixQrCode = ''
    let pixCopyPaste = ''

    const amountInCents = Math.round(valor * 100)

    if (metodo_pagamento === 'card') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        payment_method_types: ['card'],
        metadata: { tenant_id, entity_type, entity_id, type: 'registration' },
      })
      paymentIntentId = paymentIntent.id
      clientSecret = paymentIntent.client_secret || ''
    } else if (metodo_pagamento === 'pix') {
      if (!config.pix_enabled)
        throw new Error('Pagamento via Pix não está ativado nas configurações.')

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        payment_method_types: ['pix'],
        metadata: { tenant_id, entity_type, entity_id, type: 'registration' },
      })

      const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method_data: { type: 'pix' },
      })

      paymentIntentId = confirmed.id
      clientSecret = confirmed.client_secret || ''
      const pixDetails = confirmed.next_action?.pix_display_details
      pixQrCode = pixDetails?.image_url_png || ''
      pixCopyPaste = pixDetails?.pix_string || ''
    }

    const { error: insertError } = await supabase.from('registration_payments').insert({
      tenant_id,
      payment_intent_id: paymentIntentId,
      entity_type,
      entity_id,
      valor,
      status: 'pending',
      metodo_pagamento,
    })

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({
        status: 'success',
        payment_intent_id: paymentIntentId,
        client_secret: clientSecret,
        pix_qr_code: pixQrCode,
        pix_copy_paste: pixCopyPaste,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Payment processing error:', error)
    let errorMessage = error.message
    if (errorMessage?.includes('The payment method type "pix" is invalid')) {
      errorMessage =
        'O método de pagamento Pix não está ativado na sua conta Stripe. Por favor, acesse o painel do Stripe em Configurações > Métodos de Pagamento e ative o Pix.'
    }
    return new Response(JSON.stringify({ status: 'error', error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
