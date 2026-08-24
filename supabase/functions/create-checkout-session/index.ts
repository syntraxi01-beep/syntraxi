// Edge Function opcional para cobrar en línea con Stripe (modo prueba o real).
//
// Esta función NO se activa sola: el checkout del sitio (src/routes/checkout.tsx)
// hoy crea el pedido en estado "pendiente_pago" y un asesor envía el link de
// pago manualmente, lo cual funciona sin ningún costo ni configuración extra.
//
// Para activar pagos automáticos con Stripe (gratis de configurar; Stripe solo
// cobra una comisión sobre transacciones reales):
//   1) Crea una cuenta gratuita en https://stripe.com y obtén tu clave secreta
//      de prueba (Developers → API keys → Secret key, empieza con sk_test_).
//   2) Instala el CLI de Supabase y despliega esta función:
//        supabase functions deploy create-checkout-session
//        supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   3) En src/routes/checkout.tsx, reemplaza el `supabase.from("orders").insert(...)`
//      por una llamada a esta función y redirige a la URL que te devuelva:
//        const { data } = await supabase.functions.invoke("create-checkout-session", {
//          body: { items, orderId: /* el id del pedido recién creado */ },
//        });
//        window.location.assign(data.url);
//
// Documentación de referencia: https://docs.stripe.com/checkout/quickstart

import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Stripe no está configurado (falta STRIPE_SECRET_KEY)." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No autenticado." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const {
    data: { user },
  } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) {
    return new Response(JSON.stringify({ error: "No autenticado." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const { orderId } = (await req.json()) as { orderId: string };
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, items, total_usd, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    return new Response(JSON.stringify({ error: "Pedido no encontrado." }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });
  const items = order.items as { name: string; price_usd: number; quantity: number }[];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price_usd * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${SITE_URL}/portal?pago=exitoso`,
    cancel_url: `${SITE_URL}/checkout?pago=cancelado`,
    metadata: { order_id: order.id },
  });

  await supabase
    .from("orders")
    .update({ payment_provider: "stripe", payment_reference: session.id })
    .eq("id", order.id);

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "content-type": "application/json" },
  });
});
