import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Gallery = () => {
  const [imgs, setImgs] = useState<{ id: string; url: string }[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("gallery_images").select("id,url").order("position").then(({ data }) => {
      setImgs(data ?? []);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a === null ? a : (a + 1) % imgs.length));
      if (e.key === "ArrowLeft") setActive((a) => (a === null ? a : (a - 1 + imgs.length) % imgs.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, imgs.length]);

  return (
    <section id="galeria" className="relative py-28 bg-secondary leaf-bg">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Galeria —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Nossa Galeria</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 max-w-6xl mx-auto">
          {imgs.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="block w-full mb-5 break-inside-avoid rounded-3xl overflow-hidden shadow-soft border border-accent/20 hover:border-accent transition-all group"
            >
              <img src={img.url} alt="" className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && imgs[active] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-4 right-4 text-cream p-2 rounded-full bg-accent/20" onClick={() => setActive(null)}><X /></button>
            <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a! - 1 + imgs.length) % imgs.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-accent p-3 rounded-full bg-accent/20 hover:bg-accent hover:text-charcoal">
              <ChevronLeft />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setActive((a) => (a! + 1) % imgs.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-accent p-3 rounded-full bg-accent/20 hover:bg-accent hover:text-charcoal">
              <ChevronRight />
            </button>
            <motion.img
              key={imgs[active].id}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={imgs[active].url}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
              alt=""
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream/80 text-sm">{active + 1} / {imgs.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
