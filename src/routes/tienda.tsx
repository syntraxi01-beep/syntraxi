import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { productsQuery, productImage } from "@/lib/catalog";
import { usdExact } from "@/lib/quote";
import { useCart } from "@/components/cart";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda de productos importados — Syntraxi" },
      {
        name: "description",
        content:
          "Compra en línea sensores, PLC, tableros y equipos importados desde China con despacho en Colombia.",
      },
      { property: "og:title", content: "Tienda Syntraxi — Productos importados" },
      { property: "og:description", content: "Catálogo de instrumentación, automatización y logística con pago en línea." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Tienda,
});

const categories = [
  { value: "todos", label: "Todos" },
  { value: "instrumentacion", label: "Instrumentación" },
  { value: "automatizacion", label: "Automatización" },
  { value: "logistica", label: "Logística" },
];

function Tienda() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { add } = useCart();
  const [category, setCategory] = useState("todos");

  const visible = category === "todos" ? products : products.filter((p) => p.category === category);

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow mb-6">Catálogo</span>
        <h1 className="mb-4 font-display text-5xl font-bold">Tienda Syntraxi</h1>
        <p className="mb-10 max-w-2xl text-muted-foreground">
          Equipos importados directamente de fábrica, con garantía y soporte técnico local. Añade al carrito y paga en línea.
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={
                category === item.value
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src={productImage(product)}
                alt={product.name}
                loading="lazy"
                width={800}
                height={800}
                className="aspect-square w-full border-b border-border object-cover"
              />
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-bold leading-tight">{product.name}</h2>
                  <span className="whitespace-nowrap text-sm font-semibold text-primary">
                    {usdExact(product.price_usd)}
                  </span>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
                <p className="mb-6 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {product.stock > 0 ? `Stock: ${product.stock} unidades` : "Bajo pedido"}
                </p>
                <Button
                  className="w-full rounded-lg"
                  onClick={() =>
                    add({
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price_usd: product.price_usd,
                      kind: "producto",
                    })
                  }
                >
                  Añadir al carrito
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
