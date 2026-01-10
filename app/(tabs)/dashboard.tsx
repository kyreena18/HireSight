import { ProfileManager } from '@/components/profile/ProfileManager';
import { ResumeAnalysis } from '@/components/resume/ResumeAnalysis';
import { ResumeList } from '@/components/resume/ResumeList';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Resume } from '@/services/resumeService';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'analysis'>('preview');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const cardBg = colorScheme === 'dark' ? '#2a2a2a' : '#ffffff';
  const accentColor = '#0a7ea4';

  const isRecruiter = user?.role === 'recruiter';

  const handleResumeSelect = (resume: Resume) => {
    setSelectedResume(resume);
    setViewMode('preview');
    setShowModal(true);
  };

  const handleUploadSuccess = () => {
    // Refresh will be handled by ResumeList component
  };

  const handleProfileUpdate = () => {
    // Profile update will refresh user context
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ThemedView style={[styles.header, { backgroundColor: accentColor }]}>
          <View style={styles.headerContent}>
            <View>
              <ThemedText style={styles.welcomeText}>
                {isRecruiter ? '🧑‍💼 Recruiter Dashboard' : '👤 Candidate Dashboard'}
              </ThemedText>
              <ThemedText style={styles.userName}>{user?.name || 'User'}</ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={() => setShowProfileModal(true)}>
              <ThemedText style={styles.profileButtonText}>⚙️</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Features Overview */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            {isRecruiter ? 'Recruiter Features' : 'Candidate Features'}
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuresScroll}>
            {isRecruiter ? (
              <>
                <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                  <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📁</ThemedText>
                  <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                    Bulk Upload
                  </ThemedText>
                  <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                    Upload multiple resumes at once
                  </ThemedText>
                </View>
                <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                  <ThemedText style={[styles.featureIcon, { color: accentColor }]}>📊</ThemedText>
                  <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                    Resume Analysis
                  </ThemedText>
                  <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                    Automatic parsing & insights
                  </ThemedText>
                </View>
                <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                  <ThemedText style={[styles.featureIcon, { color: accentColor }]}>🔍</ThemedText>
                  <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                    Search & Filter
                  </ThemedText>
                  <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                    Find candidates quickly
                  </ThemedText>
                </View>
                <View style={[styles.featureCard, { backgroundColor: cardBg, borderColor }]}>
                  <ThemedText style={[styles.featureIcon, { color: accentColor }]}>⚙️</ThemedText>
                  <ThemedText style={[styles.featureTitle, { color: textColor }]}>
                    Management
                  </ThemedText>
                  <ThemedText style={[styles.featureDesc, { color: borderColor }]}>
                    Organize all resumes
                  </ThemedText>
                </View>
              </>
            ) : (
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
                    Skills & experience extraction
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
            )}
          </ScrollView>
        </ThemedView>

        {/* Upload Section */}
        <ThemedView style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              {isRecruiter ? '📁 Bulk Resume Upload' : '📄 Upload Resume'}
            </ThemedText>
            <View style={[styles.badge, { backgroundColor: accentColor + '20' }]}>
              <ThemedText style={[styles.badgeText, { color: accentColor }]}>
                {isRecruiter ? 'Multiple Files' : 'Single File'}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionDescription, { color: borderColor }]}>
            {isRecruiter
              ? 'Upload multiple resumes at once. Supported formats: PDF, DOCX (Max 10MB each)'
              : 'Upload your resume. Supported formats: PDF, DOCX (Max 10MB)'}
          </ThemedText>
          <ResumeUpload multiple={isRecruiter} onUploadSuccess={handleUploadSuccess} />
        </ThemedView>

        {/* Resume List Section */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              {isRecruiter ? '📊 All Resumes' : '📋 My Resumes'}
            </ThemedText>
          </View>
          <ThemedText style={[styles.sectionDescription, { color: borderColor }]}>
            {isRecruiter
              ? 'View and manage all candidate resumes'
              : 'View your uploaded resume history'}
          </ThemedText>
          <ResumeList onResumeSelect={handleResumeSelect} showAll={isRecruiter} />
        </ThemedView>
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}>
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={[styles.modalTitle, { color: textColor }]}>
              {selectedResume?.file_name}
            </ThemedText>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <ThemedText style={[styles.closeButton, { color: '#0a7ea4' }]}>Close</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.modalTabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                viewMode === 'preview' && styles.activeTab,
                { borderBottomColor: viewMode === 'preview' ? '#0a7ea4' : 'transparent' },
              ]}
              onPress={() => setViewMode('preview')}>
              <ThemedText
                style={[
                  styles.tabText,
                  { color: viewMode === 'preview' ? '#0a7ea4' : borderColor },
                ]}>
                Preview
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                viewMode === 'analysis' && styles.activeTab,
                { borderBottomColor: viewMode === 'analysis' ? '#0a7ea4' : 'transparent' },
              ]}
              onPress={() => setViewMode('analysis')}>
              <ThemedText
                style={[
                  styles.tabText,
                  { color: viewMode === 'analysis' ? '#0a7ea4' : borderColor },
                ]}>
                Analysis
              </ThemedText>
            </TouchableOpacity>
          </View>

          {selectedResume && (
            <View style={styles.modalContent}>
              {viewMode === 'preview' ? (
                <ResumePreview resume={selectedResume} />
              ) : (
                <ResumeAnalysis resume={selectedResume} />
              )}
            </View>
          )}
        </ThemedView>
      </Modal>

      {/* Profile Management Modal */}
      <ProfileManager
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUpdate={handleProfileUpdate}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 20,
  },
  section: {
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  featuresScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featureCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
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
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
});




