import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Rate limiting implementation
const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const isRateLimited = (email: string): boolean => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;

  if (Date.now() - attempts.timestamp > LOCKOUT_TIME) {
    loginAttempts.delete(email);
    return false;
  }

  return attempts.count >= MAX_ATTEMPTS;
};

const recordLoginAttempt = (email: string) => {
  const attempts = loginAttempts.get(email);
  if (!attempts) {
    loginAttempts.set(email, { count: 1, timestamp: Date.now() });
  } else {
    attempts.count++;
    attempts.timestamp = Date.now();
  }
};

// Input validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const auth = {
  async signIn(email: string, password: string, totpCode?: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    email = email.toLowerCase().trim();

    if (isRateLimited(email)) {
      throw new Error('Too many login attempts. Please try again in 15 minutes.');
    }

    try {
      let authResponse;

      if (totpCode) {
        authResponse = await supabase.auth.verifyOtp({
          email,
          token: totpCode,
          type: 'totp'
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authResponse.data?.user?.factors?.length > 0) {
          return { requires2FA: true, user: authResponse.data.user };
        }
      }

      const { data } = authResponse;
      loginAttempts.delete(email);
      return data;
    } catch (err) {
      recordLoginAttempt(email);
      throw err;
    }
  },

  async signOut() {
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
    }
  },

  async getCurrentUser() {
    try {
      const session = localStorage.getItem('supabase.auth.token');
      if (!session) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error('Get current user error:', err);
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      return null;
    }
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};