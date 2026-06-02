import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

interface CartItem {
  slug: string;
  title: string;
  price: number;
  hours: number;
  ects: number;
  packEligible: boolean;
}

interface CheckoutBody {
  items: CartItem[];
  studentData: {
    email: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    numDoc: string;
    tipoDoc: string;
    sexo: string;
    telefono: string;
    prefijo: string;
    direccion: string;
    cp: string;
    localidad: string;
    provincia: string;
    comunidad: string;
    tipoDocente: string;
    anioEstudios: string;
  };
}

export const POST: APIRoute = async ({ request, site }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Stripe no configurado' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(secretKey);

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { items, studentData } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: 'El carrito está vacío' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!studentData?.email || !studentData?.nombre) {
    return new Response(JSON.stringify({ error: 'Datos del alumno incompletos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Construir line_items con lógica del pack
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const packItems = items.filter(i => i.packEligible);
  const nonPackItems = items.filter(i => !i.packEligible);

  // Items sin pack: precio normal
  for (const item of nonPackItems) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description: `${item.hours}h · ${item.ects} ECTS · 100% Virtual`,
          metadata: { slug: item.slug },
        },
      },
      quantity: 1,
    });
  }

  // Items pack: pares a 40 €, impar a precio normal
  const packPairs = Math.floor(packItems.length / 2);
  const packRemainder = packItems.length % 2;

  for (let i = 0; i < packPairs; i++) {
    const a = packItems[i * 2];
    const b = packItems[i * 2 + 1];
    lineItems.push({
      price_data: {
        currency: 'eur',
        unit_amount: 4000, // 40 €
        product_data: {
          name: `Pack 2×1: ${a.title} + ${b.title}`,
          description: `${a.hours + b.hours}h · ${a.ects + b.ects} ECTS · Precio especial pack`,
          metadata: { slug_a: a.slug, slug_b: b.slug, pack: 'true' },
        },
      },
      quantity: 1,
    });
  }

  if (packRemainder > 0) {
    const item = packItems[packItems.length - 1];
    lineItems.push({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          description: `${item.hours}h · ${item.ects} ECTS · 100% Virtual`,
          metadata: { slug: item.slug },
        },
      },
      quantity: 1,
    });
  }

  const baseUrl = site?.toString() ?? 'http://localhost:4321/';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: studentData.email,
      locale: 'es',
      success_url: `${baseUrl}pago/exito/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}pago/cancelado/`,
      metadata: {
        nombre: studentData.nombre,
        apellido1: studentData.apellido1,
        apellido2: studentData.apellido2 ?? '',
        email: studentData.email,
        tipo_doc: studentData.tipoDoc,
        num_doc: studentData.numDoc,
        telefono: `${studentData.prefijo} ${studentData.telefono}`,
        provincia: studentData.provincia,
        comunidad: studentData.comunidad,
        tipo_docente: studentData.tipoDocente,
        cursos: items.map(i => i.slug).join(','),
        num_cursos: String(items.length),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[checkout] Stripe error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
