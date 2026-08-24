import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { usdExact } from "@/lib/quote";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portal de cliente — Syntraxi" },
      {
        name: "description",
        content: "Consulta tus cotizaciones, pedidos y el estado de cada importación desde tu portal Syntraxi.",
      },
      { property: "og:title", content: "Portal de cliente — Syntraxi" },
      { property: "og:description", content: "Seguimiento de cotizaciones y pedidos de importación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portal,
});

interface QuoteRow {
  id: string;
  product_type: string;
  shipping_mode: string;
  estimate_usd: number | null;
  status: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  total_usd: number;
  status: string;
  tracking_code: string | null;
  created_at: string;
}

function Portal() {
  const { user, loading } = useSession();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("quotes")
      .select("id, product_type, shipping_mode, estimate_usd, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setQuotes((data as QuoteRow[]) ?? []));
    supabase
      .from("orders")
      .select("id, total_usd, status, tracking_code, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as OrderRow[]) ?? []));
  }, [user]);

  if (loading) {
    return <div className="px-6 py-24 text-center text-muted-foreground">Cargando tu portal…</div>;
  }

  if (!user) {
    return (
      <div className="grid place-items-center px-6 py-24 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="font-display text-4xl font-bold">Portal de cliente</h1>
          <p className="text-muted-foreground">Ingresa para ver tus cotizaciones y pedidos.</p>
          <Button asChild className="rounded-xl">
            <Link to="/auth" search={{ next: "/portal" }}>Ingresar</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <span className="eyebrow mb-6">Tu cuenta</span>
      <h1 className="mb-2 font-display text-4xl font-bold">Hola, {user.email}</h1>
      <p className="mb-10 text-muted-foreground">Aquí sigues cada cotización y pedido en curso.</p>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-bold">Cotizaciones</h2>
        {quotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tienes cotizaciones.{" "}
            <Link to="/cotizador" className="underline underline-offset-4">
              Crear una
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <p className="font-semibold capitalize">{q.product_type}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {q.shipping_mode} · {new Date(q.created_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{usdExact(q.estimate_usd ?? 0)}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{q.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay pedidos.{" "}
            <Link to="/tienda" className="underline underline-offset-4">
              Ver tienda
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <p className="font-semibold">Pedido #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("es-CO")}
                    {o.tracking_code ? ` · Guía ${o.tracking_code}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{usdExact(o.total_usd)}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
