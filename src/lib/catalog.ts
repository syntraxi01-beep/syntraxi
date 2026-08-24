import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import sensorImg from "@/assets/prod-sensor.svg";
import plcImg from "@/assets/prod-plc.svg";
import scannerImg from "@/assets/prod-scanner.svg";

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
  instrumentacion: sensorImg,
  automatizacion: plcImg,
  logistica: scannerImg,
};

export function productImage(product: Pick<Product, "image_url" | "category">) {
  return product.image_url ?? fallbackImages[product.category] ?? sensorImg;
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
