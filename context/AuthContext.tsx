import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/lib/supabaseClient';

export type UserRole = 'candidate' | 'recruiter';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@hiresight:auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
      }

      if (session?.user) {
        const { id, email } = session.user;

        // Fetch profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        const mappedUser: User = {
          id,
          email: email || '',
          name: profile?.name || session.user.user_metadata?.name || '',
          role: (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'candidate',
        };
        setUser(mappedUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
      } else {
        // No active session, clear any stored user
        await AsyncStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.user) {
      throw new Error(error?.message || 'Invalid email or password');
    }

    const { id } = data.session.user;
    
    // Fetch profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    const mappedUser: User = {
      id,
      email,
      name: profile?.name || data.session.user.user_metadata?.name || '',
      role: (profile?.role as UserRole) || (data.session.user.user_metadata?.role as UserRole) || 'candidate',
    };

    setUser(mappedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Registration failed');
    }

    const mappedUser: User = {
      id: data.user.id,
      email,
      name,
      role,
    };

    setUser(mappedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
  };

  const logout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


