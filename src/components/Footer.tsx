import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, MessageCircle } from "lucide-react";

export const Footer = () => (
  <footer className="bg-charcoal text-cream py-16">
    <div className="container text-center">
      <div className="flex justify-center mb-6">
        <Logo className="h-14" />
      </div>
      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm uppercase tracking-[0.18em] text-cream/80 mb-8">
        <a href="#espacos" className="hover:text-accent transition-colors">Espaços</a>
        <a href="#planos" className="hover:text-accent transition-colors">Planos</a>
        <a href="#coffee" className="hover:text-accent transition-colors">Coffee Break</a>
        <a href="#galeria" className="hover:text-accent transition-colors">Galeria</a>
        <a href="#contato" className="hover:text-accent transition-colors">Contato</a>
        <Link to="/admin" className="hover:text-accent transition-colors">Admin</Link>
      </nav>
      <div className="flex justify-center gap-4 mb-8">
        <a href="https://instagram.com/piazzaaldeota" target="_blank" rel="noreferrer"
           className="w-11 h-11 rounded-full border border-accent/40 inline-flex items-center justify-center hover:bg-accent hover:text-charcoal transition-colors">
          <Instagram size={18} />
        </a>
        <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer"
           className="w-11 h-11 rounded-full border border-accent/40 inline-flex items-center justify-center hover:bg-accent hover:text-charcoal transition-colors">
          <MessageCircle size={18} />
        </a>
      </div>
      <div className="gold-line max-w-md mx-auto mb-6" />
      <p className="text-cream/50 text-xs tracking-wide">© 2026 Piazza Aldeota. Todos os direitos reservados.</p>
    </div>
  </footer>
);
