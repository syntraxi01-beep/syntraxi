-- Esquema inicial de Syntraxi: perfiles, catálogo, cotizaciones y pedidos.
-- Ejecuta este archivo en el SQL Editor de tu propio proyecto de Supabase
-- (Project → SQL Editor → New query → pega el contenido → Run), o vía
-- `supabase db push` si usas el CLI.

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (active);

CREATE TABLE public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_usd NUMERIC(10,2),
  billing_interval TEXT NOT NULL DEFAULT 'mes',
  features TEXT[] NOT NULL DEFAULT '{}',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.service_packages TO anon;
GRANT SELECT ON public.service_packages TO authenticated;
GRANT ALL ON public.service_packages TO service_role;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_public_read" ON public.service_packages FOR SELECT TO anon, authenticated USING (active);

CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_type TEXT NOT NULL,
  weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  declared_value_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_mode TEXT NOT NULL DEFAULT 'maritimo',
  destination_city TEXT,
  message TEXT,
  estimate_usd NUMERIC(12,2),
  estimate_breakdown JSONB,
  status TEXT NOT NULL DEFAULT 'nueva',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quotes TO anon;
GRANT SELECT, INSERT ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes_anon_insert" ON public.quotes FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "quotes_auth_insert" ON public.quotes FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "quotes_own_read" ON public.quotes FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendiente',
  payment_provider TEXT,
  payment_reference TEXT,
  tracking_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "orders_own_insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Auto-crea el perfil cuando alguien se registra (email o Google OAuth).
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.products (slug, name, description, category, price_usd, stock, featured) VALUES
('sensor-industrial-v2', 'Módulo de sensor industrial V2', 'Sensor de nivel y presión con salida 4-20 mA, calibrado en origen.', 'instrumentacion', 89.00, 142, true),
('plc-s7-1200-kit', 'Kit PLC compatible S7-1200', 'Controlador lógico programable con módulo de comunicación Ethernet.', 'automatizacion', 1200.00, 18, true),
('escaner-logistico', 'Escáner logístico inalámbrico', 'Lector 2D con base de carga y batería de 12 horas para bodega.', 'logistica', 112.50, 64, true),
('transmisor-caudal', 'Transmisor de caudal electromagnético', 'DN50, precisión 0.5%, ideal para acueductos y plantas de tratamiento.', 'instrumentacion', 745.00, 9, false),
('tablero-control-basico', 'Tablero de control armado', 'Tablero con borneras, protecciones y cableado certificado.', 'automatizacion', 520.00, 12, false),
('camara-termica-usb', 'Cámara termográfica USB-C', 'Diagnóstico térmico en campo con software incluido.', 'instrumentacion', 265.00, 33, false);

INSERT INTO public.service_packages (slug, name, description, price_usd, billing_interval, features, highlighted, sort_order) VALUES
('inicial', 'Plan Inicial', 'Para quienes empiezan a importar y quieren acompañamiento completo.', 499.00, 'mes', ARRAY['Hasta 3 importaciones mensuales','Búsqueda y validación de proveedores','Chat de soporte con IA 24/7','Seguimiento en cada etapa'], false, 1),
('corporativo', 'Plan Corporativo', 'Para negocios con volumen recurrente y necesidad de consolidación.', 1250.00, 'mes', ARRAY['Importaciones ilimitadas','Consolidación de carga sin costo','Gestor de cuenta dedicado','Inspección de calidad en origen','Gestión aduanera completa'], true, 2),
('dropshipping', 'Plan Dropshipping', 'Vende sin inventario: nosotros despachamos a tu cliente final.', 349.00, 'mes', ARRAY['Selección de proveedores confiables','Integración de catálogo a tu tienda','Gestión de pedidos y envíos','Soporte ante devoluciones'], false, 3),
('diagnostico-industrial', 'Diagnóstico industrial', 'Peritaje técnico en sitio con informe formal para auditorías.', 380.00, 'servicio', ARRAY['Inspección especializada en campo','Pruebas con monitoreo continuo','Informe técnico formal','Recomendaciones de repuestos'], false, 4);
