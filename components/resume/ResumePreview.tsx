import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Resume } from '@/services/resumeService';
import { useAuth } from '@/context/AuthContext';

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const sectionBg = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';
  const accentColor = '#0a7ea4';
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  const parsedData = resume.parsed_data;

  const handleViewResumeFile = async () => {
    if (!resume.file_url) {
      Alert.alert('Error', 'Resume file URL not available');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(resume.file_url);
      if (canOpen) {
        await Linking.openURL(resume.file_url);
      } else {
        Alert.alert('Error', 'Cannot open resume file. Please download it manually.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open resume file');
      console.error('Error opening resume:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>Resume Preview</ThemedText>
        <ThemedText style={[styles.fileName, { color: borderColor }]}>{resume.file_name}</ThemedText>
        {isRecruiter && resume.candidate_name && (
          <ThemedText style={[styles.candidateInfo, { color: accentColor }]}>
            👤 Candidate: {resume.candidate_name}
            {resume.candidate_email && ` (${resume.candidate_email})`}
          </ThemedText>
        )}
        {resume.file_url && (
          <TouchableOpacity
            style={[styles.viewFileButton, { backgroundColor: accentColor }]}
            onPress={handleViewResumeFile}>
            <ThemedText style={styles.viewFileButtonText}>📄 View Original Resume File</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {parsedData ? (
        <>
          {parsedData.summary && (
            <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Summary</ThemedText>
              <ThemedText style={[styles.sectionContent, { color: textColor }]}>
                {parsedData.summary}
              </ThemedText>
            </ThemedView>
          )}

          {parsedData.skills && parsedData.skills.length > 0 && (
            <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Skills</ThemedText>
              <View style={styles.skillsContainer}>
                {parsedData.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillTag, { borderColor }]}>
                    <ThemedText style={[styles.skillText, { color: textColor }]}>{skill}</ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>
          )}

          {parsedData.experience && parsedData.experience.length > 0 && (
            <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Experience</ThemedText>
              {parsedData.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <ThemedText style={[styles.experienceTitle, { color: textColor }]}>
                    {exp.title} at {exp.company}
                  </ThemedText>
                  <ThemedText style={[styles.experienceDuration, { color: borderColor }]}>
                    {exp.duration}
                  </ThemedText>
                  {exp.description && (
                    <ThemedText style={[styles.experienceDescription, { color: textColor }]}>
                      {exp.description}
                    </ThemedText>
                  )}
                </View>
              ))}
            </ThemedView>
          )}

          {parsedData.education && parsedData.education.length > 0 && (
            <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Education</ThemedText>
              {parsedData.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
                  <ThemedText style={[styles.educationDegree, { color: textColor }]}>
                    {edu.degree}
                  </ThemedText>
                  <ThemedText style={[styles.educationInstitution, { color: borderColor }]}>
                    {edu.institution} • {edu.year}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          )}
        </>
      ) : (
        <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
          <ThemedText style={[styles.emptyText, { color: borderColor }]}>
            Resume parsing in progress. Content will appear here once parsing is complete.
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fileName: {
    fontSize: 14,
    marginBottom: 8,
  },
  candidateInfo: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 12,
  },
  viewFileButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewFileButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    fontSize: 13,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceDuration: {
    fontSize: 12,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  educationItem: {
    marginBottom: 12,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationInstitution: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});



