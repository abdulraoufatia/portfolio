import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

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

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }
  return { isValid: true, message: '' };
};

export const auth = {
  async signUp(email: string, password: string) {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }

    // Sanitize email
    email = email.toLowerCase().trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        throw error;
      }

      // Enable 2FA for the new user
      if (data.user) {
        await this.enroll2FA(data.user.id);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Sign up failed. Please try again.');
    }
  },

  async signIn(email: string, password: string, totpCode?: string) {
    // Validate email
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Sanitize email
    email = email.toLowerCase().trim();

    // Check rate limiting
    if (isRateLimited(email)) {
      throw new Error('Too many login attempts. Please try again in 15 minutes.');
    }

    try {
      let authResponse;

      if (totpCode) {
        // Sign in with 2FA
        authResponse = await supabase.auth.verifyOtp({
          email,
          token: totpCode,
          type: 'totp'
        });
      } else {
        // Initial sign in
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If 2FA is required, return special status
        if (authResponse.data?.user?.factors?.length > 0) {
          return { requires2FA: true, user: authResponse.data.user };
        }
      }

      const { data, error } = authResponse;

      if (error) {
        recordLoginAttempt(email);
        if (error.message.includes('Invalid login credentials')) {
          const attempts = loginAttempts.get(email);
          const remainingAttempts = MAX_ATTEMPTS - (attempts?.count || 0);
          throw new Error(`Invalid email or password. ${remainingAttempts} attempts remaining.`);
        }
        throw error;
      }

      // Clear login attempts on successful login
      loginAttempts.delete(email);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Sign in failed. Please try again.');
    }
  },

  async enroll2FA(userId: string) {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      return {
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    } catch (error) {
      throw new Error('Failed to enable 2FA. Please try again.');
    }
  },

  async verify2FA(totpCode: string) {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        code: totpCode
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error('Invalid 2FA code. Please try again.');
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw new Error('Sign out failed. Please try again.');
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};