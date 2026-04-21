/* ── Supabase Configuration ──
   Replace the placeholder values below with your Supabase project credentials.
   Find them at: Supabase Dashboard → Project Settings → API
*/
const SUPABASE_URL = 'https://xbbxejzfcmfexdgbrjam.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Zofexrfe_hiFif7LwnDPnQ_F7uktCa_';

const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
