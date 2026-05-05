import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { DEFAULT_HERO, useSiteContent, type HeroContent } from "@/lib/site-content";

const split = (txt: string) => txt.split("");

export const Hero = () => {
  const [hero] = useSiteContent<HeroContent>("hero", DEFAULT_HERO);

  const ytId = (() => {
    const url = hero.video_url || "";
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  })();

  return (
    <section id="top" className="relative h-screen min-h-[640px] w-full overflow-hidden clip-wave-b">
      {ytId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            key={ytId}
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&playlist=${ytId}`}
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full border-0"
          />
        </div>
      ) : (
        <video
          key={hero.video_url}
          src={hero.video_url}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-charcoal/30" />

      {/* leaf decoration */}
      <svg className="absolute -left-10 top-24 w-64 opacity-20 text-accent animate-leaf-sway" viewBox="0 0 200 200" fill="currentColor">
        <path d="M100 10 C 60 40, 40 90, 50 160 C 80 130, 130 130, 160 90 C 150 50, 130 20, 100 10 Z" />
      </svg>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif-soft uppercase tracking-[0.4em] text-accent text-xs md:text-sm mb-6"
        >
          ✦ Aldeota · Fortaleza ✦
        </motion.div>

        <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl text-balance">
          {split(hero.headline).map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.025, duration: 0.5 }}
              className="inline-block"
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-8 font-serif-soft italic text-cream/85 text-xl md:text-2xl max-w-2xl"
        >
          {hero.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a href="#espacos" className="btn-primary">Ver Espaços</a>
          <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer" className="btn-outline-gold">
            Falar no WhatsApp
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#highlights"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-accent"
        aria-label="Scroll"
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
};
