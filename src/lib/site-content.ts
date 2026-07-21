import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export type Prices = {
  essencial: Record<string, number>;
  premium: Record<string, number>;
  signature: Record<string, number>;
  avulsos: { aud_roof: number; auditorio: number; rooftop: number };
  coffee: { bronze: number; prata: number; ouro: number };
};

export type HeroContent = { video_url: string; headline: string; subtext: string };
export type ContactContent = { phone: string; whatsapp: string; instagram: string; address: string };
export type SpacesContent = { auditorio: string[]; rooftop: string[] };
export type AvulsosContent = { aud_roof: string; auditorio: string; rooftop: string };
export type CapacitiesContent = { auditorio: number; rooftop: number; aud_roof: number };

export const WHATSAPP_URL = "https://wa.me/5585989801309";
export const INSTAGRAM_URL = "https://instagram.com/piazzaaldeota";

export const waLink = (message: string) =>
  `https://wa.me/5585989801309?text=${encodeURIComponent(message)}`;

export const DEFAULT_HERO: HeroContent = {
  video_url: "https://www.youtube.com/watch?v=aSBLj1RGIzw",
  headline: "Onde cada detalhe transforma o seu evento.",
  subtext: "Auditório · Rooftop · Coffee Break Premium — Aldeota, Fortaleza",
};
export const DEFAULT_CONTACT: ContactContent = {
  phone: "(85) 98980-1309", whatsapp: "5585989801309",
  instagram: "piazzaaldeota", address: "Aldeota, Fortaleza – CE",
};
export const DEFAULT_PRICES: Prices = {
  essencial: { "25": 194.9, "50": 175, "100": 129.9 },
  premium: { "25": 209.9, "50": 185.9, "100": 149.9 },
  signature: { "25": 219.9, "50": 199.9, "100": 149.9 },
  avulsos: { aud_roof: 5800, auditorio: 2799, rooftop: 2900 },
  coffee: { bronze: 65, prata: 85, ouro: 95 },
};
export const DEFAULT_SPACES: SpacesContent = { auditorio: [], rooftop: [] };
export const DEFAULT_AVULSOS: AvulsosContent = { aud_roof: "", auditorio: "", rooftop: "" };
export const DEFAULT_CAPACITIES: CapacitiesContent = { auditorio: 100, rooftop: 60, aud_roof: 60 };

export function useSiteContent<T>(key: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    let active = true;
    supabase.from("site_content").select("value").eq("key", key).maybeSingle().then(({ data: row }) => {
      if (active && row?.value) setData({ ...fallback, ...(row.value as object) } as T);
    });
    return () => { active = false; };
  }, [key]);
  return [data, setData] as const;
}

export const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
