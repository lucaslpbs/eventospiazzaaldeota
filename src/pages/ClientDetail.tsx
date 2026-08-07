import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, Check } from "lucide-react";
import {
  BRIEFING_SECTIONS,
  FOOTER_FIELDS,
  ALL_BRIEFING_FIELDS,
  CHECKLIST_BLOCKS,
  BriefingField,
  checklistProgress,
  groupProgress,
} from "@/lib/system-fields";


const brand = "#0F3D2E";
const brandSoft = "#155F45";
const bg = "#F5EFE4";
const surface = "#FFFCF6";
const border = "#E4D9C4";

type Tab = "briefing" | "checklist";

const emptyEvent = (): any => {
  const o: any = {};
  ALL_BRIEFING_FIELDS.forEach((f) => (o[f.name] = f.type === "boolean" ? false : ""));
  return o;
};

const InputField = ({ f, value, onChange }: { f: BriefingField; value: any; onChange: (v: any) => void }) => {
  const cls = "w-full rounded-xl px-4 py-2.5 outline-none border text-sm";
  const style = { background: "#F7F0E1", borderColor: "#D9CBB0" };
  if (f.type === "textarea")
    return <textarea rows={3} className={cls} style={style} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  if (f.type === "boolean")
    return (
      <div className="flex gap-2">
        {[["Sim", true], ["Não", false]].map(([label, v]) => (
          <button key={String(label)} type="button" onClick={() => onChange(v)}
            className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{
              background: value === v ? brand : "#F7F0E1",
              color: value === v ? "#fff" : "#333",
              borderColor: value === v ? brand : "#D9CBB0",
            }}>{label as string}</button>
        ))}
      </div>
    );
  if (f.type === "select")
    return (
      <select className={cls} style={style} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  return (
    <input
      type={f.type === "number" ? "number" : f.type}
      className={cls} style={style}
      value={value ?? ""}
      onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
    />
  );
};

const ClientDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id || id === "novo";
  const [tab, setTab] = useState<Tab>("briefing");
  const [event, setEvent] = useState<any>(emptyEvent());
  const [briefingDone, setBriefingDone] = useState<Record<string, boolean>>({});
  const [checklistItems, setChecklistItems] = useState<any>({ auditorio: {}, rooftop: {} });
  const [checklistResp, setChecklistResp] = useState("");
  const [ready, setReady] = useState(isNew);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav("/sistema/login"); return; }
      if (isNew) return;
      const { data: ev } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (!ev) { toast.error("Evento não encontrado"); nav("/sistema"); return; }
      setEvent(ev);
      const { data: cl } = await supabase.from("event_checklist").select("*").eq("event_id", id).maybeSingle();
      if (cl) {
        setBriefingDone((cl.briefing_done as any) ?? {});
        setChecklistItems((cl.items as any) ?? { auditorio: {}, rooftop: {} });
        setChecklistResp(cl.responsavel ?? "");
      }
      setReady(true);
    })();
  }, [id, isNew, nav]);

  const setField = (name: string, v: any) => setEvent((e: any) => ({ ...e, [name]: v }));

  const validate = () => {
    if (!event.nome_evento) return "Nome do evento é obrigatório";
    if (!event.contato) return "Contato do cliente é obrigatório";
    if (!event.data) return "Data é obrigatória";
    return null;
  };

  const persistEvent = async (): Promise<string | null> => {
    const err = validate();
    if (err) { toast.error(err); return null; }
    // strip empty strings for numeric/date/time optional fields
    const payload: any = { ...event };
    ALL_BRIEFING_FIELDS.forEach((f) => {
      if ((f.type === "date" || f.type === "time" || f.type === "number") && payload[f.name] === "") payload[f.name] = null;
    });
    if (isNew) {
      const { data, error } = await supabase.from("events").insert(payload).select("id").single();
      if (error) { toast.error(error.message); return null; }
      await supabase.from("event_checklist").insert({ event_id: data.id, items: { auditorio: {}, rooftop: {} }, briefing_done: {} });
      return data.id;
    }
    const { error } = await supabase.from("events").update(payload).eq("id", id);
    if (error) { toast.error(error.message); return null; }
    return id!;
  };

  const persistChecklist = async (eventId: string) => {
    await supabase.from("event_checklist").upsert({
      event_id: eventId,
      responsavel: checklistResp,
      items: checklistItems,
      briefing_done: briefingDone,
    }, { onConflict: "event_id" });
  };

  const saveNow = async () => {
    const eid = await persistEvent();
    if (!eid) return;
    await persistChecklist(eid);
    setSavedAt(new Date());
    toast.success("Salvo");
    if (isNew) nav(`/sistema/clientes/${eid}`, { replace: true });
  };

  // Autosave (only for existing records)
  useEffect(() => {
    if (isNew || !ready) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (validate()) return;
      const payload: any = { ...event };
      ALL_BRIEFING_FIELDS.forEach((f) => {
        if ((f.type === "date" || f.type === "time" || f.type === "number") && payload[f.name] === "") payload[f.name] = null;
      });
      await supabase.from("events").update(payload).eq("id", id);
      await persistChecklist(id!);
      setSavedAt(new Date());
    }, 900);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, briefingDone, checklistItems, checklistResp]);

  const del = async () => {
    if (isNew) return;
    if (!confirm("Excluir este evento?")) return;
    await supabase.from("events").delete().eq("id", id);
    nav("/sistema");
  };

  const audProg = useMemo(() => groupProgress(checklistItems, "auditorio"), [checklistItems]);
  const rooProg = useMemo(() => groupProgress(checklistItems, "rooftop"), [checklistItems]);


  if (!ready) return <div className="min-h-screen" style={{ background: bg }} />;

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <header className="sticky top-0 z-10" style={{ background: brand }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => nav("/sistema")} className="p-2 rounded-full text-white hover:bg-white/10"><ArrowLeft size={18} /></button>
            <Logo className="h-10 rounded-xl bg-white/10 p-1 hidden sm:block" />
            <div className="text-white min-w-0">
              <div className="font-display text-lg truncate">{event.nome_evento || "Novo cliente / evento"}</div>
              <div className="text-xs opacity-70 truncate">{event.empresa || "Piazza Aldeota"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedAt && <span className="hidden md:inline text-xs text-white/70">Salvo {savedAt.toLocaleTimeString("pt-BR")}</span>}
            {!isNew && (
              <button onClick={del} title="Excluir" className="p-2 rounded-full text-white hover:bg-red-500/40"><Trash2 size={16} /></button>
            )}
            <button onClick={saveNow} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#C9A060", color: brand }}>
              <Save size={16} /> Salvar
            </button>
          </div>
        </div>
        {!isNew && (
          <div className="max-w-6xl mx-auto px-4 flex gap-1">
            {(["briefing", "checklist"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2.5 text-sm font-medium rounded-t-lg capitalize transition-all"
                style={{ background: tab === t ? bg : "transparent", color: tab === t ? brand : "#fff" }}>
                {t === "briefing" ? "Briefing" : "Checklist"}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {(isNew || tab === "briefing") && (
          <>
            {BRIEFING_SECTIONS.map((sec) => (
              <section key={sec.id} className="rounded-2xl overflow-hidden" style={{ background: surface, border: `1px solid ${border}` }}>
                <div className="px-5 py-3 text-white flex items-center justify-between" style={{ background: brand }}>
                  <h2 className="font-display text-lg">{sec.id}. {sec.title}</h2>
                  <span className="text-xs opacity-70 hidden sm:inline">Marque à direita ao concluir</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.fields.map((f) => (
                    <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-neutral-800">
                          {f.label}{f.required && <span className="text-red-600"> *</span>}
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
                          <input type="checkbox" checked={!!briefingDone[f.name]}
                            onChange={(e) => setBriefingDone({ ...briefingDone, [f.name]: e.target.checked })} />
                          Tarefa realizada
                        </label>
                      </div>
                      <InputField f={f} value={event[f.name]} onChange={(v) => setField(f.name, v)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl overflow-hidden" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="px-5 py-3 text-white" style={{ background: brandSoft }}>
                <h2 className="font-display text-lg">Responsável</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {FOOTER_FIELDS.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-neutral-800 mb-1.5">{f.label}</label>
                    <InputField f={f} value={event[f.name]} onChange={(v) => setField(f.name, v)} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {!isNew && tab === "checklist" && (
          <>
            <section className="rounded-2xl p-5" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs uppercase text-neutral-500 mb-1">Evento</div>
                  <div className="font-medium">{event.nome_evento}</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-neutral-500 mb-1">Dia</div>
                  <div className="font-medium">{event.data ? new Date(event.data).toLocaleDateString("pt-BR") : "—"}</div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-neutral-500 mb-1">Pessoa responsável</label>
                  <input value={checklistResp} onChange={(e) => setChecklistResp(e.target.value)}
                    className="w-full rounded-xl px-4 py-2 outline-none border text-sm"
                    style={{ background: "#F7F0E1", borderColor: "#D9CBB0" }} />
                </div>
              </div>
            </section>

            {CHECKLIST_BLOCKS.map((block) => {
              const prog = block.id === "auditorio" ? audProg : rooProg;
              return (
                <section key={block.id} className="rounded-2xl overflow-hidden" style={{ background: surface, border: `1px solid ${border}` }}>
                  <div className="px-5 py-3 text-white flex items-center justify-between" style={{ background: brand }}>
                    <h2 className="font-display text-lg uppercase tracking-wider">{block.title}</h2>
                    <span className="text-xs bg-white/15 rounded-full px-3 py-1">{prog.done}/{prog.total}</span>
                  </div>
                  <ul className="divide-y" style={{ borderColor: border }}>
                    {block.items.map((it) => {
                      const val = checklistItems?.[block.id]?.[it.key];
                      const whoVal = checklistItems?.[block.id]?.[`${it.key}_quem`] ?? "";
                      const toggle = () => setChecklistItems((c: any) => ({
                        ...c,
                        [block.id]: { ...c[block.id], [it.key]: !c?.[block.id]?.[it.key] },
                      }));
                      const setWho = (v: string) => setChecklistItems((c: any) => ({
                        ...c,
                        [block.id]: { ...c[block.id], [`${it.key}_quem`]: v },
                      }));
                      return (
                        <li key={it.key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 hover:bg-black/[0.02]">
                          <button onClick={toggle}
                            className="flex items-center gap-3 flex-1 text-left">
                            <span className="w-6 h-6 rounded-md flex items-center justify-center border-2 flex-shrink-0"
                              style={{ background: val ? brand : "#fff", borderColor: val ? brand : "#B8A883" }}>
                              {val && <Check size={16} className="text-white" />}
                            </span>
                            <span className={`text-sm ${val ? "line-through text-neutral-400" : "text-neutral-800"}`}>{it.label}</span>
                          </button>
                          {it.withWho && (
                            <input value={whoVal} onChange={(e) => setWho(e.target.value)} placeholder="Quem?"
                              className="sm:w-56 rounded-lg px-3 py-2 text-sm outline-none border"
                              style={{ background: "#F7F0E1", borderColor: "#D9CBB0" }} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
};

export default ClientDetail;
