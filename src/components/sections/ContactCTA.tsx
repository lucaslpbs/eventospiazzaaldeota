import { motion } from "framer-motion";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { DEFAULT_CONTACT, useSiteContent, type ContactContent } from "@/lib/site-content";

export const ContactCTA = () => {
  const [contact] = useSiteContent<ContactContent>("contact", DEFAULT_CONTACT);

  return (
    <section id="contato" className="relative py-32 overflow-hidden bg-primary text-cream">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(https://picsum.photos/1920/1080?random=70)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-primary/70 to-charcoal/90" />

      <svg className="absolute -top-6 -left-6 w-48 text-accent/40 animate-leaf-sway" viewBox="0 0 200 200" fill="currentColor">
        <path d="M100 10 C 60 40, 40 90, 50 160 C 80 130, 130 130, 160 90 C 150 50, 130 20, 100 10 Z" />
      </svg>
      <svg className="absolute -bottom-6 -right-6 w-48 text-accent/40 rotate-180" viewBox="0 0 200 200" fill="currentColor">
        <path d="M100 10 C 60 40, 40 90, 50 160 C 80 130, 130 130, 160 90 C 150 50, 130 20, 100 10 Z" />
      </svg>

      <div className="container relative z-10 text-center max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl text-balance"
        >
          Pronto para criar um evento <em className="text-accent not-italic font-display">inesquecível</em>?
        </motion.h2>
        <div className="gold-divider mt-6" />
        <p className="font-serif-soft italic text-xl text-cream/85 mt-6">{contact.address}</p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="btn-gold">
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer" className="btn-outline-gold">
            <Instagram size={18} /> Instagram
          </a>
          <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-cream/30 text-cream/90 font-body">
            <MapPin size={18} /> Aldeota, Fortaleza
          </span>
        </div>
      </div>
    </section>
  );
};
