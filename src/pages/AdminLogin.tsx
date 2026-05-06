import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const AdminLogin = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin/dashboard");
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) throw error;
      nav("/admin/dashboard");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream flex items-center justify-center p-6 leaf-bg">
      <div className="w-full max-w-md glass-dark rounded-3xl p-10 shadow-teal">
        <div className="flex justify-center mb-6"><Logo className="h-16" /></div>
        <h1 className="font-display text-3xl text-center mb-2">Painel Admin</h1>
        <div className="gold-divider" />
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-3 focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Senha</label>
            <input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="w-full bg-charcoal/60 border border-accent/30 rounded-xl px-4 py-3 focus:border-accent outline-none" />
          </div>
          <button disabled={loading} className="btn-gold w-full">
            {loading ? "..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
