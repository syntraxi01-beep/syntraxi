import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

// Same-origin relative path only; anything else falls back to the portal.
function safeNext(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : undefined;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ next: safeNext(s["next"]) }),
  head: () => ({
    meta: [
      { title: "Ingresar al portal de cliente — Syntraxi" },
      {
        name: "description",
        content: "Accede a tu portal Syntraxi para ver cotizaciones, pedidos y el estado de tus importaciones.",
      },
      { property: "og:title", content: "Portal de cliente Syntraxi" },
      { property: "og:description", content: "Ingresa o crea tu cuenta para seguir tus importaciones." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const { session } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const destination = next ?? "/portal";

  useEffect(() => {
    if (!session) return;
    if (next) window.location.assign(next);
    else navigate({ to: "/portal" });
  }, [session, next, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}${destination}` },
          });
    const { error } = await action;
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "signup") {
      toast.success("Cuenta creada. Revisa tu correo si te pedimos confirmación.");
    }
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${destination}` },
    });
    if (error) toast.error("No pudimos iniciar sesión con Google.");
  }

  return (
    <div className="grid place-items-center px-6 py-24">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-panel">
        <h1 className="mb-2 font-display text-3xl font-bold">
          {mode === "login" ? "Ingresar" : "Crear cuenta"}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Sigue tus cotizaciones, pedidos y el estado de cada importación.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Correo
            </Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pass" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Contraseña
            </Label>
            <Input
              id="pass"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Procesando…" : mode === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full rounded-xl" onClick={handleGoogle}>
          Continuar con Google
        </Button>

        <button
          className="mt-6 w-full text-center text-sm text-muted-foreground underline underline-offset-4"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "No tengo cuenta, quiero registrarme" : "Ya tengo cuenta, quiero ingresar"}
        </button>
      </div>
    </div>
  );
}
