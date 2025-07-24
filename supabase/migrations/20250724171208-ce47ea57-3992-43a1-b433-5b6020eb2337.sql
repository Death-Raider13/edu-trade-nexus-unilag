
-- Add missing fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Add booking status tracking
ALTER TABLE public.service_bookings ADD COLUMN IF NOT EXISTS session_notes text;
ALTER TABLE public.service_bookings ADD COLUMN IF NOT EXISTS completion_notes text;

-- Add marketplace item views tracking
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS contact_phone text;

-- Create function to update item views
CREATE OR REPLACE FUNCTION public.increment_item_views()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.marketplace_items 
  SET views = views + 1,
      updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$function$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON public.marketplace_items(category);
