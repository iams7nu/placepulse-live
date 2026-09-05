import { supabase } from "@/integrations/supabase/client";

export type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  description: string;
  status: string;
  activity_level: string;
  recent_signal_count: number;
  last_signal_at: string | null;
  verified: boolean;
  latitude: number;
  longitude: number;
};

export type CommunityReport = {
  id: string;
  place_id: string;
  report_type: string;
  note: string;
  source_label: string;
  created_at: string;
};

export const fallbackPlaces: Place[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "Juniper & Co.", category: "Cafe", address: "14 Mercer Street", neighborhood: "Downtown", description: "Bright neighborhood coffee, breakfast, and a quiet back room for working.", status: "likely_open", activity_level: "moderate", recent_signal_count: 8, last_signal_at: new Date(Date.now() - 120000).toISOString(), verified: true, latitude: 40.7128, longitude: -74.006 },
  { id: "22222222-2222-4222-8222-222222222222", name: "Northline Pharmacy", category: "Pharmacy", address: "82 Orchard Avenue", neighborhood: "Lower East Side", description: "Community pharmacy with late pickup and a small wellness counter.", status: "likely_open", activity_level: "low", recent_signal_count: 4, last_signal_at: new Date(Date.now() - 480000).toISOString(), verified: true, latitude: 40.7181, longitude: -73.9973 },
  { id: "33333333-3333-4333-8333-333333333333", name: "Atlas Works", category: "Company", address: "300 Hudson Boulevard", neighborhood: "West Village", description: "Independent product studio and shared workspace.", status: "uncertain", activity_level: "low", recent_signal_count: 2, last_signal_at: new Date(Date.now() - 1440000).toISOString(), verified: false, latitude: 40.7295, longitude: -74.0089 },
  { id: "44444444-4444-4444-8444-444444444444", name: "Marlow Market", category: "Grocery", address: "201 Grand Street", neighborhood: "Chinatown", description: "Local market with fresh produce, pantry staples, and prepared meals.", status: "likely_open", activity_level: "high", recent_signal_count: 12, last_signal_at: new Date(Date.now() - 240000).toISOString(), verified: false, latitude: 40.7136, longitude: -73.9969 },
  { id: "55555555-5555-4555-8555-555555555555", name: "Civic Hall", category: "Community", address: "5 Assembly Plaza", neighborhood: "Civic Center", description: "Public events, community meetings, and neighborhood services.", status: "temporarily_closed", activity_level: "low", recent_signal_count: 1, last_signal_at: new Date(Date.now() - 7200000).toISOString(), verified: true, latitude: 40.7134, longitude: -74.0025 },
];

export const reportTypes = [
  { value: "open", label: "Open now" },
  { value: "busy", label: "Busy" },
  { value: "not_busy", label: "Not busy" },
  { value: "queue", label: "Long queue" },
  { value: "temporarily_closed", label: "Temporarily closed" },
];

export function statusLabel(status: string) {
  return { likely_open: "Likely open", likely_closed: "Likely closed", uncertain: "Uncertain", temporarily_closed: "Temporarily closed" }[status] ?? "No recent data";
}

export function statusTone(status: string) {
  if (status === "likely_open") return "live";
  if (status === "temporarily_closed" || status === "likely_closed") return "closed";
  return "uncertain";
}

export function relativeTime(value: string | null) {
  if (!value) return "No recent signal";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.round(minutes / 60)} hr ago`;
}

export async function loadPlaces() {
  const { data, error } = await supabase.from("places").select("*").order("last_signal_at", { ascending: false }).limit(20);
  if (error || !data?.length) return fallbackPlaces;
  return data as Place[];
}

export async function loadPlace(id: string) {
  const { data, error } = await supabase.from("places").select("*").eq("id", id).maybeSingle();
  if (error || !data) {
    const fallback = fallbackPlaces.find((place) => place.id === id) ?? fallbackPlaces.at(0);
    if (fallback) return fallback;
    throw new Error("No places available");
  }
  return data as Place;
}

export async function loadReports(placeId: string) {
  const { data } = await supabase.from("community_reports").select("id, place_id, report_type, note, source_label, created_at").eq("place_id", placeId).order("created_at", { ascending: false }).limit(12);
  return (data ?? []) as CommunityReport[];
}