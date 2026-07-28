import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../Modal";
import { DEFAULT_PRICES, fmt, useSiteContent, waLink, type Prices } from "@/lib/site-content";

type CardId = "bronze" | "prata" | "ouro" | "manha";
type TabId = "coffee" | "manha";

const menus: Record<CardId, { items: string[]; note?: string }> = {
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
      "🥩 Carne escabeche com pães diversos",
      "🍕 Pizzete de calabresa",
      "🍔 Mini hambúrgueres",
      "🍫 Torta brownie",
      "🎉 Salgados festivos (coxinha, pastel, canudinho, bolinha de queijo)",
    ],
  },
  ouro: {
    items: [
      "☕ Café, chá e refrigerantes",
      "🧀 Terrine de queijos com tostadas de parmesão",
      "🍗 Finger food de frango ao gorgonzola",
      "🥔 Ramekin de batata com bacon ao molho bechamel",
      "🍤 Salgados finos diversos (carne de sol, camarão, frango, mini quiche lorraine e mini quiche de ricota com ervas)",
      "🍔 Mini hamburguinho",
      "🍫 Mini brownie e brigadeiro",
    ],
  },
  manha: {
    items: [
      "🧀 Pão de queijo",
      "🥥 Tapioca de coco",
      "🌽 Cuscuz temperado",
      "🥩 Carne moída ao molho",
      "🍌 Banana ou abacaxi caramelizado",
      "🥐 Croissant recheado",
      "🥖 Pães diversos",
      "🥣 Mix de cereais",
      "🍓 Frutas da estação laminadas",
      "🍰 Bolo mole",
      "🎂 Bolo fofo",
      "☕ Café",
      "🍵 Chá",
      "🥤 Suco",
      "🥛 Iogurte",
      "🥛 Leite",
      "🍫 Chocolate quente com marshmallow",
    ],
  },
};

export const Coffee = () => {
  const [open, setOpen] = useState<null | CardId>(null);
  const [tab, setTab] = useState<TabId>("coffee");
  const [prices] = useSiteContent<Prices>("prices", DEFAULT_PRICES);

  const cards = [
    { id: "bronze" as const, tab: "coffee" as const, name: "Bronze", icon: "🥉", price: prices.coffee.bronze, category: "Coffee Break", accent: "from-amber-700/20 to-amber-900/10" },
    { id: "prata" as const, tab: "coffee" as const, name: "Prata", icon: "🥈", price: prices.coffee.prata, category: "Coffee Break", accent: "from-slate-300/20 to-slate-500/10" },
    { id: "ouro" as const, tab: "coffee" as const, name: "Ouro", icon: "🥇", price: prices.coffee.ouro, category: "Coffee Break", accent: "from-accent/30 to-accent/10" },
    { id: "manha" as const, tab: "manha" as const, name: "Café da Manhã", icon: "🌅", price: prices.coffee.manha ?? DEFAULT_PRICES.coffee.manha, category: "Café da Manhã", accent: "from-accent/25 to-primary/10" },
  ];

  const visible = cards.filter(c => c.tab === tab);

  const tabs: { id: TabId; label: string }[] = [
    { id: "coffee", label: "Coffee Break" },
    { id: "manha", label: "Café da Manhã" },
  ];

  return (
    <section id="coffee" className="relative py-28 bg-background leaf-bg">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Produto 05 —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Gastronomia que impressiona</h2>
          <div className="gold-divider" />
          <svg className="mx-auto mt-4 w-12 text-accent/60" viewBox="0 0 60 60" fill="currentColor">
            <ellipse cx="30" cy="30" rx="20" ry="8" transform="rotate(-30 30 30)" />
            <ellipse cx="30" cy="30" rx="20" ry="8" transform="rotate(30 30 30)" />
          </svg>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-1 p-1.5 rounded-full border-2 border-accent/25 bg-card">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-medium uppercase tracking-[0.15em] transition-all ${
                  tab === t.id ? "bg-accent text-charcoal shadow-soft" : "text-muted-foreground hover:text-accent"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`grid gap-6 mx-auto ${visible.length === 1 ? "max-w-md" : "md:grid-cols-3 max-w-5xl"}`}
          >
            {visible.map(c => (
              <motion.button key={c.id} onClick={() => setOpen(c.id)}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {cards.map(c => (
        <Modal key={c.id} open={open === c.id} onClose={() => setOpen(null)}>
          <div className="p-8 md:p-12">
            <div className="text-6xl mb-2">{c.icon}</div>
            <div className="font-serif-soft italic text-accent uppercase tracking-[0.3em] text-xs">{c.category}</div>
            <h3 className="font-display text-4xl md:text-5xl mt-2">{c.name}</h3>
            <div className="gold-line w-24 my-4" />
            <div className="font-display text-4xl text-accent mb-8">{fmt(c.price)}<span className="text-base text-cream/60 font-body">/pessoa</span></div>
            <ul className="space-y-3 mb-8">
              {menus[c.id].items.map((it, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="font-serif-soft text-lg border-b border-accent/10 pb-2">
                  {it}
                </motion.li>
              ))}
            </ul>
            {menus[c.id].note && <p className="text-sm italic text-accent mb-6">★ {menus[c.id].note}</p>}
            <a href={waLink(`Olá! Tenho interesse no *${c.category} ${c.name}* (${fmt(c.price)} por pessoa). Podem me passar mais informações?`)} target="_blank" rel="noreferrer" className="btn-gold">Solicitar via WhatsApp</a>
          </div>
        </Modal>
      ))}
    </section>
  );
};
