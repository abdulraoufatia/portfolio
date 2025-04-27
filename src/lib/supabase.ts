import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Ensure we have the required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

// Create Supabase client with retries and timeout
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token',
    },
    global: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    db: {
      schema: 'public'
    },
    // Add retries for better resilience
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Add connection status monitoring with retry mechanism
let isOnline = navigator.onLine;
let retryTimeout: number | null = null;

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function checkConnection(retryCount = 0) {
  try {
    const { error } = await supabase.from('experiences').select('count');
    if (!error) {
      isOnline = true;
      console.log('Connected to Supabase successfully');
      return true;
    }
    throw error;
  } catch (err) {
    console.warn(`Connection check failed (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err);
    
    if (retryCount < MAX_RETRIES) {
      if (retryTimeout) clearTimeout(retryTimeout);
      retryTimeout = window.setTimeout(() => checkConnection(retryCount + 1), RETRY_DELAY);
    } else {
      console.error('Failed to connect to Supabase after maximum retries');
      isOnline = false;
    }
    return false;
  }
}

window.addEventListener('online', () => {
  isOnline = true;
  console.log('Network connection restored. Checking Supabase connection...');
  checkConnection();
});

window.addEventListener('offline', () => {
  isOnline = false;
  if (retryTimeout) clearTimeout(retryTimeout);
  console.log('Network connection lost. Some features may be unavailable.');
});

// Initial connection check
checkConnection();

// Export connection status and check function for components to use
export const getConnectionStatus = () => isOnline;
export const verifyConnection = () => checkConnection();