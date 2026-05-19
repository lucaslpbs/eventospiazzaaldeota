ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;
UPDATE public.testimonials SET approved = true WHERE approved = false;

CREATE POLICY "Public can submit testimonials"
ON public.testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (approved = false);