import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return controls.stop;
  }, [inView, to, suffix, mv]);

  return <span ref={ref}>0{suffix}</span>;
};

export const Highlights = () => {
  const items = [
    { n: 100, label: "pessoas", caption: "Capacidade total do auditório" },
    { n: 2, label: "espaços", caption: "Auditório + Rooftop premium" },
    { n: 3, label: "opções", caption: "Coffee breaks Bronze · Prata · Ouro" },
  ];
  return (
    <section id="highlights" className="relative bg-primary text-cream py-24 -mt-2 clip-diagonal-t">
      <svg className="absolute right-10 top-10 w-40 opacity-10 text-accent" viewBox="0 0 200 200" fill="currentColor">
        <circle cx="100" cy="100" r="80" />
      </svg>
      <div className="container grid md:grid-cols-3 gap-12 text-center">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
          >
            <div className="gold-divider" />
            <div className="font-display text-6xl md:text-7xl text-accent">
              <Counter to={it.n} />
            </div>
            <div className="font-serif-soft italic text-2xl mt-2 text-cream/90">{it.label}</div>
            <p className="text-cream/60 text-sm mt-3 max-w-xs mx-auto">{it.caption}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
