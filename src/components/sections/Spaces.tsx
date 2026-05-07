import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "../Modal";
import { Projector, Mic, Snowflake, Armchair, Wind, Eye, Wine, Lamp, Users } from "lucide-react";
import { DEFAULT_SPACES, DEFAULT_CAPACITIES, useSiteContent, type SpacesContent, type CapacitiesContent } from "@/lib/site-content";

const auditorioImgs = [1, 2, 3, 4].map(i => `https://picsum.photos/1200/700?random=${30 + i}`);
const rooftopImgs = [1, 2, 3, 4].map(i => `https://picsum.photos/1200/700?random=${40 + i}`);

const SpaceModal = ({ open, onClose, name, capacity, badge, desc, features, images }: any) => (
  <Modal open={open} onClose={onClose}>
    <div className="p-8 md:p-12">
      <div className="text-accent uppercase tracking-[0.3em] text-xs font-serif-soft">Piazza Aldeota</div>
      <h3 className="font-display text-4xl md:text-5xl mt-2">{name}</h3>
      <div className="gold-line w-24 my-4" />
      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <span className="px-4 py-1.5 rounded-full bg-primary/40 border border-accent/30 inline-flex items-center gap-2"><Users size={14}/> {capacity}</span>
        <span className="px-4 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/40">{badge}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-4 px-4 mb-8">
        {images.map((src: string, i: number) => (
          <img key={i} src={src} alt="" className="h-64 w-96 object-cover rounded-2xl flex-shrink-0 snap-center border border-accent/20" />
        ))}
      </div>
      <p className="font-serif-soft text-lg text-cream/85 leading-relaxed mb-6">{desc}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {features.map((f: any, i: number) => (
          <div key={i} className="glass-dark rounded-2xl p-4 text-center">
            <f.Icon className="mx-auto text-accent mb-2" size={24} />
            <div className="text-xs text-cream/80">{f.label}</div>
          </div>
        ))}
      </div>
      <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer" className="btn-gold w-full sm:w-auto">
        Solicitar orçamento via WhatsApp
      </a>
    </div>
  </Modal>
);

export const Spaces = () => {
  const [open, setOpen] = useState<null | "aud" | "roof">(null);
  const [spaces] = useSiteContent<SpacesContent>("spaces", DEFAULT_SPACES);
  const [caps] = useSiteContent<CapacitiesContent>("capacities", DEFAULT_CAPACITIES);

  const audImgs = spaces.auditorio.length ? spaces.auditorio : auditorioImgs;
  const roofImgs = spaces.rooftop.length ? spaces.rooftop : rooftopImgs;

  const cards = [
    { id: "aud", title: "Auditório", img: audImgs[0], capacity: `${caps.auditorio} pessoas`, tag: "Climatizado" },
    { id: "roof", title: "Rooftop", img: roofImgs[0], capacity: `${caps.rooftop} pessoas`, tag: "Vista panorâmica" },
  ] as const;

  return (
    <section id="espacos" className="relative py-28 leaf-bg">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Nossos espaços —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Dois ambientes, infinitas possibilidades</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {cards.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => setOpen(c.id as any)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}
              className="group relative text-left rounded-3xl overflow-hidden shadow-teal border border-accent/20 bg-card hover:rotate-0 transition-transform"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-3xl text-cream">{c.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent text-charcoal font-semibold">{c.capacity}</span>
                  </div>
                  <div className="text-accent text-sm font-serif-soft italic mb-4">{c.tag}</div>
                  <span className="text-accent text-sm font-medium tracking-wider">Ver detalhes →</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <SpaceModal
        open={open === "aud"} onClose={() => setOpen(null)}
        name="Auditório" capacity={`${caps.auditorio} pessoas`} badge="❄ Climatizado"
        images={audImgs}
        desc="Auditório versátil e climatizado, projetado para palestras corporativas, treinamentos, lançamentos e cerimônias. Ambiente sofisticado com acústica cuidada e iluminação ajustável."
        features={[
          { Icon: Projector, label: "Projetor HD" },
          { Icon: Mic, label: "Microfones" },
          { Icon: Snowflake, label: "Ar-condicionado" },
          { Icon: Armchair, label: "Cadeiras premium" },
        ]}
      />
      <SpaceModal
        open={open === "roof"} onClose={() => setOpen(null)}
        name="Rooftop" capacity={`${caps.rooftop} pessoas`} badge="🌆 Vista panorâmica"
        images={roofImgs}
        desc="Terraço aberto com vista deslumbrante da Aldeota — perfeito para coquetéis, jantares íntimos, casamentos boutique e celebrações ao entardecer."
        features={[
          { Icon: Wind, label: "Open-air" },
          { Icon: Eye, label: "Vista 360º" },
          { Icon: Wine, label: "Setup cocktail" },
          { Icon: Lamp, label: "Iluminação cênica" },
        ]}
      />
    </section>
  );
};
