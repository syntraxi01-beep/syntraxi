-- Datos de ejemplo adicionales para que la tienda y el cotizador se vean
-- con contenido completo desde el primer día. Reemplaza esto por tus
-- productos y precios reales cuando los tengas.

INSERT INTO public.products (slug, name, description, category, price_usd, stock, featured) VALUES
('sensor-flujo-ultrasonico', 'Sensor de flujo ultrasónico UF-2000', 'Medición no invasiva de caudal, ideal para tuberías industriales.', 'instrumentacion', 289.00, 24, true),
('camara-termografica', 'Cámara termográfica portátil', 'Diagnóstico térmico de alta resolución para mantenimiento predictivo.', 'instrumentacion', 520.00, 8, true),
('dron-inspeccion', 'Dron de inspección industrial', 'Inspección aérea de plantas, techos y estructuras de difícil acceso.', 'instrumentacion', 1450.00, 6, false),
('variador-frecuencia', 'Variador de frecuencia 7.5 kW', 'Control de velocidad para motores trifásicos industriales.', 'automatizacion', 410.00, 12, false),
('motor-paso-a-paso', 'Kit motor paso a paso NEMA 34', 'Motor de alto torque con driver incluido para automatización.', 'automatizacion', 96.00, 60, false),
('router-cnc', 'Router CNC 6090', 'Máquina de corte y grabado CNC para madera, acrílico y metales blandos.', 'automatizacion', 2350.00, 3, true),
('tablero-control-bombeo', 'Tablero de control de bombeo', 'Tablero armado con protecciones para sistemas de bombeo industrial.', 'automatizacion', 890.00, 4, false),
('bascula-plataforma', 'Báscula de plataforma 1.500 kg', 'Báscula industrial de piso con indicador digital.', 'logistica', 780.00, 5, false),
('etiquetadora-termica', 'Impresora térmica de etiquetas', 'Impresión de etiquetas y guías para bodega y despachos.', 'logistica', 210.00, 25, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.quotes (full_name, email, phone, product_type, weight_kg, declared_value_usd, shipping_mode, destination_city, estimate_usd, status) VALUES
('Camila Rojas', 'camila.rojas@example.com', '3011234567', 'electronica', 85, 2400, 'aereo', 'Bogotá', 1180.40, 'nueva'),
('Andrés Pardo', 'andres.pardo@example.com', '3007654321', 'maquinaria', 320, 9800, 'maritimo', 'Medellín', 2760.10, 'en_revision'),
('Laura Gómez', 'laura.gomez@example.com', '3159876543', 'instrumentacion', 40, 1500, 'expres', 'Cali', 950.30, 'aprobada'),
('Diego Herrera', 'diego.herrera@example.com', '3201122334', 'hogar', 150, 3200, 'maritimo', 'Barranquilla', 1440.75, 'nueva')
ON CONFLICT DO NOTHING;
