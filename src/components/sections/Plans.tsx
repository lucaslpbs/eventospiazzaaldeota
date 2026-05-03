import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "../Modal";
import { Check, Star } from "lucide-react";
import { DEFAULT_PRICES, fmt, useSiteContent, type Prices } from "@/lib/site-content";

const tiers = [25, 50, 100] as const;

const included = [
  "Acesso ao Auditório climatizado",
  "Acesso ao Rooftop com vista",
  "Coffee Break completo",
  "Equipe de apoio dedicada",
  "Setup de mesas e cadeiras",
  "Som ambiente e microfones",
];

const PlanModal = ({ open, onClose, plan, prices, color }: any) => {
  const [pax, setPax] = useState<25 | 50 | 100>(50);
  const perPerson = prices[String(pax)];
  const total = perPerson * pax;

  return (
    <Modal open={open} onClose={onClose} dark={color !== "cream"}>
      <div className="p-8 md:p-12">
        <div className="font-serif-soft italic text-accent uppercase tracking-[0.3em] text-xs">Plano Completo</div>
        <h3 className="font-display text-4xl md:text-5xl mt-2">{plan.name}</h3>
        <div className="gold-line w-24 my-4" />
        <p className="font-serif-soft text-lg opacity-85 mb-8">{plan.desc}</p>

        <div className="mb-8">
          <div className="text-sm uppercase tracking-widest opacity-70 mb-3">Quantidade de pessoas</div>
          <div className="grid grid-cols-3 gap-3">
            {tiers.map(t => (
              <button key={t} onClick={() => setPax(t)}
                className={`py-4 rounded-2xl font-display text-xl border-2 transition-all ${
                  pax === t ? "bg-accent text-charcoal border-accent" : "border-accent/30 hover:border-accent"
                }`}>
                {t} pax
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-accent/30 p-6 mb-8 bg-accent/5">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="text-sm opacity-70">Valor por pessoa</div>
              <div className="font-display text-3xl">{fmt(perPerson)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-70">Total estimado</div>
              <div className="font-display text-4xl text-accent">{fmt(total)}</div>
            </div>
          </div>
          <p className="text-xs opacity-60 mt-3 italic">Inclui todos os espaços e coffee break.</p>
        </div>

        <div className="mb-8">
          <div className="text-sm uppercase tracking-widest opacity-70 mb-3">O que está incluso</div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {included.map((it, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check size={18} className="text-accent flex-shrink-0 mt-0.5" /> {it}
              </li>
            ))}
          </ul>
        </div>

        <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer" className="btn-gold w-full sm:w-auto">
          Solicitar este plano via WhatsApp
        </a>
      </div>
    </Modal>
  );
};

const PlanCard = ({ plan, prices, onClick, variant, rotate }: any) => {
  const styles =
    variant === "premium"
      ? "bg-primary text-cream border-accent/60 shadow-teal scale-100 md:scale-105 z-10"
      : variant === "signature"
      ? "bg-charcoal text-cream border-accent/40"
      : "bg-card text-foreground border-accent/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative rounded-3xl border-2 p-8 hover:rotate-0 transition-all ${styles}`}
    >
      {variant === "premium" && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-charcoal text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Star size={12} fill="currentColor" /> Mais Popular
        </div>
      )}
      <div className="font-serif-soft italic uppercase tracking-[0.25em] text-xs opacity-70">Plano</div>
      <h3 className="font-display text-3xl mt-1">{plan.name}</h3>
      <div className="gold-line w-16 my-4" />
      <p className="text-sm opacity-80 mb-6 min-h-[3rem]">{plan.tagline}</p>

      <div className="space-y-3 mb-8">
        {tiers.map(t => (
          <div key={t} className="flex items-center justify-between border-b border-current/10 pb-2">
            <span className="text-sm opacity-80">até {t} pax</span>
            <span className="font-display text-xl">{fmt(prices[String(t)])}</span>
          </div>
        ))}
      </div>

      <button onClick={onClick} className={variant === "essencial" ? "btn-primary w-full" : "btn-gold w-full"}>
        Ver o que está incluso →
      </button>
    </motion.div>
  );
};

export const Plans = () => {
  const [open, setOpen] = useState<null | "essencial" | "premium" | "signature">(null);
  const [prices] = useSiteContent<Prices>("prices", DEFAULT_PRICES);

  const plans = [
    { id: "essencial", name: "Essencial", tagline: "O essencial para um evento elegante e bem servido.", rotate: -2, variant: "essencial" as const },
    { id: "premium", name: "Premium", tagline: "Nossa escolha mais procurada — equilíbrio perfeito.", rotate: 0, variant: "premium" as const },
    { id: "signature", name: "Signature", tagline: "Experiência assinatura: gastronomia e detalhes premium.", rotate: 2, variant: "signature" as const },
  ];

  return (
    <section id="planos" className="relative py-28 bg-secondary leaf-bg">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Produto 01 —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Planos Completos</h2>
          <div className="gold-divider" />
          <p className="font-serif-soft text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Tudo incluído: espaços, coffee break e equipe. Escolha o nível de experiência ideal para o seu evento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map(p => (
            <PlanCard key={p.id} plan={p} prices={prices[p.id as keyof Prices]} variant={p.variant} rotate={p.rotate}
              onClick={() => setOpen(p.id as any)} />
          ))}
        </div>
      </div>

      {plans.map(p => (
        <PlanModal key={p.id} open={open === p.id} onClose={() => setOpen(null)}
          plan={{ name: p.name, desc: p.tagline }}
          prices={prices[p.id as keyof Prices]}
          color={p.id === "essencial" ? "cream" : "dark"} />
      ))}
    </section>
  );
};
