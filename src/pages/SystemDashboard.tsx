import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Plus, Download, LogOut, Search, ArrowRight } from "lucide-react";
import { ALL_BRIEFING_FIELDS, CHECKLIST_BLOCKS, checklistProgress, computeStatus } from "@/lib/system-fields";

const brand = "#0F3D2E";
const bg = "#F5EFE4";
const surface = "#FFFCF6";
const border = "#E4D9C4";

const statusColor: Record<string, string> = {
  "Briefing pendente": "#B8903F",
  Confirmado: "#0F3D2E",
  Realizado: "#6B7280",
};

const SystemDashboard = () => {
  const nav = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<Record<string, any>>({});
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav("/sistema/login"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", sess.session.user.id);
      if (!(roles ?? []).some((r: any) => r.role === "admin")) { toast.error("Acesso restrito"); await supabase.auth.signOut(); nav("/sistema/login"); return; }
      const [{ data: ev }, { data: cl }] = await Promise.all([
        supabase.from("events").select("*").order("data", { ascending: false }),
        supabase.from("event_checklist").select("*"),
      ]);
      setEvents(ev ?? []);
      const map: Record<string, any> = {};
      (cl ?? []).forEach((r: any) => (map[r.event_id] = r));
      setChecklists(map);
      setReady(true);
    })();
  }, [nav]);

  const logout = async () => { await supabase.auth.signOut(); nav("/sistema/login"); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.nome_evento, e.empresa, e.contato, e.data].filter(Boolean).some((v: string) => String(v).toLowerCase().includes(q))
    );
  }, [events, query]);

  const exportCsv = () => {
    const cols = ALL_BRIEFING_FIELDS.map((f) => f.name);
    const headers = [...cols, "auditorio_progresso", "rooftop_progresso", "status"];
    const escape = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return /[",\n;]/.test(s) ? `"${s}"` : s;
    };
    const rows = events.map((e) => {
      const cl = checklists[e.id];
      const aud = groupProgress(cl?.items ?? {}, "auditorio");
      const roo = groupProgress(cl?.items ?? {}, "rooftop");
      const base = cols.map((c) => escape((e as any)[c]));
      return [...base, `${aud.done}/${aud.total}`, `${roo.done}/${roo.total}`, computeStatus(e)].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-piazza-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) return <div className="min-h-screen" style={{ background: bg }} />;

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      <header className="sticky top-0 z-10" style={{ background: brand }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-10 rounded-xl bg-white/10 p-1" />
            <div className="text-white">
              <div className="font-display text-xl leading-none">Sistema de Eventos</div>
              <div className="text-xs opacity-70">Piazza Aldeota</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCsv} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10">
              <Download size={16} /> Exportar Leads
            </button>
            <Link to="/sistema/clientes/novo" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#C9A060", color: brand }}>
              <Plus size={16} /> Novo
            </Link>
            <button onClick={logout} title="Sair" className="p-2 rounded-full text-white hover:bg-white/10"><LogOut size={16} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por evento, cliente, contato ou data..."
              className="w-full pl-10 pr-4 py-3 rounded-full outline-none border"
              style={{ background: surface, borderColor: border }} />
          </div>
          <button onClick={exportCsv} className="sm:hidden inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-medium text-white" style={{ background: brand }}>
            <Download size={16} /> Exportar Leads
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
            <p className="text-neutral-600 mb-4">Nenhum cliente cadastrado ainda.</p>
            <Link to="/sistema/clientes/novo" className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white" style={{ background: brand }}>
              <Plus size={16} /> Cadastrar primeiro cliente
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((e) => {
              const st = computeStatus(e);
              return (
                <Link key={e.id} to={`/sistema/clientes/${e.id}`}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1.2fr_auto] gap-3 md:gap-6 items-center px-5 py-4 rounded-2xl hover:shadow-md transition-all"
                  style={{ background: surface, border: `1px solid ${border}` }}>
                  <div>
                    <div className="font-display text-lg" style={{ color: brand }}>{e.nome_evento}</div>
                    <div className="text-xs text-neutral-500">{e.tipo_evento || "—"}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-neutral-800">{e.empresa || "—"}</div>
                    <div className="text-xs text-neutral-500">{e.contato}</div>
                  </div>
                  <div className="text-sm">{e.data ? new Date(e.data).toLocaleDateString("pt-BR") : "—"}</div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: statusColor[st] }}>{st}</span>
                  </div>
                  <div className="justify-self-end inline-flex items-center gap-1 text-sm font-medium" style={{ color: brand }}>
                    Abrir <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SystemDashboard;
