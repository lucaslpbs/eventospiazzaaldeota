
CREATE TABLE public.events (
  id uuid primary key default gen_random_uuid(),
  -- Seção 1
  nome_evento text not null,
  empresa text,
  contato text not null,
  tipo_evento text,
  local_evento text,
  pacote text,
  data date not null,
  horario_inicio time,
  horario_termino time,
  convidados_estimados integer,
  -- Seção 2
  buffet text,
  tipo_coffee text,
  horario_servico time,
  bebida_alcoolica boolean default false,
  restricoes_alimentares boolean default false,
  restricoes_obs text,
  responsavel_buffet text,
  -- Seção 3
  sonorizacao text,
  iluminacao text,
  telao text,
  microfones text,
  atracao text,
  gerador text,
  equipamentos_externos text,
  -- Seção 4
  decoracao boolean default false,
  horario_montagem time,
  estilo_decoracao text,
  painel_fotografia text,
  observacoes text,
  -- Seção 5
  credenciamento boolean default false,
  limpeza_durante boolean default false,
  valet boolean default false,
  cerimonial boolean default false,
  -- Rodapé
  responsavel text,
  data_preenchimento date default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage events" ON public.events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.event_checklist (
  event_id uuid primary key references public.events(id) on delete cascade,
  responsavel text,
  items jsonb not null default '{}'::jsonb,
  briefing_done jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_checklist TO authenticated;
GRANT ALL ON public.event_checklist TO service_role;
ALTER TABLE public.event_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage event_checklist" ON public.event_checklist
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER events_touch BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER event_checklist_touch BEFORE UPDATE ON public.event_checklist
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
