import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; name: string; company: string | null; stars: number; quote: string; avatar_url: string | null };

export const Testimonials = () => {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    supabase.from("testimonials").select("*").order("position").then(({ data }) => setItems(data ?? []));
  }, []);

  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <section className="relative py-28 bg-charcoal text-cream overflow-hidden">
      <div className="container text-center mb-16">
        <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Depoimentos —</div>
        <h2 className="font-display text-5xl md:text-6xl mt-3">O que dizem sobre nós</h2>
        <div className="gold-divider" />
      </div>

      <div className="relative group">
        <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max">
          {loop.map((t, i) => (
            <motion.div key={i} className="w-[360px] glass-dark rounded-3xl p-8 flex-shrink-0">
              <div className="flex gap-1 mb-4 text-accent">
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
              </div>
              <p className="font-serif-soft italic text-lg text-cream/90 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                {t.avatar_url && <img src={t.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-accent" />}
                <div>
                  <div className="font-display text-lg">{t.name}</div>
                  {t.company && <div className="text-xs text-accent">{t.company}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
