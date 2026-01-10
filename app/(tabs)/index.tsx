import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const cardBg = colorScheme === 'dark' ? '#2a2a2a' : '#ffffff';
  const accentColor = '#0a7ea4';
  const isCandidate = user?.role === 'candidate';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      
      {/* Header Section */}
      <ThemedView style={[styles.header, { backgroundColor: accentColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.title}>HireSight</ThemedText>
            <ThemedText style={styles.subtitle}>
              {isCandidate ? 'Your Career Journey Starts Here' : 'Find the Perfect Candidate'}
            </ThemedText>
          </View>
          <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <ThemedText style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Welcome Card */}
      <ThemedView style={[styles.welcomeCard, { backgroundColor: cardBg, borderColor }]}>
        <ThemedText style={[styles.welcomeTitle, { color: textColor }]}>
          Welcome back, {user?.name || 'User'}! 👋
        </ThemedText>
        <View style={[styles.roleBadge, { backgroundColor: accentColor + '20' }]}>
          <ThemedText style={[styles.roleText, { color: accentColor }]}>
            {isCandidate ? '👤 Candidate' : '🧑‍💼 Recruiter'}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          Quick Actions
        </ThemedText>
        
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: cardBg, borderColor }]}
          onPress={() => router.push('/(tabs)/dashboard')}
          activeOpacity={0.7}>
          <View style={[styles.actionIcon, { backgroundColor: accentColor + '20' }]}>
            <ThemedText style={styles.actionIconText}>📄</ThemedText>
          </View>
          <View style={styles.actionContent}>
            <ThemedText style={[styles.actionTitle, { color: textColor }]}>
              {isCandidate ? 'Manage My Resumes' : 'Resume Management'}
            </ThemedText>
            <ThemedText style={[styles.actionDescription, { color: borderColor }]}>
              {isCandidate 
                ? 'Upload, view, and manage your resumes' 
                : 'Upload and analyze candidate resumes'}
            </ThemedText>
          </View>
          <ThemedText style={[styles.actionArrow, { color: accentColor }]}>→</ThemedText>
        </TouchableOpacity>

        {!isCandidate && (
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: cardBg, borderColor }]}
            onPress={() => router.push('/(tabs)/explore')}
            activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: accentColor + '20' }]}>
              <ThemedText style={styles.actionIconText}>🔍</ThemedText>
            </View>
            <View style={styles.actionContent}>
              <ThemedText style={[styles.actionTitle, { color: textColor }]}>
                Browse Candidates
              </ThemedText>
              <ThemedText style={[styles.actionDescription, { color: borderColor }]}>
                Search and filter through candidate profiles
              </ThemedText>
            </View>
            <ThemedText style={[styles.actionArrow, { color: accentColor }]}>→</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Features Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          {isCandidate ? 'Your Features' : 'Dashboard Features'}
        </ThemedText>
        
        <View style={styles.featuresGrid}>
          {isCandidate ? (
            <>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📤</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Upload Resume
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  PDF/DOCX support
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📋</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Resume History
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  View all uploads
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>🔍</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Auto Parsing
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Skills extraction
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>👤</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Profile
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Manage account
                </ThemedText>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📁</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Bulk Upload
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Multiple resumes
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📊</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Analysis
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Resume insights
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>🔍</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Search
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Find candidates
                </ThemedText>
              </View>
              <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                <ThemedText style={[styles.featureIcon, { color: accentColor }]}>⚙️</ThemedText>
                <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                  Management
                </ThemedText>
                <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                  Organize resumes
                </ThemedText>
              </View>
            </>
          )}
        </View>
      </ThemedView>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { borderColor }]} 
        onPress={handleLogout}
        activeOpacity={0.7}>
        <ThemedText style={[styles.logoutText, { color: '#dc143c' }]}>Logout</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeCard: {
    margin: 20,
    marginTop: -15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
  },
  actionArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    textAlign: 'center',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
