import { create } from 'zustand';
import { db, User } from '../db';
import { authService } from '../config/supabase';

interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isOnline: boolean;
  loading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  lockScreen: () => void;
  unlockScreen: (pin: string) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  updateOnlineStatus: (isOnline: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isOnline: true,
  loading: true,
  
  login: async (email, password) => {
    set({ loading: true });
    
    try {
      // First, try to authenticate with Supabase
      const data = await authService.signIn(email, password);
      const supabaseUser = data.user;
      const session = data.session;
      
      // Check if user exists in our local database
      let localUser = await db.users.get(supabaseUser.id);
      
      if (!localUser) {
        // Create user in local database if doesn't exist
        localUser = {
          id: supabaseUser.id,
          supabaseId: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email || '',
          role: 'kasir', // Default role, can be updated later
          pin: '', // Will be set separately
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        };
        
        await db.users.add(localUser);
      }
      
      // Update session in local database
      await db.settings.put({
        id: 'current_session',
        key: 'current_session',
        value: session,
        updatedBy: localUser.id,
        updatedAt: new Date(),
      });
      
      set({
        user: localUser,
        session,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.message || 'Login failed');
    }
 },
  
  logout: async () => {
    set({ loading: true });
    
    try {
      // Sign out from Supabase
      await authService.signOut();
      
      // Clear local session
      await db.settings.delete('current_session');
      
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false });
      throw new Error(error.message || 'Logout failed');
    }
 },
  
  checkSession: async () => {
    try {
      // Try to get session from local database first
      const sessionSetting = await db.settings.get('current_session');
      
      if (sessionSetting) {
        const session = sessionSetting.value;
        
        // Verify session with Supabase
        const supabaseSession = await authService.getSession();
        
        if (!supabaseSession) {
          // Session invalid, clear it
          await db.settings.delete('current_session');
          set({ isAuthenticated: false, user: null, session: null });
          return;
        }
        
        // Get user from local database
        const user = await db.users.get(supabaseSession.user.id);
        
        if (user) {
          set({
            user,
            session: supabaseSession,
            isAuthenticated: true,
          });
        } else {
          // User doesn't exist locally, might need to sync
          set({ isAuthenticated: false, user: null, session: null });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      set({ isAuthenticated: false, user: null, session: null });
    }
  },
  
  lockScreen: () => {
    // For now, just set a flag. Actual lock screen implementation would be in UI
    set({ isAuthenticated: false });
  },
  
  unlockScreen: async (pin) => {
    const { user } = get();
    if (!user) return false;

    // TODO: Implement proper PIN verification with hashing
    // For now, we'll just return true for demonstration
    return true;
  },
  
  initializeAuth: async () => {
    // Check for existing session on app start
    await get().checkSession();
    set({ loading: false });
  },
  
 updateOnlineStatus: (isOnline) => {
    set({ isOnline });
  },
}));