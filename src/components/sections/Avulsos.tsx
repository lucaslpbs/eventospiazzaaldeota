import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "../Modal";
import { Users } from "lucide-react";
import { DEFAULT_PRICES, DEFAULT_AVULSOS, DEFAULT_CAPACITIES, fmt, useSiteContent, waLink, type Prices, type AvulsosContent, type CapacitiesContent } from "@/lib/site-content";

const getYtId = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
};

const MediaCard = ({ url, img, title, className = "" }: { url: string; img: string; title: string; className?: string }) => {
  const ytId = getYtId(url);
  const isDirect = url && !ytId;
  const isFallbackVideo = !url && /\.mp4(\?|$)/i.test(img);
  if (ytId) return (
    <iframe
      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0&playlist=${ytId}`}
      className={`w-full h-full ${className}`}
      allow="autoplay; encrypted-media"
      allowFullScreen
      title={title}
    />
  );
  if (isDirect) return (
    <video src={url} autoPlay muted loop playsInline className={`w-full h-full object-cover ${className}`} />
  );
  if (isFallbackVideo) return (
    <video src={img} autoPlay muted loop playsInline className={`w-full h-full object-cover ${className}`} />
  );
  return <img src={img} alt={title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${className}`} />;
};

const MediaModal = ({ url, img, title }: { url: string; img: string; title: string }) => {
  const ytId = getYtId(url);
  const isDirect = url && !ytId;
  const isFallbackVideo = !url && /\.mp4(\?|$)/i.test(img);
  if (ytId) return (
    <div className="w-full h-72 bg-charcoal">
      <iframe src={`https://www.youtube.com/embed/${ytId}?controls=1`} className="w-full h-full" allowFullScreen title={title} />
    </div>
  );
  if (isDirect) return <video src={url} controls className="w-full h-72 object-cover" />;
  if (isFallbackVideo) return <video src={img} controls className="w-full h-72 object-cover" />;
  return <img src={img} alt="" className="w-full h-72 object-cover" />;
};

export const Avulsos = () => {
  const [open, setOpen] = useState<null | string>(null);
  const [prices] = useSiteContent<Prices>("prices", DEFAULT_PRICES);
  const [videos] = useSiteContent<AvulsosContent>("avulsos_videos", DEFAULT_AVULSOS);
  const [caps] = useSiteContent<CapacitiesContent>("capacities", DEFAULT_CAPACITIES);

  const items = [
    { id: "aud_roof", title: "Auditório + Rooftop", capacity: `${caps.aud_roof} pessoas`, price: prices.avulsos.aud_roof,
      img: "https://oowncafdgqroyqfamzpr.supabase.co/storage/v1/object/public/piazza-media/avulsos/c860cec1-6d55-4bdb-bcc0-1d3b13df1fc4.mp4",
      desc: "Combo completo dos dois espaços para eventos que pedem amplitude e versatilidade.", code: "Produto 02" },
    { id: "auditorio", title: "Auditório", capacity: `${caps.auditorio} pessoas`, price: prices.avulsos.auditorio,
      img: "https://oowncafdgqroyqfamzpr.supabase.co/storage/v1/object/public/piazza-media/avulsos/5f97ea37-04b0-4840-a874-3b8acfa50abf.mp4",
      desc: "Auditório climatizado, ideal para palestras, treinamentos e apresentações.", code: "Produto 03" },
    { id: "rooftop", title: "Rooftop", capacity: `${caps.rooftop} pessoas`, price: prices.avulsos.rooftop,
      img: "https://oowncafdgqroyqfamzpr.supabase.co/storage/v1/object/public/piazza-media/avulsos/949d505c-7492-486b-ac68-0f9664cf22fe.mp4",
      desc: "Rooftop com vista panorâmica para coquetéis, jantares e celebrações ao ar livre.", code: "Produto 04" },
  ];

  return (
    <section className="relative py-28 bg-primary text-cream clip-diagonal-t -mt-2">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="font-serif-soft italic text-accent tracking-widest text-sm uppercase">— Espaços avulsos —</div>
          <h2 className="font-display text-5xl md:text-6xl mt-3">Reserve apenas o que você precisa</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <motion.div key={it.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-dark rounded-3xl overflow-hidden grid md:grid-cols-[280px_1fr] hover:border-accent/60 transition-all"
            >
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <MediaCard url={videos[it.id as keyof AvulsosContent] || ""} img={it.img} title={it.title} />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="text-accent text-xs uppercase tracking-[0.25em] font-serif-soft italic">{it.code}</div>
                <h3 className="font-display text-3xl mt-1">{it.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-cream/80 text-sm">
                  <span className="inline-flex items-center gap-1.5"><Users size={14}/> até {it.capacity}</span>
                  <span className="font-display text-2xl text-accent">{fmt(it.price)}</span>
                </div>
                <button onClick={() => setOpen(it.id)} className="self-start mt-4 text-accent text-sm font-medium tracking-wider hover:text-accent-deep">
                  Ver detalhes →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {items.map(it => (
        <Modal key={it.id} open={open === it.id} onClose={() => setOpen(null)}>
          <div>
            <MediaModal url={videos[it.id as keyof AvulsosContent] || ""} img={it.img} title={it.title} />
            <div className="p-8 md:p-10">
              <div className="font-serif-soft italic text-accent uppercase tracking-[0.3em] text-xs">{it.code}</div>
              <h3 className="font-display text-4xl mt-2">{it.title}</h3>
              <div className="gold-line w-24 my-4" />
              <p className="font-serif-soft text-lg opacity-85 mb-4">{it.desc}</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/40 border border-accent/30 text-sm">até {it.capacity}</span>
                <span className="px-4 py-1.5 rounded-full bg-accent text-charcoal text-sm font-semibold">{fmt(it.price)}</span>
              </div>
              <p className="text-xs opacity-60 italic mb-6">Pacotes anuais, semestrais e trimestrais com condições especiais — consulte.</p>
              <a href={waLink(`Olá! Tenho interesse no espaço avulso *${it.title}* (${fmt(it.price)} — até ${it.capacity}). Podem me passar mais informações?`)} target="_blank" rel="noreferrer" className="btn-gold">Solicitar via WhatsApp</a>
            </div>
          </div>
        </Modal>
      ))}
    </section>
  );
};
