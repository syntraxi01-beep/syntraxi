export type ShippingMode = "maritimo" | "aereo" | "expres";

export const PRODUCT_TYPES = [
  { value: "electronica", label: "Electrónicos / componentes", duty: 0.05 },
  { value: "textiles", label: "Textiles / confección", duty: 0.15 },
  { value: "maquinaria", label: "Maquinaria industrial", duty: 0 },
  { value: "instrumentacion", label: "Instrumentación / sensores", duty: 0.05 },
  { value: "hogar", label: "Hogar y accesorios", duty: 0.1 },
  { value: "general", label: "Otro / mixto", duty: 0.1 },
] as const;

export const SHIPPING_MODES: {
  value: ShippingMode;
  label: string;
  perKg: number;
  minimum: number;
  eta: string;
}[] = [
  { value: "maritimo", label: "Marítimo consolidado", perKg: 4.2, minimum: 140, eta: "35 – 45 días" },
  { value: "aereo", label: "Aéreo estándar", perKg: 9.5, minimum: 180, eta: "12 – 18 días" },
  { value: "expres", label: "Aéreo exprés", perKg: 14, minimum: 90, eta: "6 – 9 días" },
];

export interface QuoteInput {
  productType: string;
  weightKg: number;
  declaredValueUsd: number;
  shippingMode: ShippingMode;
}

export interface QuoteEstimate {
  freight: number;
  duty: number;
  vat: number;
  serviceFee: number;
  total: number;
  eta: string;
  perKg: number;
}

export function estimateImport(input: QuoteInput): QuoteEstimate {
  const mode = SHIPPING_MODES.find((m) => m.value === input.shippingMode) ?? SHIPPING_MODES[0]!;
  const type = PRODUCT_TYPES.find((t) => t.value === input.productType);
  const dutyRate = type?.duty ?? 0.1;

  const weight = Math.max(0, input.weightKg);
  const value = Math.max(0, input.declaredValueUsd);

  const freight = Math.max(mode.minimum, weight * mode.perKg);
  const duty = value * dutyRate;
  const vat = (value + duty + freight) * 0.19;
  const serviceFee = Math.max(150, value * 0.12);

  const round = (n: number) => Math.round(n * 100) / 100;

  return {
    freight: round(freight),
    duty: round(duty),
    vat: round(vat),
    serviceFee: round(serviceFee),
    total: round(freight + duty + vat + serviceFee),
    eta: mode.eta,
    perKg: mode.perKg,
  };
}

export const usd = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const usdExact = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "USD" }).format(n);
