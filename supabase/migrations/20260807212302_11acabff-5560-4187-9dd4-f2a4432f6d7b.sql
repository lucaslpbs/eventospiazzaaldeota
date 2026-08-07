ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS coffee_piazza boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS qtd_coffee integer,
  ADD COLUMN IF NOT EXISTS opcao_coffee text,
  ADD COLUMN IF NOT EXISTS data_montagem date,
  ADD COLUMN IF NOT EXISTS montagem_inicio time without time zone,
  ADD COLUMN IF NOT EXISTS montagem_termino time without time zone,
  ADD COLUMN IF NOT EXISTS data_desmontagem date,
  ADD COLUMN IF NOT EXISTS desmontagem_inicio time without time zone,
  ADD COLUMN IF NOT EXISTS desmontagem_termino time without time zone;