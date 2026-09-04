import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { packagesQuery } from "@/lib/catalog";
import { waLink } from "@/components/site-footer";
import inst1 from "@/assets/inst1.jpg";
import inst2 from "@/assets/inst2.jpg";
import inst3 from "@/assets/inst3.jpg";
import inst4 from "@/assets/inst4.jpg";
import dropshippingImg from "@/assets/dropshipping.jpg";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios de importación, instrumentación y dropshipping — Syntraxi" },
      {
        name: "description",
        content:
          "Importación con asesoría personalizada, instrumentación industrial con más de 8 años de experiencia y dropshipping sin inventario.",
      },
      { property: "og:title", content: "Servicios Syntraxi" },
      { property: "og:description", content: "Importación, instrumentación industrial y dropshipping para Colombia." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(packagesQuery),
  component: Servicios,
});

const instrumentacionFotos = [
  { src: inst1, alt: "Técnico de Syntraxi realizando trabajo en altura sobre un recipiente a presión" },
  { src: inst2, alt: "Ajuste de parámetros de transmisor Rosemount en campo" },
  { src: inst3, alt: "Banco de pruebas con equipo Ametek en taller" },
  { src: inst4, alt: "Ajuste de parámetros de instrumento de presión en planta" },
];

const instrumentacion = [
  {
    title: "Mantenimiento y telemetría de caudal",
    body: "Ajustes de parámetros, diagnóstico en sitio y monitoreo de macromedidores y registradores en red.",
    sector: "Servicios públicos y acueductos",
  },
  {
    title: "Puesta en marcha e instrumentación",
    body: "Configuración, ajustes de parámetros y comunicación de sensores de nivel, flujo y presión.",
    sector: "Industria química y agroindustrial",
  },
  {
    title: "Reestructuración de tableros de control",
    body: "Corrección de fallas en tableros de potencia, integración de señales de campo en PLC.",
    sector: "Manufactura y líneas continuas",
  },
  {
    title: "Peritaje técnico y diagnóstico exprés",
    body: "Inspección especializada, pruebas de campo con monitoreo continuado y reporte técnico formal.",
    sector: "Contratistas e ingeniería",
  },
];

const howItWorks = [
  { num: "01", title: "Nos cuentas qué necesitas", body: "Un producto para importar o un servicio técnico de instrumentación." },
  { num: "02", title: "Te asesoramos por WhatsApp", body: "Resolvemos tus dudas y te damos una cotización clara para tu caso." },
  { num: "03", title: "Acordamos alcance y forma de pago", body: "Sin sorpresas: sabes exactamente qué incluye antes de empezar." },
  { num: "04", title: "Ejecutamos con seguimiento", body: "Te mantenemos al tanto en cada etapa hasta la entrega." },
] as const;

const faqs = [
  {
    q: "¿Qué pasa si mi producto llega dañado?",
    a: "Gestionamos el reclamo con el proveedor o el transportista por ti. No tienes que resolverlo solo.",
  },
  {
    q: "¿Cuánto tarda una importación?",
    a: "Entre 6 y 9 días por aéreo exprés y entre 35 y 45 días por marítimo consolidado, según aduanas.",
  },
  {
    q: "¿Necesito experiencia previa o contactos en China?",
    a: "No. Nosotros ponemos la red de proveedores, la negociación y el control de calidad.",
  },
  {
    q: "¿Cómo se define el precio y cómo se paga?",
    a: "El precio depende de qué vas a importar o del servicio técnico que necesites, así que lo definimos contigo por WhatsApp antes de empezar. Una vez de acuerdo, coordinamos la forma de pago.",
  },
];

