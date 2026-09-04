import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { WHATSAPP_URL } from "@/components/site-footer";
import logo from "@/assets/logo.png";

const links = [{ to: "/servicios", label: "Servicios" }] as const;

export function SiteHeader() {
  const { user } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Syntraxi" className="size-9 rounded-lg" />
            <span className="font-display text-2xl font-bold tracking-tighter text-primary">
              SYNTRAXI
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/portal"
            className="hidden px-3 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary sm:block"
          >
            {user ? "Mi portal" : "Portal Cliente"}
          </Link>
          <Button asChild className="hidden rounded-full shadow-glow sm:inline-flex">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Hablar con un asesor
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-card px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium">
            {[...links, { to: "/portal", label: "Portal Cliente" } as const].map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={() => setMenuOpen(false)} className="block py-1">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block py-1 text-primary">
                Hablar con un asesor
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
