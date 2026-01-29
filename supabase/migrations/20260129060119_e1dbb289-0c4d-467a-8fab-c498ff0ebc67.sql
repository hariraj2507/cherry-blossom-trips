-- Create workspaces table for digital nomad directory
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  wifi_speed_mbps INTEGER,
  wifi_quality TEXT CHECK (wifi_quality IN ('excellent', 'good', 'moderate', 'poor')),
  has_power_outlets BOOLEAN DEFAULT true,
  power_outlet_count TEXT CHECK (power_outlet_count IN ('many', 'some', 'few', 'none')),
  noise_level TEXT CHECK (noise_level IN ('silent', 'quiet', 'moderate', 'noisy')),
  has_quiet_zones BOOLEAN DEFAULT false,
  hours_open TEXT,
  hours_close TEXT,
  open_24_hours BOOLEAN DEFAULT false,
  amenities TEXT[] DEFAULT '{}',
  average_rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workspace reviews table
CREATE TABLE public.workspace_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  wifi_rating INTEGER CHECK (wifi_rating >= 1 AND wifi_rating <= 5),
  noise_rating INTEGER CHECK (noise_rating >= 1 AND noise_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  total_budget DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  ai_recommendations JSONB,
  budget_feasibility TEXT CHECK (budget_feasibility IN ('feasible', 'too_low', 'too_high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip expenses table
CREATE TABLE public.trip_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'food', 'activities', 'transport', 'miscellaneous')),
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user favorites table
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_workspace_favorite UNIQUE (user_id, workspace_id),
  CONSTRAINT unique_trip_favorite UNIQUE (user_id, trip_id)
);

-- Create workspace suggestions table (for user submissions)
CREATE TABLE public.workspace_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT,
  description TEXT,
  wifi_speed_estimate TEXT,
  has_power_outlets BOOLEAN,
  noise_level_estimate TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_suggestions ENABLE ROW LEVEL SECURITY;

-- Workspaces are publicly readable
CREATE POLICY "Anyone can view workspaces" ON public.workspaces
  FOR SELECT USING (true);

-- Workspace reviews - public read, authenticated write own
CREATE POLICY "Anyone can view reviews" ON public.workspace_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.workspace_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.workspace_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.workspace_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Trips - user can only access their own
CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Trip expenses - access through trip ownership
CREATE POLICY "Users can view own trip expenses" ON public.trip_expenses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
  );

CREATE POLICY "Users can create expenses for own trips" ON public.trip_expenses
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
  );

CREATE POLICY "Users can update own trip expenses" ON public.trip_expenses
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own trip expenses" ON public.trip_expenses
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_expenses.trip_id AND trips.user_id = auth.uid())
  );

-- User favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Workspace suggestions - anyone can suggest, own can view
CREATE POLICY "Anyone can suggest workspaces" ON public.workspace_suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own suggestions" ON public.workspace_suggestions
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

