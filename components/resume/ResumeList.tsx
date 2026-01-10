import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import * as Linking from 'expo-linking';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Resume, getResumes, getAllResumes, deleteResume } from '@/services/resumeService';
import { useAuth } from '@/context/AuthContext';

interface ResumeListProps {
  onResumeSelect?: (resume: Resume) => void;
  showAll?: boolean; // For recruiters to see all resumes
}

export function ResumeList({ onResumeSelect, showAll = false }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const cardBg = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';
  const accentColor = '#0a7ea4';

  const loadResumes = async () => {
    try {
      const data = showAll ? await getAllResumes() : await getResumes();
      setResumes(data);
    } catch (error) {
      console.error('Error loading resumes:', error);
      Alert.alert('Error', 'Failed to load resumes');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDelete = async (id: string, fileName: string) => {
    Alert.alert(
      'Delete Resume',
      `Are you sure you want to delete "${fileName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResume(id);
              await loadResumes();
              Alert.alert('Success', 'Resume deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete resume');
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Resume['status']): string => {
    switch (status) {
      case 'uploaded':
        return '#0a7ea4';
      case 'parsing':
        return '#ffa500';
      case 'parsed':
        return '#32cd32';
      case 'analyzed':
        return '#228b22';
      case 'error':
        return '#dc143c';
      default:
        return borderColor;
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>Loading resumes...</ThemedText>
      </ThemedView>
    );
  }

  if (resumes.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>No resumes uploaded yet</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadResumes} />
      }>
      {resumes.map((resume) => (
        <TouchableOpacity
          key={resume.id}
          style={[styles.resumeCard, { backgroundColor: cardBg, borderColor }]}
          onPress={() => onResumeSelect?.(resume)}
          activeOpacity={0.7}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ThemedText style={[styles.fileName, { color: textColor }]} numberOfLines={1}>
                📄 {resume.file_name}
              </ThemedText>
              {showAll && resume.candidate_name && (
                <ThemedText style={[styles.candidateName, { color: accentColor }]} numberOfLines={1}>
                  👤 {resume.candidate_name}
                </ThemedText>
              )}
              <View style={styles.metaRow}>
                <ThemedText style={[styles.metaText, { color: borderColor }]}>
                  {formatFileSize(resume.file_size)} • {formatDate(resume.upload_date)}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(resume.status) + '20' }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(resume.status) }]}>
                {resume.status.toUpperCase()}
              </ThemedText>
            </View>
          </View>

          {resume.tags && resume.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {resume.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: borderColor + '30' }]}>
                  <ThemedText style={[styles.tagText, { color: textColor }]}>{tag}</ThemedText>
                </View>
              ))}
            </View>
          )}

          {resume.analysis_data?.match_score !== undefined && (
            <View style={styles.analysisRow}>
              <ThemedText style={[styles.analysisLabel, { color: borderColor }]}>
                Match Score:
              </ThemedText>
              <ThemedText style={[styles.matchScore, { color: textColor }]}>
                {resume.analysis_data.match_score}%
              </ThemedText>
            </View>
          )}

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onResumeSelect?.(resume)}>
              <ThemedText style={[styles.actionText, { color: '#0a7ea4' }]}>View</ThemedText>
            </TouchableOpacity>
            {resume.file_url && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    const canOpen = await Linking.canOpenURL(resume.file_url);
                    if (canOpen) {
                      await Linking.openURL(resume.file_url);
                    } else {
                      Alert.alert('Error', 'Cannot open resume file. Please download it manually.');
                    }
                  } catch (err) {
                    Alert.alert('Error', 'Could not open resume file');
                    console.error('Error opening resume:', err);
                  }
                }}>
                <ThemedText style={[styles.actionText, { color: '#228b22' }]}>📄 Open File</ThemedText>
              </TouchableOpacity>
            )}
            {!showAll && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(resume.id, resume.file_name)}>
                <ThemedText style={[styles.actionText, { color: '#dc143c' }]}>Delete</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    opacity: 0.6,
  },
  resumeCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  candidateName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  analysisLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  matchScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});



