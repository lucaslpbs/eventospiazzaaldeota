
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site content (key/value JSON store for hero, contact, prices, etc.)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins write site content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Gallery images
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins write gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  stars INTEGER NOT NULL DEFAULT 5,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins write testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('piazza-media', 'piazza-media', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public read piazza-media" ON storage.objects FOR SELECT USING (bucket_id = 'piazza-media');
CREATE POLICY "Admins upload piazza-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'piazza-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update piazza-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'piazza-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete piazza-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'piazza-media' AND public.has_role(auth.uid(), 'admin'));

-- Seed defaults
INSERT INTO public.site_content (key, value) VALUES
  ('hero', '{"video_url":"https://www.w3schools.com/html/mov_bbb.mp4","headline":"Onde cada detalhe transforma o seu evento.","subtext":"Auditório · Rooftop · Coffee Break Premium — Aldeota, Fortaleza"}'::jsonb),
  ('contact', '{"phone":"(85) 98980-1309","whatsapp":"5585989801309","instagram":"piazzaaldeota","address":"Aldeota, Fortaleza – CE"}'::jsonb),
  ('prices', '{"essencial":{"25":194.90,"50":175.00,"100":129.90},"premium":{"25":209.90,"50":185.90,"100":149.90},"signature":{"25":219.90,"50":199.90,"100":149.90},"avulsos":{"aud_roof":5800,"auditorio":2799,"rooftop":2900},"coffee":{"bronze":70,"prata":85,"ouro":90}}'::jsonb),
  ('spaces', '{"auditorio":[],"rooftop":[]}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.testimonials (name, company, stars, quote, avatar_url, position) VALUES
  ('Mariana Lopes', 'Lopes Eventos', 5, 'Espaço impecável, atendimento de outro nível. Nosso evento foi inesquecível!', 'https://picsum.photos/200?random=21', 1),
  ('Ricardo Mendes', 'RM Consultoria', 5, 'O coffee break premium impressionou todos os convidados. Voltaremos sempre.', 'https://picsum.photos/200?random=22', 2),
  ('Beatriz Castro', 'Castro & Co.', 5, 'O rooftop ao pôr do sol é mágico. Recomendo de olhos fechados.', 'https://picsum.photos/200?random=23', 3);

INSERT INTO public.gallery_images (url, position) VALUES
  ('https://picsum.photos/800/600?random=1', 1),
  ('https://picsum.photos/800/1000?random=2', 2),
  ('https://picsum.photos/800/700?random=3', 3),
  ('https://picsum.photos/800/900?random=4', 4),
  ('https://picsum.photos/800/600?random=5', 5),
  ('https://picsum.photos/800/800?random=6', 6),
  ('https://picsum.photos/800/700?random=7', 7),
  ('https://picsum.photos/800/950?random=8', 8);
