
-- Create reading_history table
CREATE TABLE IF NOT EXISTS "public"."reading_history" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "member_id" uuid NOT NULL REFERENCES "public"."members"("id") ON DELETE CASCADE,
    "book_id" uuid NOT NULL REFERENCES "public"."books"("id") ON DELETE CASCADE,
    "start_date" date NOT NULL DEFAULT CURRENT_DATE,
    "finish_date" date,
    "rating" smallint,
    "review" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

-- Add Row Level Security
ALTER TABLE "public"."reading_history" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Members can view their own reading history"
    ON "public"."reading_history"
    FOR SELECT
    USING (auth.uid() = member_id);

CREATE POLICY "Members can update their own reading history"
    ON "public"."reading_history"
    FOR UPDATE
    USING (auth.uid() = member_id);

CREATE POLICY "Admins can view all reading history"
    ON "public"."reading_history"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.members
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create trigger to automatically add borrowed books to reading history
CREATE OR REPLACE FUNCTION public.add_to_reading_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.reading_history (member_id, book_id)
    VALUES (NEW.member_id, NEW.book_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER add_borrowed_book_to_history
    AFTER INSERT ON public.borrowed_books
    FOR EACH ROW
    EXECUTE FUNCTION public.add_to_reading_history();
