import 'react-native-url-polyfill/auto';
// Import from the module build; Metro will handle this as ESM
import { createClient, type SupabaseClient } from '@supabase/supabase-js/dist/module/index.js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

let supabaseClient: SupabaseClient | null = null;

// Create a simple in-memory storage adapter for server-side
const memoryStorage: { [key: string]: string } = {};
const memoryStorageAdapter = {
  getItem: (key: string) => Promise.resolve(memoryStorage[key] || null),
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value;
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
    return Promise.resolve();
  },
};

// Lazily create the Supabase client
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    // Check if we're in a browser/native environment
    const isClient = typeof window !== 'undefined';
    
    let storage: any;
    
    if (isClient) {
      // Client-side: try to use AsyncStorage, fallback to memory if it fails
      try {
        // Dynamic require to avoid issues during SSR
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        storage = AsyncStorage;
      } catch (e) {
        // Fallback to memory storage if AsyncStorage is not available
        storage = memoryStorageAdapter;
      }
    } else {
      // Server-side: use memory storage
      storage = memoryStorageAdapter;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: storage,
        autoRefreshToken: isClient,
        persistSession: isClient,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseClient;
}

