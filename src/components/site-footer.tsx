import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBER = "573117491761";

export const WHATSAPP_URL = waLink("Hola Syntraxi, quiero información sobre importaciones.");

// Genera un enlace de WhatsApp con un mensaje ya escrito, para que la persona
// llegue directo a la conversación sin tener que redactar nada.
export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <span className="flex items-center gap-2">
          <img src={logo} alt="Syntraxi" className="size-7 rounded-md opacity-90" />
          <span className="font-display text-xl font-bold tracking-tighter text-muted-foreground">
            SYNTRAXI
          </span>
        </span>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link to="/servicios">Servicios</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp directo
          </a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Syntraxi SAS · Bogotá, Colombia</p>
      </div>
    </footer>
  );
}
