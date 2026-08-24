import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/components/cart";
import { useSession } from "@/hooks/use-session";
import { usdExact } from "@/lib/quote";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Syntraxi" },
      {
        name: "description",
        content: "Confirma tu pedido de productos y paquetes de servicio de importación con Syntraxi.",
      },
      { property: "og:title", content: "Checkout — Syntraxi" },
      { property: "og:description", content: "Finaliza tu compra de productos y servicios de importación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

// NOTA: hoy el checkout crea el pedido en estado "pendiente_pago" y un asesor
// envía el link de pago manualmente. Para cobrar automáticamente con Stripe:
// 1) crea la Edge Function de supabase/functions/create-checkout-session
//    (incluida en este proyecto) en tu propio proyecto de Supabase.
// 2) reemplaza el bloque de "insert" de abajo por una llamada a esa función
//    y redirige a la URL de Stripe Checkout que te devuelva.
// Ver README.md → sección "Activar pagos con Stripe (opcional)".
function Checkout() {
  const { items, total, clear } = useCart();
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (!user) {
      navigate({ to: "/auth", search: { next: "/checkout" } });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: items as unknown as Json,
      total_usd: total,
      status: "pendiente_pago",
      payment_provider: "manual",
    });
    setSaving(false);
    if (error) {
      toast.error("No pudimos crear tu pedido. Intenta de nuevo.");
      return;
    }
    clear();
    toast.success("Pedido creado. Un asesor te enviará el link de pago.");
    navigate({ to: "/portal" });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="eyebrow mb-6">Checkout</span>
      <h1 className="mb-8 font-display text-4xl font-bold">Confirma tu pedido</h1>

      {items.length === 0 ? (
        <p className="text-muted-foreground">
          Tu carrito está vacío.{" "}
          <Link to="/tienda" className="underline underline-offset-4">
            Ir a la tienda
          </Link>
        </p>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-8 shadow-panel">
          <ul className="mb-6 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b border-border pb-3 text-sm">
                <span>
                  {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                </span>
                <span className="font-semibold">{usdExact(item.price_usd * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mb-8 flex items-center justify-between font-display text-2xl font-bold">
            <span>Total</span>
            <span>{usdExact(total)}</span>
          </div>
          <Button className="w-full rounded-xl" disabled={saving || loading} onClick={handleConfirm}>
            {saving ? "Procesando…" : user ? "Confirmar pedido" : "Ingresar para continuar"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Al confirmar, un asesor valida disponibilidad y te envía el enlace de pago seguro.
          </p>
        </div>
      )}
    </div>
  );
}
