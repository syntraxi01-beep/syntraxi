import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import instrumentacionImg from "@/assets/inst3.jpg";
import automatizacionImg from "@/assets/automatizacion.jpg";
import logisticaImg from "@/assets/dropshipping.jpg";
import plcKitImg from "@/assets/plc-kit.jpg";
import escanerImg from "@/assets/escaner.jpg";
import tableroControlImg from "@/assets/tablero-control.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price_usd: number;
  stock: number;
  image_url: string | null;
  featured: boolean;
}

export interface ServicePackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_usd: number | null;
  billing_interval: string;
  features: string[];
  highlighted: boolean;
}

const fallbackImages: Record<string, string> = {
  instrumentacion: instrumentacionImg,
  automatizacion: automatizacionImg,
  logistica: logisticaImg,
};

// Fotos específicas por producto (por slug), para los productos donde ya tenemos
// una foto que coincide bien con el artículo exacto. El resto usa la foto de su categoría.
const productImageOverrides: Record<string, string> = {
  "plc-s7-1200-kit": plcKitImg,
  "escaner-logistico": escanerImg,
  "tablero-control-basico": tableroControlImg,
  "tablero-control-bombeo": tableroControlImg,
};

export function productImage(product: Pick<Product, "image_url" | "category" | "slug">) {
  return (
    product.image_url ??
    productImageOverrides[product.slug] ??
    fallbackImages[product.category] ??
    instrumentacionImg
  );
}

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, description, category, price_usd, stock, image_url, featured")
      .order("featured", { ascending: false })
      .order("name");
    if (error) throw error;
    return (data ?? []).map((p) => ({ ...p, price_usd: Number(p.price_usd) })) as Product[];
  },
});

export const packagesQuery = queryOptions({
  queryKey: ["service_packages"],
  queryFn: async (): Promise<ServicePackage[]> => {
    const { data, error } = await supabase
      .from("service_packages")
      .select("id, slug, name, description, price_usd, billing_interval, features, highlighted")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map((p) => ({
      ...p,
      price_usd: p.price_usd === null ? null : Number(p.price_usd),
    })) as ServicePackage[];
  },
});
