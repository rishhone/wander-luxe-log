-- Create places table
CREATE TABLE public.places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  date_visited DATE,
  is_visited BOOLEAN NOT NULL DEFAULT false,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own places" 
ON public.places 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own places" 
ON public.places 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own places" 
ON public.places 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own places" 
ON public.places 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_places_updated_at
BEFORE UPDATE ON public.places
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for place media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'place-media',
  'place-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
);

-- Create storage policies for place media
CREATE POLICY "Users can view all place media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'place-media');

CREATE POLICY "Users can upload their own place media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'place-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own place media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'place-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own place media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'place-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);