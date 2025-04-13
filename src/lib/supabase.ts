import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure we have the required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || '', 
  supabaseKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
    },
    global: {
      headers: {
        'apikey': supabaseKey || '',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  }
);

// Add security headers to all requests
supabase.rest.headers = {
  ...supabase.rest.headers,
  'apikey': supabaseKey || '',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Add connection status monitoring
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  isOnline = true;
  console.log('Connection restored. Reconnecting to Supabase...');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Connection lost. Some features may be unavailable.');
});

// Export connection status for components to use
export const getConnectionStatus = () => isOnline;