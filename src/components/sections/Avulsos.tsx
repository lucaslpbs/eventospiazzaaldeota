import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "../Modal";
import { Users } from "lucide-react";
import { DEFAULT_PRICES, fmt, useSiteContent, type Prices } from "@/lib/site-content";

export const Avulsos = () => {
  const [open, setOpen] = useState<null | string>(null);
  const [prices] = useSiteContent<Prices>("prices", DEFAULT_PRICES);

  const items = [
    { id: "aud_roof", title: "Auditório + Rooftop", capacity: "60 pessoas", price: prices.avulsos.aud_roof,
      img: "https://picsum.photos/800/600?random=51",
      desc: "Combo completo dos dois espaços para eventos que pedem amplitude e versatilidade.", code: "Produto 02" },
    { id: "auditorio", title: "Auditório", capacity: "100 pessoas", price: prices.avulsos.auditorio,
      img: "https://picsum.photos/800/600?random=52",
      desc: "Auditório climatizado, ideal para palestras, treinamentos e apresentações.", code: "Produto 03" },
    { id: "rooftop", title: "Rooftop", capacity: "60 pessoas", price: prices.avulsos.rooftop,
      img: "https://picsum.photos/800/600?random=53",
      desc: "Rooftop com vista panorâmica para coquetéis, jantares e celebrações ao ar livre.", code: "Produto 04" },
  ];

  return (
    <section className="relative py-28 bg-primary text-cream clip-diagonal-t -mt-2">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Espaços avulsos —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Reserve apenas o que você precisa</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <motion.div key={it.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-dark rounded-3xl overflow-hidden grid md:grid-cols-[280px_1fr] hover:border-accent/60 transition-all"
            >
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="text-accent text-xs uppercase tracking-[0.25em] font-serif-soft italic">{it.code}</div>
                <h3 className="font-display text-3xl mt-1">{it.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-cream/80 text-sm">
                  <span className="inline-flex items-center gap-1.5"><Users size={14}/> até {it.capacity}</span>
                  <span className="font-display text-2xl text-accent">{fmt(it.price)}</span>
                </div>
                <button onClick={() => setOpen(it.id)} className="self-start mt-4 text-accent text-sm font-medium tracking-wider hover:text-accent-deep">
                  Ver detalhes →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {items.map(it => (
        <Modal key={it.id} open={open === it.id} onClose={() => setOpen(null)}>
          <div>
            <img src={it.img} alt="" className="w-full h-72 object-cover" />
            <div className="p-8 md:p-10">
              <div className="font-serif-soft italic text-accent uppercase tracking-[0.3em] text-xs">{it.code}</div>
              <h3 className="font-display text-4xl mt-2">{it.title}</h3>
              <div className="gold-line w-24 my-4" />
              <p className="font-serif-soft text-lg opacity-85 mb-4">{it.desc}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/40 border border-accent/30 text-sm">até {it.capacity}</span>
                <span className="px-4 py-1.5 rounded-full bg-accent text-charcoal text-sm font-semibold">{fmt(it.price)}</span>
              </div>
              <p className="text-xs opacity-60 italic mb-6">Pacotes anuais, semestrais e trimestrais com condições especiais — consulte.</p>
              <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer" className="btn-gold">Solicitar via WhatsApp</a>
            </div>
          </div>
        </Modal>
      ))}
    </section>
  );
};
