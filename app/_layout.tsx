/*
PROJECT CONTEXT FOR CURSOR:

This is a React Native (Expo Router) application named "HIRESIGHT"
for a recruitment and placement system.

Core modules to be implemented:
1. User Management & Authentication
   - Candidate and Recruiter roles
   - Signup, login, logout
   - Role-based navigation
   - Profile management
   - Session handling

2. Resume Upload, Bulk Upload & Storage
   - Single resume upload (PDF/DOCX)
   - Bulk resume upload (multi-select or ZIP)
   - File validation
   - Resume listing and deletion
   - Resume metadata storage linked to users

Architecture expectations:
- Use Expo Router for navigation
- Use Context API for auth/session state
- Keep logic modular and scalable
- Minimal UI, focus on functionality
- Create proper folders for auth, resumes, services, and context

Cursor should generate clean, production-ready code
that fits Expo Router conventions.
*/

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect based on role after authentication
      if (user?.role === 'candidate' || user?.role === 'recruiter') {
        router.replace('/(tabs)/dashboard');
      }
    } else if (isAuthenticated && inTabsGroup) {
      // User is authenticated and accessing tabs - allow access
      // Role-based navigation can be handled within tabs if needed
    }
  }, [isAuthenticated, isLoading, segments, user, router]);

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="register" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
