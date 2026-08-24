import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart";
import { useSession } from "@/hooks/use-session";
import { usdExact } from "@/lib/quote";

const links = [
  { to: "/servicios", label: "Servicios" },
  { to: "/cotizador", label: "Cotizador" },
  { to: "/tienda", label: "Tienda" },
] as const;

export function SiteHeader() {
  const { items, remove, total, count, open, setOpen } = useCart();
  const { user } = useSession();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-tighter text-primary">
            SYNTRAXI
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ver carrito"
            className="relative"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
          <Link
            to="/portal"
            className="hidden px-3 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary sm:block"
          >
            {user ? "Mi portal" : "Portal Cliente"}
          </Link>
          <Button asChild className="hidden rounded-full shadow-glow sm:inline-flex">
            <Link to="/cotizador">Iniciar Proyecto</Link>
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
          </ul>
        </nav>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">Tu carrito</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aún no has agregado productos ni paquetes.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-4 py-4">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {item.kind} · x{item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{usdExact(item.price_usd * item.quantity)}</p>
                      <button
                        className="text-xs text-muted-foreground underline underline-offset-4"
                        onClick={() => remove(item.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-xl font-bold">{usdExact(total)}</span>
            </div>
            <Button
              className="w-full rounded-xl"
              disabled={items.length === 0}
              onClick={() => {
                setOpen(false);
                navigate({ to: "/checkout" });
              }}
            >
              Ir a pagar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
