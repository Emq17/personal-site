export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.SUPABASE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SUPABASE_ANON_KEY;
  return { url, serviceKey };
}

export function hasSupabaseConfig() {
  const { url, serviceKey } = getSupabaseConfig();
  return Boolean(url && serviceKey);
}

export function supabaseHeaders() {
  const { serviceKey } = getSupabaseConfig();
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}
