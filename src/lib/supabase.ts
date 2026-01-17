
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Only warn in development to avoid spamming production logs if handled elsewhere, 
    // but critical for setup.
    console.warn('Supabase URL or Key is missing. Check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
