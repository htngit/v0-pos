import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are not set. Authentication will not work.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create a separate client instance for auth management
export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
 // Sign up with email and password
  signUp: async (email: string, password: string, options?: { data: Record<string, any> }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: options || { data: {} },
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },
  
  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  },
  
  // Get user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return data.user;
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw error;
    }
  },
  
 // Update user
  updateUser: async (attributes: { data?: Record<string, any>, password?: string, email?: string }) => {
    const { data, error } = await supabase.auth.updateUser(attributes);
    
    if (error) {
      throw error;
    }
    
    return data.user;
  },
  
  // Listen to auth state changes
  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }
};