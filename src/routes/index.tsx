import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Boxes, Factory, Bot, ArrowRight, Gauge, Radio, Zap, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packagesQuery } from "@/lib/catalog";
import { usdExact } from "@/lib/quote";
import { useCart } from "@/components/cart";
import heroImg from "@/assets/hero-puerto.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syntraxi — Importa desde China a Colombia sin complicarte" },
      {
        name: "description",
        content:
          "Proveedores validados, control de calidad, aduanas y entrega en tu puerta. Cotiza en línea, compra productos importados y sigue tu pedido.",
      },
      { property: "og:title", content: "Syntraxi — Importación desde China a Colombia" },
      {
        property: "og:description",
        content: "Importación inteligente, tienda en línea, cotizador y portal de cliente.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(packagesQuery);
  },
  component: Home,
});

const services = [
  {
    icon: Boxes,
    title: "Dropshipping Pro",
    body: "Enviamos directo a tu cliente final en Colombia. Sin inventario, sin riesgos innecesarios.",
    bullets: ["Proveedores validados", "Gestión de pedidos y devoluciones"],
    to: "/servicios",
    cta: "Saber más",
  },
  {
    icon: Factory,
    title: "Carga e instrumentación",
    body: "Maquinaria, sensores y automatización industrial con todos los permisos y calibración en origen.",
    bullets: ["Partidas arancelarias", "Inspección técnica en origen"],
    to: "/servicios",
    cta: "Saber más",
  },
  {
    icon: Bot,
    title: "Cotizador inteligente",
    body: "Calcula flete, arancel, IVA y gestión en segundos antes de comprometer un peso.",
    bullets: ["Estimado inmediato", "Comparativa de rutas"],
    to: "/cotizador",
    cta: "Iniciar cotización",
  },
] as const;

const instrumentationBrands = ["Endress+Hauser", "Siemens S7-1200", "Lazos 4-20 mA", "Diagramas P&ID"] as const;

const instrumentationServices = [
  {
    icon: Gauge,
    title: "Mantenimiento y telemetría de caudal",
    sector: "Servicios públicos · Acueductos · Infraestructura hídrica",
    body: "Calibración, diagnóstico en sitio y monitoreo de macromedidores y registradores de datos en red.",
  },
  {
    icon: Radio,
    title: "Puesta en marcha e instrumentación",
    sector: "Industria química · Agroindustria · Plantas de procesamiento",
    body: "Configuración, calibración y comunicación inalámbrica o por lazo de sensores de nivel, flujo y presión.",
  },
  {
    icon: Zap,
    title: "Reestructuración de tableros de control",
    sector: "Manufactura · Transformación · Líneas continuas",
    body: "Corrección de fallas en tableros de potencia para reactores o motores, integración de borneras y PLCs.",
  },
  {
    icon: ClipboardCheck,
    title: "Peritaje técnico y diagnóstico exprés",
    sector: "Contratistas de ingeniería · Aseguradoras · Paradas de planta",
    body: "Inspección técnica especializada, pruebas de campo con monitoreo continuo y reporte técnico formal.",
  },
] as const;

