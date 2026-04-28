import { createClient } from '@supabase/supabase-js';

// Client 1: User authentication and user data
const supabaseUserUrl = import.meta.env.VITE_SUPABASE_USER_URL;
const supabaseUserKey = import.meta.env.VITE_SUPABASE_USER_ANON_KEY;

// Client 2: Scraper data (F1 standings, races, driver info, etc.)
const supabaseScraperUrl = import.meta.env.VITE_SUPABASE_SCRAPER_URL;
// Use service role key first (bypasses RLS), fall back to anon key
const supabaseScraperKey = import.meta.env.VITE_SUPABASE_SCRAPER_SERVICE_KEY || import.meta.env.VITE_SUPABASE_SCRAPER_ANON_KEY;

console.log('Using key type:', import.meta.env.VITE_SUPABASE_SCRAPER_SERVICE_KEY ? 'SERVICE_ROLE' : 'ANON');

// Initialize both Supabase clients
export const supabaseUser = createClient(supabaseUserUrl, supabaseUserKey);
export const supabaseScraper = createClient(supabaseScraperUrl, supabaseScraperKey);

// For convenience, also export a function to get the scraper data
export const getScraperData = () => supabaseScraper;
export const getUserData = () => supabaseUser;
