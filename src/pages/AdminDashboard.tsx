import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Film, Image as ImageIcon, Images, DollarSign, Phone, MessageSquare, LogOut, Plus, Trash2, Video, Users } from "lucide-react";
import {
  DEFAULT_HERO, DEFAULT_PRICES, DEFAULT_CONTACT, DEFAULT_SPACES, DEFAULT_AVULSOS, DEFAULT_CAPACITIES,
  type HeroContent, type Prices, type ContactContent, type SpacesContent, type AvulsosContent, type CapacitiesContent,
} from "@/lib/site-content";

type Section = "hero" | "spaces" | "gallery" | "prices" | "contact" | "testimonials" | "avulsos" | "capacities";

const NAV: { id: Section; label: string; Icon: any }[] = [
  { id: "hero", label: "Hero", Icon: Film },
  { id: "spaces", label: "Imagens dos Espaços", Icon: ImageIcon },
  { id: "gallery", label: "Galeria", Icon: Images },
  { id: "prices", label: "Preços", Icon: DollarSign },
  { id: "capacities", label: "Capacidades", Icon: Users },
  { id: "avulsos", label: "Vídeos Avulsos", Icon: Video },
  { id: "contact", label: "Contato", Icon: Phone },
  { id: "testimonials", label: "Depoimentos", Icon: MessageSquare },
];

const input = "w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-2.5 focus:border-accent outline-none text-cream";
const card = "glass-dark rounded-2xl p-6";