function Home() {
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const { add } = useCart();

  return (
    <>
      <section className="relative overflow-hidden px-6 pb-32 pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10">
            <span className="eyebrow mb-6">Logística China → Colombia</span>
            <h1 className="mb-8 font-display text-6xl font-bold leading-[0.9] tracking-tight md:text-8xl">
              Guangzhou a tu <span className="text-primary">puerta.</span>
            </h1>
            <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
              Importación inteligente con proveedores validados, control de calidad y aduanas gestionadas.
              Cotiza en línea y sigue cada etapa desde tu portal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-xl bg-ink px-8 py-6 text-base font-bold text-ink-foreground hover:bg-ink/90">
                <Link to="/cotizador">Probar cotizador IA</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl bg-card px-8 py-6 text-base font-bold">
                <Link to="/tienda">Ver catálogo</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImg}
              alt="Buque portacontenedores en puerto al atardecer"
              width={1200}
              height={912}
              className="aspect-[4/3] w-full rounded-3xl object-cover outline outline-1 -outline-offset-1 outline-border"
            />
            <div className="absolute -bottom-6 -left-6 max-w-[200px] rounded-2xl border border-border bg-card p-6 shadow-panel">
              <p className="mb-2 text-[10px] font-bold uppercase text-primary">Estado del envío</p>
              <div className="mb-3 h-2 w-full rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="text-sm font-medium">En tránsito: Mar de China</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="mb-4 font-display text-4xl font-bold">Soluciones de importación</h2>
              <p className="text-muted-foreground">
                Todo lo que necesitas para escalar tu negocio con producto de fábrica directamente desde Asia.
              </p>
            </div>
            <Link to="/servicios" className="text-sm font-bold text-primary underline underline-offset-4">
              Ver todos los servicios
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/30"
              >
                <div className="mb-6 grid size-12 place-items-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="size-5" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold">{service.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
                <ul className="mb-8 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="text-xs text-foreground/70">
                      • {bullet}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full rounded-lg font-bold">
                  <Link to={service.to}>{service.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Instrumentación & automatización industrial</span>
            <h2 className="mb-4 font-display text-4xl font-bold">Servicios de instrumentación</h2>
            <p className="text-muted-foreground">
              Más de 8 años de experiencia en diagnóstico de campo, integración de marcas líderes del sector y
              respaldo técnico documentado para auditorías y clientes finales.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {instrumentationBrands.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {instrumentationServices.map((service) => (
              <div key={service.title} className="rounded-3xl border border-border bg-card p-8">
                <div className="mb-6 grid size-12 place-items-center rounded-xl bg-secondary text-foreground">
                  <service.icon className="size-5" />
                </div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">{service.sector}</p>
                <h3 className="mb-3 font-display text-xl font-bold">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-xl">
            <h2 className="mb-4 font-display text-4xl font-bold">Paquetes de servicio</h2>
            <p className="text-muted-foreground">
              Contrata en línea el acompañamiento que necesitas, desde una importación puntual hasta operación continua.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pack) => (
              <div
                key={pack.id}
                className={
                  pack.highlighted
                    ? "rounded-3xl border-2 border-primary bg-card p-8 shadow-panel"
                    : "rounded-3xl border border-border bg-card p-8"
                }
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">{pack.name}</p>
                <p className="mb-6 font-display text-3xl font-bold">
                  {pack.price_usd === null ? "A medida" : usdExact(pack.price_usd)}
                  {pack.price_usd !== null && (
                    <span className="text-sm font-normal text-muted-foreground">/{pack.billing_interval}</span>
                  )}
                </p>
                <ul className="mb-8 space-y-3">
                  {pack.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pack.highlighted ? "default" : "outline"}
                  className="w-full rounded-lg"
                  onClick={() =>
                    add({
                      id: pack.id,
                      slug: pack.slug,
                      name: pack.name,
                      price_usd: pack.price_usd ?? 0,
                      kind: "servicio",
                    })
                  }
                >
                  {pack.price_usd === null ? "Hablar con ventas" : "Contratar"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-4xl bg-ink p-10 text-ink-foreground md:p-16">
          <div className="relative z-10">
            <h2 className="mb-6 font-display text-3xl font-bold md:text-5xl">
              Calcula tu próxima
              <br />
              importación ahora.
            </h2>
            <p className="mb-10 max-w-lg text-ink-muted">
              Flete, arancel, IVA y gestión estimados en segundos. Guardamos tu cotización y un asesor la revisa contigo.
            </p>
            <Button asChild size="lg" className="rounded-xl px-8 py-6 text-base font-bold">
              <Link to="/cotizador">
                Obtener tarifa estimada <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>
    </>
  );
}
