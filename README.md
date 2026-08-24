# Syntraxi — sitio web

Exportado y completado a partir del proyecto que tenías en Lovable ("Venta
Dinámica Pro"). Mismo diseño, mismas páginas (Inicio, Servicios, Cotizador,
Tienda, Portal Cliente, Carrito, Checkout, chat SyntraAI) y misma base de
datos (Supabase), pero ya no depende de créditos de Lovable: es un proyecto
React + TanStack Start estándar que puedes ejecutar, alojar y modificar
gratis por tu cuenta.

**Importante — esto no se pudo probar en el entorno donde se generó** (no
tenía acceso a internet para instalar paquetes). El código sigue patrones
estándar y bien documentados de este stack, pero antes de publicarlo,
sigue el Paso 1 para confirmar que compila en tu computador o en Vercel.
Si algo falla, cuéntamelo (el mensaje de error de `npm run dev` o del
build de Vercel) y lo corrijo.

## Qué es exactamente igual y qué cambió respecto a Lovable

**Igual:** todo el diseño, textos, páginas, el cálculo del cotizador, el
carrito, el checkout, el esquema de base de datos y los datos de ejemplo.

**Cambió:**
- Se quitaron dos paquetes internos de Lovable (`@lovable.dev/vite-tanstack-config`
  y `@lovable.dev/mcp-js`) y se reemplazaron por la configuración estándar
  de Vite/TanStack Start — necesario para poder compilarlo fuera de Lovable.
- Se quitó la función de exponer el sitio como servidor MCP para agentes de
  IA externos (algo que Lovable había agregado en la última sesión); no era
  parte de lo que pediste y complicaba la exportación.
- El chat **SyntraAI** ahora responde con un asistente de reglas en español
  (gratis, sin API externa) en vez de usar la pasarela de IA de Lovable.
  Si más adelante quieres respuestas generadas por IA, puedes conectar tu
  propia clave de OpenAI (ver `.env.example`) — es opcional.
- El checkout sigue creando el pedido y avisando que "un asesor envía el
  link de pago" (igual que en Lovable hoy). Dejé lista, pero desactivada,
  una función para cobrar automático con Stripe — ver más abajo.
- Las imágenes (`src/assets/*.svg`) son ilustraciones simples de reemplazo;
  las fotos originales no se pudieron exportar. Cámbialas cuando tengas
  fotos reales de tu empresa o de los productos.

## Paso 1 — Probar en tu computador

Necesitas [Node.js 20 o superior](https://nodejs.org) instalado.

```bash
npm install
cp .env.example .env
```

Antes de poder ver el sitio necesitas un proyecto de Supabase (Paso 2) y
completar `.env`. Cuando lo tengas:

```bash
npm run dev
```

Abre `http://localhost:3000`. Si algo no compila, copia el error completo
y te ayudo a corregirlo.

## Paso 2 — Crear tu base de datos gratis (Supabase)

1. Crea una cuenta gratis en [supabase.com](https://supabase.com) (no pide
   tarjeta de crédito para el plan gratuito).
2. Crea un proyecto nuevo (elige una contraseña de base de datos y guárdala).
3. Ve a **Project Settings → API** y copia:
   - `Project URL` → pégalo en `.env` como `VITE_SUPABASE_URL`
   - `anon public key` (o `publishable key`) → pégalo como
     `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Ve a **SQL Editor → New query**, pega el contenido completo de
   `supabase/migrations/0001_init.sql`, dale **Run**. Repite con
   `supabase/migrations/0002_seed_more.sql`.
5. (Opcional) En **Authentication → Providers**, activa Google si quieres
   que "Continuar con Google" funcione; si no, el login con correo y
   contraseña ya funciona sin configuración extra.

Con esto ya tienes: 15 productos, 4 paquetes de servicio y 4 cotizaciones
de ejemplo, más el login/registro y el portal de cliente funcionando de
verdad. Los pedidos de muestra no vienen precargados porque requieren un
usuario real — aparecerán en cuanto te registres y compres algo de prueba.

## Paso 3 — Subir el código a GitHub

```bash
git init
git add .
git commit -m "Sitio Syntraxi"
```

Crea un repositorio nuevo (privado o público) en
[github.com/new](https://github.com/new) y sigue las instrucciones que te
da GitHub para subir el código (`git remote add origin ...` y `git push`).

## Paso 4 — Publicar gratis (Vercel)

1. Crea una cuenta gratis en [vercel.com](https://vercel.com) (puedes
   entrar con tu cuenta de GitHub).
2. **Add New → Project**, elige el repositorio que acabas de subir.
3. En **Environment Variables**, agrega las mismas dos variables de tu
   `.env`: `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Dale **Deploy**. Vercel instala las dependencias y compila el sitio en
   sus propios servidores (por eso no importa que aquí no se haya podido
   probar). En unos minutos te da una URL pública gratis
   (`tuproyecto.vercel.app`), y puedes conectar tu propio dominio después
   desde **Settings → Domains**.

Cada vez que hagas `git push`, Vercel vuelve a publicar automáticamente.

## Activar pagos con Stripe (opcional, cuando quieras)

Hoy el checkout funciona igual que en Lovable: crea el pedido y un asesor
envía el link de pago. Para que cobre automático:

1. Crea una cuenta gratis en [stripe.com](https://stripe.com) y copia tu
   clave secreta de prueba (`sk_test_...`).
2. Instala el [CLI de Supabase](https://supabase.com/docs/guides/cli) y
   despliega la función incluida:
   ```bash
   supabase login
   supabase link --project-ref TU_PROJECT_ID
   supabase functions deploy create-checkout-session
   supabase secrets set STRIPE_SECRET_KEY=sk_test_... SITE_URL=https://tudominio.com
   ```
3. En `src/routes/checkout.tsx`, cambia el `supabase.from("orders").insert(...)`
   por una llamada a `supabase.functions.invoke("create-checkout-session", ...)`
   como se explica en los comentarios de
   `supabase/functions/create-checkout-session/index.ts`.

Stripe no cobra nada por configurarlo ni por estar en modo de prueba; solo
toma una comisión sobre pagos reales que proceses.

## Contenido de ejemplo que debes reemplazar

- Número de WhatsApp en `src/components/site-footer.tsx` (`WHATSAPP_URL`).
- Productos, precios y stock reales (tabla `products` en Supabase, o desde
  el **Table Editor** del dashboard — no necesitas SQL para editarlos).
- Paquetes de servicio y precios reales (tabla `service_packages`).
- Fotos: reemplaza los SVG de `src/assets/` por fotos reales de tu empresa
  o de los productos (mismo nombre de archivo, o actualiza los `import` en
  `src/routes/index.tsx` y `src/lib/catalog.ts`).
- Año y razón social en el pie de página (`site-footer.tsx`).

## Estructura del proyecto

```
src/routes/       páginas (una por archivo, TanStack Router)
src/components/   header, footer, carrito, chat, componentes de UI
src/lib/          cotizador (quote.ts), catálogo (catalog.ts), chat (ai.functions.ts)
src/integrations/ cliente y tipos de Supabase
supabase/         esquema SQL, datos de ejemplo y función de Stripe opcional
```