-- Insert seed data for workspaces
INSERT INTO public.workspaces (name, description, city, country, region, wifi_speed_mbps, wifi_quality, has_power_outlets, power_outlet_count, noise_level, has_quiet_zones, hours_open, hours_close, amenities, average_rating, review_count) VALUES
('The Hive Coworking', 'Modern coworking space with stunning city views and reliable high-speed internet', 'Chennai', 'India', 'Tamil Nadu', 150, 'excellent', true, 'many', 'quiet', true, '08:00', '22:00', ARRAY['coffee', 'meeting_rooms', 'printer', 'locker'], 4.5, 42),
('Startup Cafe', 'Vibrant cafe popular with freelancers and entrepreneurs', 'Coimbatore', 'India', 'Tamil Nadu', 80, 'good', true, 'some', 'moderate', false, '07:00', '21:00', ARRAY['coffee', 'food', 'outdoor_seating'], 4.2, 28),
('WeWork Anna Salai', 'Premium coworking with all amenities and professional environment', 'Chennai', 'India', 'Tamil Nadu', 200, 'excellent', true, 'many', 'quiet', true, '00:00', '23:59', ARRAY['coffee', 'meeting_rooms', 'phone_booths', 'gym', 'events'], 4.7, 156),
('Digital Nomad Hub', 'Community-focused space designed for remote workers', 'Pondicherry', 'India', 'Tamil Nadu', 100, 'excellent', true, 'many', 'quiet', true, '09:00', '20:00', ARRAY['coffee', 'meditation_room', 'rooftop'], 4.4, 34),
('Rooftop Cafe & Work', 'Beautiful rooftop workspace with ocean breeze', 'Madurai', 'India', 'Tamil Nadu', 60, 'moderate', true, 'few', 'moderate', false, '08:00', '18:00', ARRAY['coffee', 'food', 'outdoor_seating'], 4.0, 15),
('Hubud', 'Iconic bamboo coworking space in the heart of Ubud', 'Ubud', 'Indonesia', 'Bali', 120, 'good', true, 'many', 'moderate', true, '08:00', '22:00', ARRAY['coffee', 'pool', 'garden', 'events', 'meeting_rooms'], 4.6, 324),
('Outsite Lisbon', 'Coliving and coworking with amazing community', 'Lisbon', 'Portugal', 'Lisbon District', 180, 'excellent', true, 'many', 'quiet', true, '00:00', '23:59', ARRAY['coffee', 'kitchen', 'events', 'accommodation'], 4.5, 89),
('KoHub', 'Beachside coworking on a tropical island', 'Koh Lanta', 'Thailand', 'Krabi', 100, 'good', true, 'many', 'quiet', true, '08:00', '20:00', ARRAY['coffee', 'beach_access', 'yoga', 'accommodation'], 4.7, 201),
('Selina Mexico City', 'Hip coworking in trendy Roma Norte neighborhood', 'Mexico City', 'Mexico', 'CDMX', 150, 'excellent', true, 'many', 'moderate', false, '07:00', '23:00', ARRAY['coffee', 'food', 'bar', 'accommodation', 'events'], 4.3, 178),
('Betahaus Berlin', 'Legendary startup hub in the heart of Kreuzberg', 'Berlin', 'Germany', 'Berlin', 200, 'excellent', true, 'many', 'moderate', true, '08:00', '22:00', ARRAY['coffee', 'events', 'cafe', 'hardware_lab', 'meeting_rooms'], 4.4, 412),
('WeWork Kamala Mills', 'Premium workspace in Mumbai business district', 'Mumbai', 'India', 'Maharashtra', 200, 'excellent', true, 'many', 'quiet', true, '00:00', '23:59', ARRAY['coffee', 'gym', 'meeting_rooms', 'phone_booths'], 4.6, 234),
('Cowork Cafe', 'Budget-friendly option with great atmosphere', 'Bangalore', 'India', 'Karnataka', 90, 'good', true, 'some', 'moderate', false, '08:00', '21:00', ARRAY['coffee', 'food', 'events'], 4.1, 87),
('Nomad Oasis', 'Desert-themed workspace with unique vibes', 'Jaipur', 'India', 'Rajasthan', 75, 'good', true, 'some', 'quiet', true, '09:00', '19:00', ARRAY['coffee', 'rooftop', 'meditation_room'], 4.3, 45),
('Tech Park Cafe', 'Modern cafe inside tech park with fast wifi', 'Hyderabad', 'India', 'Telangana', 180, 'excellent', true, 'many', 'quiet', false, '07:00', '22:00', ARRAY['coffee', 'food', 'parking'], 4.2, 63),
('The Working Capitol', 'Heritage building converted to stunning workspace', 'Singapore', 'Singapore', 'Central', 200, 'excellent', true, 'many', 'quiet', true, '08:00', '22:00', ARRAY['coffee', 'shower', 'events', 'meeting_rooms', 'podcast_studio'], 4.8, 289);

-- Function to update workspace ratings when reviews change
CREATE OR REPLACE FUNCTION update_workspace_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.workspaces
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(2,1), 0)
      FROM public.workspace_reviews
      WHERE workspace_id = COALESCE(NEW.workspace_id, OLD.workspace_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.workspace_reviews
      WHERE workspace_id = COALESCE(NEW.workspace_id, OLD.workspace_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.workspace_id, OLD.workspace_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_rating_on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.workspace_reviews
FOR EACH ROW
EXECUTE FUNCTION update_workspace_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_workspaces_updated_at
BEFORE UPDATE ON public.workspaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();