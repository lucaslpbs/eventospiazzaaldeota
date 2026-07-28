import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const SystemLogin = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
      if ((roles ?? []).some((r: any) => r.role === "admin")) nav("/sistema");
    })();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) throw error;
      nav("/sistema");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F5EFE4" }}>
      <div className="w-full max-w-md rounded-3xl p-10 shadow-xl" style={{ background: "#FFFCF6", border: "1px solid #E4D9C4" }}>
        <div className="flex justify-center mb-6"><Logo className="h-16" /></div>
        <h1 className="font-display text-3xl text-center mb-1" style={{ color: "#0F3D2E" }}>Sistema de Eventos</h1>
        <p className="text-center text-sm mb-6 text-neutral-600">Acesso restrito à equipe</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-neutral-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none border" style={{ background: "#F7F0E1", borderColor: "#D9CBB0" }} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 text-neutral-700">Senha</label>
            <input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none border" style={{ background: "#F7F0E1", borderColor: "#D9CBB0" }} />
          </div>
          <button disabled={loading} className="w-full py-3 rounded-full font-semibold tracking-wide text-white transition-all"
            style={{ background: "#0F3D2E" }}>
            {loading ? "..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemLogin;
