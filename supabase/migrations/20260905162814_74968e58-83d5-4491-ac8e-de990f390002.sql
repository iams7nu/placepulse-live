CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'uncertain',
  activity_level TEXT NOT NULL DEFAULT 'low',
  recent_signal_count INTEGER NOT NULL DEFAULT 0,
  last_signal_at TIMESTAMPTZ,
  verified BOOLEAN NOT NULL DEFAULT false,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.places TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.places TO authenticated;
GRANT ALL ON public.places TO service_role;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view places" ON public.places FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can create places" ON public.places FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update places" ON public.places FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY,
  alias TEXT NOT NULL UNIQUE,
  avatar_seed TEXT NOT NULL DEFAULT 'default',
  discoverable BOOLEAN NOT NULL DEFAULT false,
  contact_mode TEXT NOT NULL DEFAULT 'requests_only',
  location_mode TEXT NOT NULL DEFAULT 'off',
  show_contributions BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  source_label TEXT NOT NULL DEFAULT 'Community-reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '6 hours')
);
GRANT SELECT ON public.community_reports TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_reports TO authenticated;
GRANT ALL ON public.community_reports TO service_role;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community reports" ON public.community_reports FOR SELECT TO anon, authenticated USING (expires_at > now());
CREATE POLICY "Signed-in users can submit reports" ON public.community_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users can remove their submitted reports" ON public.community_reports FOR DELETE TO authenticated USING (true);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL,
  blocked_alias TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_alias)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own blocks" ON public.blocks FOR ALL TO authenticated USING (auth.uid() = blocker_id) WITH CHECK (auth.uid() = blocker_id);

CREATE TABLE public.abuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL,
  subject_alias TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT, SELECT, UPDATE ON public.abuse_reports TO authenticated;
GRANT ALL ON public.abuse_reports TO service_role;
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can submit abuse reports" ON public.abuse_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their abuse reports" ON public.abuse_reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

CREATE TABLE public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.security_events TO service_role;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON public.places FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX places_name_search_idx ON public.places USING gin (to_tsvector('simple', name || ' ' || category || ' ' || neighborhood));
CREATE INDEX places_status_idx ON public.places (status, last_signal_at DESC);
CREATE INDEX community_reports_place_created_idx ON public.community_reports (place_id, created_at DESC);
CREATE INDEX community_reports_expiry_idx ON public.community_reports (expires_at);

INSERT INTO public.places (id, name, category, address, neighborhood, description, status, activity_level, recent_signal_count, last_signal_at, verified, latitude, longitude) VALUES
('11111111-1111-4111-8111-111111111111', 'Juniper & Co.', 'Cafe', '14 Mercer Street', 'Downtown', 'Bright neighborhood coffee, breakfast, and a quiet back room for working.', 'likely_open', 'moderate', 8, now() - interval '2 minutes', true, 40.712800, -74.006000),
('22222222-2222-4222-8222-222222222222', 'Northline Pharmacy', 'Pharmacy', '82 Orchard Avenue', 'Lower East Side', 'Community pharmacy with late pickup and a small wellness counter.', 'likely_open', 'low', 4, now() - interval '8 minutes', true, 40.718100, -73.997300),
('33333333-3333-4333-8333-333333333333', 'Atlas Works', 'Company', '300 Hudson Boulevard', 'West Village', 'Independent product studio and shared workspace.', 'uncertain', 'low', 2, now() - interval '24 minutes', false, 40.729500, -74.008900),
('44444444-4444-4444-8444-444444444444', 'Marlow Market', 'Grocery', '201 Grand Street', 'Chinatown', 'Local market with fresh produce, pantry staples, and prepared meals.', 'likely_open', 'high', 12, now() - interval '4 minutes', false, 40.713600, -73.996900),
('55555555-5555-4555-8555-555555555555', 'Civic Hall', 'Community', '5 Assembly Plaza', 'Civic Center', 'Public events, community meetings, and neighborhood services.', 'temporarily_closed', 'low', 1, now() - interval '2 hours', true, 40.713400, -74.002500);

INSERT INTO public.community_reports (place_id, report_type, note, created_at) VALUES
('11111111-1111-4111-8111-111111111111', 'open', 'Doors are open and the back room has seats.', now() - interval '2 minutes'),
('11111111-1111-4111-8111-111111111111', 'busy', 'A short line at the espresso bar.', now() - interval '7 minutes'),
('22222222-2222-4222-8222-222222222222', 'open', 'Pickup counter is moving quickly.', now() - interval '8 minutes'),
('44444444-4444-4444-8444-444444444444', 'busy', 'Busy near the prepared food counter.', now() - interval '4 minutes'),
('55555555-5555-4555-8555-555555555555', 'temporarily_closed', 'Sign says closed for a private event.', now() - interval '2 hours');