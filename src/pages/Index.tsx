import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { Spaces } from "@/components/sections/Spaces";
import { Plans } from "@/components/sections/Plans";
import { Avulsos } from "@/components/sections/Avulsos";
import { Coffee } from "@/components/sections/Coffee";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Piazza Aldeota — Espaço de Eventos Premium em Fortaleza";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", "Auditório, Rooftop e Coffee Break Premium na Aldeota, Fortaleza. Onde cada detalhe transforma o seu evento.");
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Spaces />
        <Plans />
        <Avulsos />
        <Coffee />
        <Gallery />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