function Servicios() {
  const { data: packages } = useSuspenseQuery(packagesQuery);

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow mb-6">Servicios</span>
        <h1 className="mb-4 font-display text-5xl font-bold">Elige cómo te acompañamos</h1>
        <p className="mb-14 max-w-2xl text-muted-foreground">
          Desde encontrar el proveedor hasta recibir la mercancía en tu bodega, más instrumentación industrial y
          dropshipping.
        </p>

        <div className="mb-24">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Metodología</span>
            <h2 className="mb-4 font-display text-3xl font-bold">Cómo trabajamos</h2>
            <p className="text-muted-foreground">
              Sin pagos en línea ni sorpresas: primero conversamos, te asesoramos y acordamos contigo el alcance y el
              precio exacto para tu caso antes de empezar.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <div key={step.num} className="rounded-3xl border border-border bg-card p-6">
                <span className="mb-4 grid size-10 place-items-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
                  {step.num}
                </span>
                <h3 className="mb-2 font-display text-base font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 font-display text-3xl font-bold">Paquetes de servicio</h2>
            <p className="text-muted-foreground">
              Cada plan es el punto de partida de una conversación: tú eliges qué quieres importar o qué servicio
              técnico necesitas, y te damos una cotización personalizada por WhatsApp.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pack) => (
              <div
                key={pack.id}
                className={
                  pack.highlighted
                    ? "flex flex-col rounded-3xl border-2 border-primary bg-card p-8 shadow-panel"
                    : "flex flex-col rounded-3xl border border-border bg-card p-8"
                }
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">{pack.name}</p>
                <p className="mb-2 font-display text-2xl font-bold">Cotización personalizada</p>
                <p className="mb-6 text-sm text-muted-foreground">{pack.description}</p>
                <ul className="mb-8 flex-1 space-y-3">
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
                  asChild
                >
                  <a
                    href={waLink(`Hola Syntraxi, quiero información sobre el ${pack.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hablar por WhatsApp
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <section id="instrumentacion" className="mb-24 rounded-3xl border border-border bg-card p-10">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-primary">División técnica</p>
          <h2 className="mb-4 font-display text-3xl font-bold">Instrumentación y automatización industrial</h2>
          <p className="mb-2 max-w-3xl text-muted-foreground">
            Más de 8 años en diagnóstico de campo, integración de equipos de marcas líderes y elaboración de informes
            técnicos para auditorías y clientes finales.
          </p>
          <p className="mb-10 text-xs uppercase tracking-widest text-primary/80">
            Endress+Hauser · PLC Siemens S7-1200 · tableros de control
          </p>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {instrumentacionFotos.map((foto) => (
              <img
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                width={700}
                height={620}
                className="aspect-[4/5] w-full rounded-2xl border border-border object-cover"
              />
            ))}
          </div>

          <div className="divide-y divide-border border-y border-border">
            {instrumentacion.map((item) => (
              <div key={item.title} className="grid gap-4 py-6 md:grid-cols-[1fr_240px] md:items-center">
                <div>
                  <h3 className="mb-1 font-display text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground md:text-right">
                  {item.sector}
                </span>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-8 rounded-xl">
            <a
              href={waLink("Hola Syntraxi, quiero solicitar un diagnóstico técnico de instrumentación.")}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar diagnóstico técnico
            </a>
          </Button>
        </section>

        <section id="dropshipping" className="mb-24 grid gap-8 md:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl p-10 text-ink-foreground">
            <img
              src={dropshippingImg}
              alt="Persona gestionando pedidos y paquetes de dropshipping desde su computador"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/40" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Emprendimiento</p>
              <h2 className="mb-4 font-display text-2xl font-bold">Dropshipping sin inventario</h2>
              <p className="mb-8 text-sm text-ink-muted">
                Conectamos tu tienda con proveedores que despachan directo a tu cliente final. Nosotros gestionamos
                pedidos, envíos y devoluciones.
              </p>
              <Button asChild className="w-fit rounded-xl">
                <a
                  href={waLink("Hola Syntraxi, quiero empezar con el servicio de dropshipping.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Quiero empezar
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-10">
            <h2 className="mb-4 font-display text-2xl font-bold">Cómo funciona</h2>
            <ol className="space-y-6">
              {[
                ["01", "Nos cuentas qué quieres traer", "Producto, cantidad y referencia del proveedor si ya la tienes."],
                ["02", "Te damos una cotización clara", "Costo estimado y tiempos, sin compromisos."],
                ["03", "Gestionamos todo el proceso", "Proveedor, calidad, transporte y aduanas."],
                ["04", "Recibes en tu puerta", "Listo para vender o instalar."],
              ].map(([num, title, body]) => (
                <li key={num} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                    {num}
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-3xl font-bold">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