const AdminDashboard = () => {
  const nav = useNavigate();
  const [section, setSection] = useState<Section>("hero");
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { nav("/admin"); return; }
      setUser(data.session.user);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
      setIsAdmin((roles ?? []).some((r: any) => r.role === "admin"));
    });
  }, [nav]);

  const logout = async () => { await supabase.auth.signOut(); nav("/admin"); };

  if (!user) return <div className="min-h-screen bg-charcoal" />;

  return (
    <div className="min-h-screen bg-charcoal text-cream flex flex-col md:flex-row">
      <aside className="md:w-72 bg-primary/40 border-r border-accent/20 p-6 flex md:flex-col">
        <div className="hidden md:block mb-8"><Logo className="h-12" /></div>
        <nav className="flex md:flex-col gap-1 flex-1 overflow-x-auto">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                section === n.id ? "bg-accent text-charcoal" : "hover:bg-cream/5"
              }`}>
              <n.Icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-4 flex items-center gap-2 text-cream/70 hover:text-accent text-sm px-4 py-2">
          <LogOut size={16} /> Sair
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-12 max-w-5xl">
        {isAdmin === false && (
          <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
            ⚠ Sua conta ainda não tem permissão de admin. Entre em contato com um admin existente para liberar acesso.
            <div className="mt-2 text-xs text-cream/70">Seu user id: <code className="text-accent">{user.id}</code></div>
          </div>
        )}
        {section === "hero" && <HeroEditor />}
        {section === "spaces" && <SpacesEditor />}
        {section === "gallery" && <GalleryEditor />}
        {section === "prices" && <PricesEditor />}
        {section === "avulsos" && <AvulsosEditor />}
        {section === "capacities" && <CapacitiesEditor />}
        {section === "contact" && <ContactEditor />}
        {section === "testimonials" && <TestimonialsEditor />}
      </main>
    </div>
  );
};

const useContent = <T,>(key: string, fb: T) => {
  const [v, setV] = useState<T>(fb);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", key).maybeSingle().then(({ data }) => {
      if (data?.value) setV({ ...fb, ...(data.value as object) } as T);
    });
  }, [key]);
  const save = async (next: T) => {
    setV(next);
    const { error } = await supabase.from("site_content").upsert({ key, value: next as any });
    if (error) toast.error(error.message); else toast.success("Salvo!");
  };
  return [v, setV, save] as const;
};

const HeroEditor = () => {
  const [v, setV, save] = useContent<HeroContent>("hero", DEFAULT_HERO);
  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Hero</h2>
      <div className="gold-line w-24 mb-8" />
      <div className={`${card} space-y-4`}>
        <Field label="URL do vídeo de fundo">
          <input className={input} value={v.video_url} onChange={(e) => setV({ ...v, video_url: e.target.value })} />
        </Field>
        <Field label="Título principal">
          <input className={input} value={v.headline} onChange={(e) => setV({ ...v, headline: e.target.value })} />
        </Field>
        <Field label="Subtexto">
          <input className={input} value={v.subtext} onChange={(e) => setV({ ...v, subtext: e.target.value })} />
        </Field>
        <button className="btn-gold" onClick={() => save(v)}>Salvar</button>
      </div>
    </div>
  );
};

const uploadFile = async (file: File): Promise<string | null> => {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("piazza-media").upload(path, file);
  if (error) { toast.error(error.message); return null; }
  return supabase.storage.from("piazza-media").getPublicUrl(path).data.publicUrl;
};

const SpacesEditor = () => {
  const [v, setV, save] = useContent<SpacesContent>("spaces", DEFAULT_SPACES);
  const handleUpload = async (which: "auditorio" | "rooftop", files: FileList | null) => {
    if (!files) return;
    const urls = (await Promise.all(Array.from(files).slice(0, 6).map(uploadFile))).filter(Boolean) as string[];
    save({ ...v, [which]: [...(v[which] || []), ...urls].slice(0, 6) });
  };
  const remove = (which: "auditorio" | "rooftop", url: string) =>
    save({ ...v, [which]: v[which].filter((u) => u !== url) });

  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Imagens dos Espaços</h2>
      <div className="gold-line w-24 mb-8" />
      {(["auditorio", "rooftop"] as const).map((k) => (
        <div key={k} className={`${card} mb-6`}>
          <h3 className="font-display text-2xl mb-3 capitalize">{k}</h3>
          <input type="file" multiple accept="image/*" onChange={(e) => handleUpload(k, e.target.files)} className="text-sm mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(v[k] || []).map((u) => (
              <div key={u} className="relative group">
                <img src={u} alt="" className="w-full h-32 object-cover rounded-xl" />
                <button onClick={() => remove(k, u)} className="absolute top-1 right-1 p-1.5 rounded-full bg-charcoal/80 text-destructive opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const GalleryEditor = () => {
  const [items, setItems] = useState<{ id: string; url: string; position: number }[]>([]);
  const load = () => supabase.from("gallery_images").select("*").order("position").then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      const url = await uploadFile(f);
      if (url) await supabase.from("gallery_images").insert({ url, position: items.length });
    }
    toast.success("Imagens adicionadas");
    load();
  };
  const del = async (id: string) => {
    await supabase.from("gallery_images").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Galeria</h2>
      <div className="gold-line w-24 mb-8" />
      <div className={card}>
        <label className="btn-gold inline-flex cursor-pointer mb-6">
          <Plus size={16} /> Adicionar imagens
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => add(e.target.files)} />
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it) => (
            <div key={it.id} className="relative group">
              <img src={it.url} alt="" className="w-full h-36 object-cover rounded-xl" />
              <button onClick={() => del(it.id)} className="absolute top-1 right-1 p-1.5 rounded-full bg-charcoal/80 text-destructive opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricesEditor = () => {
  const [v, setV, save] = useContent<Prices>("prices", DEFAULT_PRICES);
  const upd = (path: string[], val: number) => {
    const next: any = JSON.parse(JSON.stringify(v));
    let o = next; for (let i = 0; i < path.length - 1; i++) o = o[path[i]];
    o[path[path.length - 1]] = val;
    setV(next);
  };
  const Tier = ({ title, obj, base }: any) => (
    <div className="mb-4">
      <div className="text-sm text-accent mb-2 uppercase tracking-widest">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        {Object.keys(obj).map((k) => (
          <div key={k}>
            <div className="text-xs text-cream/60 mb-1">{k}</div>
            <input type="number" step="0.01" className={input} value={obj[k]} onChange={(e) => upd([...base, k], parseFloat(e.target.value) || 0)} />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Preços</h2>
      <div className="gold-line w-24 mb-8" />
      <div className={`${card} space-y-4`}>
        <Tier title="Plano Essencial" obj={v.essencial} base={["essencial"]} />
        <Tier title="Plano Premium" obj={v.premium} base={["premium"]} />
        <Tier title="Plano Signature" obj={v.signature} base={["signature"]} />
        <Tier title="Espaços avulsos" obj={v.avulsos} base={["avulsos"]} />
        <Tier title="Coffee Break" obj={v.coffee} base={["coffee"]} />
        <button className="btn-gold" onClick={() => save(v)}>Salvar</button>
      </div>
    </div>
  );
};

const ContactEditor = () => {
  const [v, setV, save] = useContent<ContactContent>("contact", DEFAULT_CONTACT);
  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Contato</h2>
      <div className="gold-line w-24 mb-8" />
      <div className={`${card} space-y-4`}>
        <Field label="Telefone exibido"><input className={input} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
        <Field label="WhatsApp (somente dígitos)"><input className={input} value={v.whatsapp} onChange={(e) => setV({ ...v, whatsapp: e.target.value })} /></Field>
        <Field label="Instagram (handle)"><input className={input} value={v.instagram} onChange={(e) => setV({ ...v, instagram: e.target.value })} /></Field>
        <Field label="Endereço"><input className={input} value={v.address} onChange={(e) => setV({ ...v, address: e.target.value })} /></Field>
        <button className="btn-gold" onClick={() => save(v)}>Salvar</button>
      </div>
    </div>
  );
};

const TestimonialsEditor = () => {
  const [items, setItems] = useState<any[]>([]);
  const load = () => supabase.from("testimonials").select("*").order("position").then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    await supabase.from("testimonials").insert({ name: "Novo cliente", quote: "...", stars: 5, position: items.length });
    load();
  };
  const upd = async (id: string, patch: any) => { await supabase.from("testimonials").update(patch).eq("id", id); load(); };
  const del = async (id: string) => { await supabase.from("testimonials").delete().eq("id", id); load(); };

  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Depoimentos</h2>
      <div className="gold-line w-24 mb-8" />
      <button onClick={add} className="btn-gold mb-6"><Plus size={16}/> Adicionar</button>
      <div className="space-y-4">
        {items.map((t) => (
          <div key={t.id} className={`${card} grid md:grid-cols-2 gap-3`}>
            <input className={input} value={t.name || ""} onChange={(e) => upd(t.id, { name: e.target.value })} placeholder="Nome" />
            <input className={input} value={t.company || ""} onChange={(e) => upd(t.id, { company: e.target.value })} placeholder="Empresa" />
            <input className={input} type="number" min="1" max="5" value={t.stars} onChange={(e) => upd(t.id, { stars: parseInt(e.target.value) })} placeholder="Estrelas" />
            <input className={input} value={t.avatar_url || ""} onChange={(e) => upd(t.id, { avatar_url: e.target.value })} placeholder="Avatar URL" />
            <textarea className={`${input} md:col-span-2`} rows={2} value={t.quote} onChange={(e) => upd(t.id, { quote: e.target.value })} placeholder="Depoimento" />
            <button onClick={() => del(t.id)} className="text-destructive text-sm flex items-center gap-1 self-start"><Trash2 size={14}/> Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const isYtUrl = (url: string) => url.includes("youtube") || url.includes("youtu.be");

const AvulsosEditor = () => {
  const [v, setV, save] = useContent<AvulsosContent>("avulsos_videos", DEFAULT_AVULSOS);
  const [uploading, setUploading] = useState<Partial<Record<keyof AvulsosContent, boolean>>>({});

  const labels: Record<keyof AvulsosContent, string> = {
    aud_roof: "Auditório + Rooftop",
    auditorio: "Auditório",
    rooftop: "Rooftop",
  };

  const handleUpload = async (k: keyof AvulsosContent, file: File) => {
    setUploading((prev) => ({ ...prev, [k]: true }));
    const ext = file.name.split(".").pop();
    const path = `avulsos/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("piazza-media").upload(path, file);
    setUploading((prev) => ({ ...prev, [k]: false }));
    if (error) { toast.error(error.message); return; }
    const url = supabase.storage.from("piazza-media").getPublicUrl(path).data.publicUrl;
    save({ ...v, [k]: url });
  };

  const clear = (k: keyof AvulsosContent) => save({ ...v, [k]: "" });

  return (
    <div>
      <h2 className="font-display text-4xl mb-2">Vídeos — Espaços Avulsos</h2>
      <div className="gold-line w-24 mb-8" />
      <div className="space-y-6">
        {(Object.keys(labels) as (keyof AvulsosContent)[]).map((k) => {
          const cur = v[k] || "";
          const ytActive = isYtUrl(cur);
          const mp4Active = !!cur && !ytActive;
          return (
            <div key={k} className={card}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl">{labels[k]}</h3>
                {cur && (
                  <button onClick={() => clear(k)} className="text-xs text-destructive flex items-center gap-1 hover:opacity-80">
                    <Trash2 size={12} /> Remover vídeo
                  </button>
                )}
              </div>

              <Field label="URL do YouTube">
                <input
                  className={`${input} ${mp4Active ? "opacity-40 cursor-not-allowed" : ""}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={ytActive ? cur : ""}
                  disabled={mp4Active}
                  onChange={(e) => setV({ ...v, [k]: e.target.value })}
                />
              </Field>

              {ytActive && (
                <button className="btn-gold mt-3" onClick={() => save(v)}>Salvar URL</button>
              )}

              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 border-t border-accent/20" />
                <span className="text-xs text-cream/50 uppercase tracking-widest">ou</span>
                <div className="flex-1 border-t border-accent/20" />
              </div>

              <Field label="Enviar vídeo MP4">
                <div className={ytActive ? "opacity-40 pointer-events-none" : ""}>
                  {mp4Active && (
                    <p className="text-xs text-accent mb-3">✓ Vídeo MP4 salvo no servidor</p>
                  )}
                  <label className={`btn-gold inline-flex cursor-pointer ${uploading[k] ? "opacity-60 pointer-events-none" : ""}`}>
                    <Plus size={16} />
                    {uploading[k] ? "Enviando..." : mp4Active ? "Trocar vídeo MP4" : "Escolher arquivo MP4"}
                    <input
                      type="file"
                      accept="video/mp4,video/*"
                      className="hidden"
                      disabled={ytActive || !!uploading[k]}
                      onChange={(e) => { if (e.target.files?.[0]) handleUpload(k, e.target.files[0]); e.target.value = ""; }}
                    />
                  </label>
                </div>
              </Field>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Field = ({ label, children }: any) => (
  <label className="block">
    <div className="text-xs uppercase tracking-widest text-cream/70 mb-2">{label}</div>
    {children}
  </label>
);

export default AdminDashboard;
