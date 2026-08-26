import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

// TODO: reemplaza el número de WhatsApp por el real de tu empresa.
export const WHATSAPP_URL =
  "https://wa.me/573117491761?text=" + encodeURIComponent("Hola Syntraxi, quiero información sobre importaciones.");

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
          <Link to="/cotizador">Cotizador</Link>
          <Link to="/tienda">Tienda</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp directo
          </a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 Syntraxi SAS · Bogotá, Colombia</p>
      </div>
    </footer>
  );
}
