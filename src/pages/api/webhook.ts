import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripeSecret = import.meta.env.STRIPE_SECRET_KEY;
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    console.error('[webhook] Faltan variables de entorno STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET');
    return new Response('Configuration error', { status: 500 });
  }

  const stripe = new Stripe(stripeSecret);

  // Stripe requiere el body como texto plano para verificar la firma
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[webhook] Verificación de firma fallida:', msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  // ── Evento: pago completado ────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true, skipped: 'not paid' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const order = {
      session_id:   session.id,
      email:        session.customer_email,
      total_eur:    session.amount_total ? (session.amount_total / 100).toFixed(2) : '0',
      cursos:       session.metadata?.cursos ?? '',
      num_cursos:   session.metadata?.num_cursos ?? '0',
      nombre:       `${session.metadata?.nombre ?? ''} ${session.metadata?.apellido1 ?? ''}`.trim(),
      provincia:    session.metadata?.provincia ?? '',
      comunidad:    session.metadata?.comunidad ?? '',
      tipo_docente: session.metadata?.tipo_docente ?? '',
      telefono:     session.metadata?.telefono ?? '',
      paid_at:      new Date().toISOString(),
    };

    // Log persistente — visible en los logs de Node.js / PM2 del VPS
    console.log('[PEDIDO COMPLETADO]', JSON.stringify(order, null, 2));

    // TODO: Enviar email de confirmación al alumno (Resend / SendGrid)
    // TODO: Enviar notificación interna al equipo
  }

  // ── Evento: pago fallido ───────────────────────────────────────────────
  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.warn('[webhook] Pago fallido:', intent.id, intent.last_payment_error?.message);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
