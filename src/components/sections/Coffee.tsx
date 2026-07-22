import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "../Modal";
import { DEFAULT_PRICES, fmt, useSiteContent, waLink, type Prices } from "@/lib/site-content";

const menus: Record<string, { items: string[]; note?: string }> = {
  bronze: {
    items: [
      "☕ Café, chá e refrigerante",
      "🥤 Suco natural (1 sabor)",
      "🥐 Croissant recheado (misto, carne de sol, calabresa, frango ou queijo)",
      "🎉 Salgados festivos (coxinha, pastel, canudinho, bolinha de queijo)",
      "🥖 Mini pão delícia (pão de leite com peito de peru e cream cheese)",
      "🌭 Mini hot dog",
      "🥧 Mini empadinhas",
      "🍪 Biscoitinhos amanteigados de castanha e goiabada",
      "🍰 Bolo mole",
    ],
  },
  prata: {
    items: [
      "☕ Café, chá e refrigerantes",
      "🥤 2 sucos naturais",
      "🧀 Terrine de queijos com tostadas",
      "🥩 Carne escabiche com pães diversos",
      "🍕 Pizzete de calabresa",
      "🍔 Mini hambúrgueres",
      "🍊 Bolo de laranja com calda caramelizada",
      "🎉 Salgados festivos (coxinha, pastel, canudinho, bolinha de queijo)",
      "🍌 Folheado de banana com canela ou chocolate",
    ],
  },
  ouro: {
    items: [
      "☕ Café, chá e refrigerantes",
      "🧀 Terrine de queijos com tostadas de parmesão",
      "🍗 Finger food de frango ao gorgonzola",
      "🥔 Ramekin de batata com bacon ao molho bechamel",
      "🍤 Salgados finos diversos (carne de sol, camarão, frango, mini quiche lorraine, mini quiche de ricota com ervas)",
      "🍔 Mini hamburguinho",
      "🍫 Mini brownie e brigadeiro",
    ],
  },
};

export const Coffee = () => {
  const [open, setOpen] = useState<null | "bronze" | "prata" | "ouro">(null);
  const [prices] = useSiteContent<Prices>("prices", DEFAULT_PRICES);

  const cards = [
    { id: "bronze" as const, name: "Bronze", icon: "🥉", price: prices.coffee.bronze, category: "Coffee Break", accent: "from-amber-700/20 to-amber-900/10" },
    { id: "prata" as const, name: "Prata", icon: "🥈", price: prices.coffee.prata, category: "Coffee Break", accent: "from-slate-300/20 to-slate-500/10" },
    { id: "ouro" as const, name: "Ouro", icon: "🥇", price: prices.coffee.ouro, category: "Coquetel", accent: "from-accent/30 to-accent/10" },
  ];

  return (
    <section id="coffee" className="relative py-28 bg-background leaf-bg">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Produto 05 —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Gastronomia que impressiona</h2>
          <div className="gold-divider" />
          <svg className="mx-auto mt-4 w-12 text-accent/60" viewBox="0 0 60 60" fill="currentColor">
            <ellipse cx="30" cy="30" rx="20" ry="8" transform="rotate(-30 30 30)" />
            <ellipse cx="30" cy="30" rx="20" ry="8" transform="rotate(30 30 30)" />
          </svg>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((c, i) => (
            <motion.button key={c.id} onClick={() => setOpen(c.id)}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`text-left rounded-3xl p-8 border-2 border-accent/20 bg-gradient-to-br ${c.accent} bg-card hover:border-accent/60 transition-all shadow-soft`}
            >
              <div className="text-5xl mb-4">{c.icon}</div>
              <div className="font-serif-soft italic uppercase tracking-[0.25em] text-xs text-muted-foreground">{c.category}</div>
              <h3 className="font-display text-4xl mt-1">{c.name}</h3>
              <div className="gold-line w-12 my-4" />
              <div className="font-display text-3xl text-primary">{fmt(c.price)}<span className="text-sm text-muted-foreground font-body">/pessoa</span></div>
              <div className="mt-6 text-accent font-medium text-sm">Ver cardápio completo →</div>
            </motion.button>
          ))}
        </div>
      </div>

      {cards.map(c => (
        <Modal key={c.id} open={open === c.id} onClose={() => setOpen(null)}>
          <div className="p-8 md:p-12">
            <div className="text-6xl mb-2">{c.icon}</div>
            <div className="font-serif-soft italic text-accent uppercase tracking-[0.3em] text-xs">Coffee Break</div>
            <h3 className="font-display text-4xl md:text-5xl mt-2">{c.name}</h3>
            <div className="gold-line w-24 my-4" />
            <div className="font-display text-4xl text-accent mb-8">{fmt(c.price)}<span className="text-base text-cream/60 font-body">/pessoa</span></div>
            <ul className="space-y-3 mb-8">
              {menus[c.id].items.map((it, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="font-serif-soft text-lg border-b border-accent/10 pb-2">
                  {it}
                </motion.li>
              ))}
            </ul>
            {menus[c.id].note && <p className="text-sm italic text-accent mb-6">★ {menus[c.id].note}</p>}
            <a href={waLink(`Olá! Tenho interesse no Coffee Break *${c.name}* (${fmt(c.price)} por pessoa). Podem me passar mais informações?`)} target="_blank" rel="noreferrer" className="btn-gold">Solicitar via WhatsApp</a>
          </div>
        </Modal>
      ))}
    </section>
  );
};
