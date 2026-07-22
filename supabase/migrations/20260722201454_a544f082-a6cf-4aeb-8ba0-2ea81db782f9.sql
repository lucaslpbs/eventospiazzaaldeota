UPDATE public.site_content
SET value = jsonb_set(value, '{coffee,ouro}', '95'::jsonb)
WHERE key = 'prices';