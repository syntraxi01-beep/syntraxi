import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useSession } from "@/hooks/use-session";
import {
  PRODUCT_TYPES,
  SHIPPING_MODES,
  estimateImport,
  usdExact,
  type ShippingMode,
} from "@/lib/quote";

export const Route = createFileRoute("/cotizador")({
  head: () => ({
    meta: [
      { title: "Cotizador de importación China → Colombia — Syntraxi" },
      {
        name: "description",
        content:
          "Calcula flete, arancel, IVA y gestión de tu importación desde China en segundos y recibe el acompañamiento de un asesor.",
      },
      { property: "og:title", content: "Cotizador de importación — Syntraxi" },
      { property: "og:description", content: "Estimado inmediato de tu importación desde China a Colombia." },
    ],
  }),
  component: Cotizador,
});

function Cotizador() {
  const { user } = useSession();
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const [productType, setProductType] = useState<string>(PRODUCT_TYPES[0].value);
  const [shippingMode, setShippingMode] = useState<ShippingMode>("maritimo");
  const [weight, setWeight] = useState("100");
  const [value, setValue] = useState("3000");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const estimate = useMemo(
    () =>
      estimateImport({
        productType,
        shippingMode,
        weightKg: Number(weight) || 0,
        declaredValueUsd: Number(value) || 0,
      }),
    [productType, shippingMode, weight, value],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("quotes").insert({
      user_id: user?.id ?? null,
      full_name: fullName,
      email,
      phone,
      product_type: productType,
      weight_kg: Number(weight) || 0,
      declared_value_usd: Number(value) || 0,
      shipping_mode: shippingMode,
      destination_city: city,
      message,
      estimate_usd: estimate.total,
      estimate_breakdown: estimate as unknown as Json,
    });
    setSaving(false);

    if (error) {
      toast.error("No pudimos guardar tu cotización. Intenta de nuevo.");
      return;
    }
    setSent(true);
    toast.success("Cotización enviada. Te contactamos hoy mismo.");
  }

  return (
    <div className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="eyebrow mb-6">Cotizador inteligente</span>
          <h1 className="mb-4 font-display text-5xl font-bold">Calcula tu importación</h1>
          <p className="mb-10 max-w-lg text-muted-foreground">
            Tres pasos: cuéntanos qué traes, elige la ruta y déjanos tus datos. El estimado incluye flete, arancel, IVA
            y nuestra gestión integral.
          </p>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-panel">
            <div className="mb-8 flex items-center gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-1 items-center gap-2">
                  <span
                    className={
                      n <= step
                        ? "grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                        : "grid size-8 place-items-center rounded-full bg-secondary text-sm font-bold text-muted-foreground"
                    }
                  >
                    {n}
                  </span>
                  {n < 3 && <span className={n < step ? "h-0.5 flex-1 bg-primary" : "h-0.5 flex-1 bg-secondary"} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                    Tipo de producto
                  </Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PRODUCT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setProductType(type.value)}
                        className={
                          productType === type.value
                            ? "rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-left text-sm font-semibold"
                            : "rounded-xl border border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40"
                        }
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="peso" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Peso estimado (kg)
                    </Label>
                    <Input id="peso" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="valor" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Valor declarado (USD)
                    </Label>
                    <Input id="valor" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full rounded-xl" onClick={() => setStep(2)}>
                  Continuar a logística
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                  Modo de envío
                </Label>
                <div className="grid gap-3">
                  {SHIPPING_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setShippingMode(mode.value)}
                      className={
                        shippingMode === mode.value
                          ? "flex items-center justify-between rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-left"
                          : "flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary/40"
                      }
                    >
                      <span className="text-sm font-semibold">{mode.label}</span>
                      <span className="text-xs text-muted-foreground">{mode.eta}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                    Atrás
                  </Button>
                  <Button className="flex-1 rounded-xl" onClick={() => setStep(3)}>
                    Ver estimado
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && !sent && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="nombre" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Nombre
                    </Label>
                    <Input id="nombre" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="correo" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Correo
                    </Label>
                    <Input id="correo" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="tel" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      WhatsApp
                    </Label>
                    <Input id="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="ciudad" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                      Ciudad de entrega
                    </Label>
                    <Input id="ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="msg" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                    Detalles del producto
                  </Label>
                  <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl" disabled={saving}>
                    {saving ? "Enviando…" : "Enviar cotización"}
                  </Button>
                </div>
              </form>
            )}

            {sent && (
              <div className="space-y-4 text-center">
                <p className="font-display text-2xl font-bold">¡Cotización recibida!</p>
                <p className="text-sm text-muted-foreground">
                  Un asesor revisará tu caso y te escribirá hoy mismo. También puedes seguirla desde tu portal.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-3xl bg-ink p-8 text-ink-foreground shadow-panel">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Estimado en vivo</p>
            <p className="mb-8 font-display text-5xl font-bold">{usdExact(estimate.total)}</p>
            <dl className="space-y-3 text-sm">
              {[
                ["Flete internacional", estimate.freight],
                ["Arancel", estimate.duty],
                ["IVA (19%)", estimate.vat],
                ["Gestión Syntraxi", estimate.serviceFee],
              ].map(([label, amount]) => (
                <div key={label as string} className="flex justify-between border-b border-ink-muted/20 pb-2">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="font-semibold">{usdExact(amount as number)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-ink-muted">
              Tránsito estimado: {estimate.eta}. Valor referencial: la cotización final depende de la partida
              arancelaria y del proveedor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
