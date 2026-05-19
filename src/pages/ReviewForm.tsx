import { useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  company: z.string().trim().max(80).optional(),
  stars: z.number().int().min(1).max(5),
  quote: z.string().trim().min(10, "Conte um pouco mais sobre a experiência").max(600),
});

const ReviewForm = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, company: company || undefined, stars, quote });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("testimonials").insert({
      name: parsed.data.name,
      company: parsed.data.company ?? null,
      stars: parsed.data.stars,
      quote: parsed.data.quote,
      approved: false,
      position: 999,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream flex flex-col items-center justify-center p-6 leaf-bg">
      <div className="mb-8"><Logo className="h-14" /></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass-dark rounded-3xl p-8 md:p-10 border border-accent/20">
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 className="mx-auto text-accent mb-4" size={56} />
            <h1 className="font-display text-3xl mb-3">Obrigado!</h1>
            <p className="font-serif-soft text-cream/80">
              Sua avaliação foi enviada e será revisada antes de ser publicada.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="font-serif-soft italic text-accent uppercase tracking-[0.25em] text-xs">Sua opinião importa</div>
              <h1 className="font-display text-4xl mt-2">Avalie sua experiência</h1>
              <div className="gold-line w-24 mx-auto my-4" />
              <p className="text-sm text-cream/70">Conte como foi seu evento no Piazza Aldeota.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/70 mb-1.5 block">Seu nome *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
                  className="w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-2.5 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/70 mb-1.5 block">Empresa / evento (opcional)</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={80}
                  className="w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-2.5 focus:border-accent outline-none" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/70 mb-1.5 block">Nota *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n}
                      onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                      onClick={() => setStars(n)} className="p-1">
                      <Star size={32} className="text-accent transition-transform hover:scale-110"
                        fill={(hover || stars) >= n ? "currentColor" : "transparent"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/70 mb-1.5 block">Seu depoimento *</label>
                <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={5} maxLength={600}
                  placeholder="Conte como foi a experiência..."
                  className="w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-2.5 focus:border-accent outline-none resize-none" />
                <div className="text-xs text-cream/50 text-right mt-1">{quote.length}/600</div>
              </div>
              <button disabled={loading} className="btn-gold w-full disabled:opacity-60">
                {loading ? "Enviando..." : "Enviar avaliação"}
              </button>
              <p className="text-xs text-cream/50 text-center">Sua avaliação passará por uma revisão antes de ser publicada.</p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewForm;
