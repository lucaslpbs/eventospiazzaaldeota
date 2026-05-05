import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo, LogoIcon } from "./Logo";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#espacos", label: "Espaços" },
  { href: "#planos", label: "Planos" },
  { href: "#coffee", label: "Coffee Break" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-charcoal/80 border-b border-accent/20 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="hidden md:block">
            <Logo className="h-11" />
          </span>
          <span className="md:hidden">
            <LogoIcon className="h-10 w-10" />
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-cream/90 hover:text-accent text-sm uppercase tracking-[0.18em] font-medium transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/admin" className="text-accent/70 hover:text-accent text-xs uppercase tracking-widest">Admin</Link>
        </nav>

        <a href="https://wa.me/5585989801309" target="_blank" rel="noreferrer" className="hidden lg:inline-flex btn-gold !py-2.5 !px-5 text-sm">
          Reservar
        </a>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-cream p-2" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-charcoal/95 backdrop-blur-lg border-t border-accent/20 animate-fade-in">
          <div className="container py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream py-2 border-b border-accent/10">
                {l.label}
              </a>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="text-accent py-2">Admin</Link>
            <a href="https://wa.me/5585989801309" className="btn-gold mt-2">Falar no WhatsApp</a>
          </div>
        </div>
      )}
    </header>
  );
};
