UPDATE public.site_content
SET value = jsonb_set(
      jsonb_set(
        jsonb_set(value::jsonb, '{coffee,prata}', '90'::jsonb, true),
        '{coffee,ouro}', '119'::jsonb, true),
      '{coffee,manha}', '85'::jsonb, true)
WHERE key = 'prices';