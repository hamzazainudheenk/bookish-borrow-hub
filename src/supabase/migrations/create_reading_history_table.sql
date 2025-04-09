
-- This SQL will create the reading_history table when needed
-- For now, we're using mock data until this table is created

-- Create the reading_history table
CREATE TABLE IF NOT EXISTS public.reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  finish_date DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on the reading_history table
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to manage their own reading history
CREATE POLICY "Users can view their own reading history"
  ON public.reading_history
  FOR SELECT
  USING (member_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.members WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert their own reading history"
  ON public.reading_history
  FOR INSERT
  WITH CHECK (member_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.members WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update their own reading history"
  ON public.reading_history
  FOR UPDATE
  USING (member_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.members WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can delete their own reading history"
  ON public.reading_history
  FOR DELETE
  USING (member_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.members WHERE id = auth.uid() AND role = 'admin')
  );
