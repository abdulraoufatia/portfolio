import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: typeof auth.signIn;
  signUp: typeof auth.signUp;
  signOut: typeof auth.signOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session check
    auth.getCurrentUser()
      .then(user => {
        setUser(user);
      })
      .catch(error => {
        console.error('Session check failed:', error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn: auth.signIn, 
      signUp: auth.signUp, 
      signOut: auth.signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}