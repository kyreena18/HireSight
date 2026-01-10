import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { searchShortlistedResumes, SearchCriteria, Resume } from '@/services/resumeService';
import { ResumeList } from './ResumeList';

interface HRResumeSearchProps {
  onResumeSelect?: (resume: Resume) => void;
}

export function HRResumeSearch({ onResumeSelect }: HRResumeSearchProps) {
  const [skills, setSkills] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [searchResults, setSearchResults] = useState<Resume[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = colorScheme === 'dark' ? '#2a2a2a' : '#ffffff';
  const inputBg = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';
  const accentColor = '#0a7ea4';

  const handleSearch = async () => {
    // Validate that at least one search criteria is provided
    if (!skills.trim() && !minExperience.trim() && !jobDescription.trim()) {
      Alert.alert('Validation Error', 'Please provide at least one search criteria (skills, experience, or job description)');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]);

    try {
      const criteria: SearchCriteria = {};

      // Parse skills
      if (skills.trim()) {
        criteria.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }

      // Parse minimum experience
      if (minExperience.trim()) {
        const years = parseInt(minExperience.trim(), 10);
        if (!isNaN(years) && years >= 0) {
          criteria.minExperience = years;
        }
      }

      // Add job description
      if (jobDescription.trim()) {
        criteria.jobDescription = jobDescription.trim();
      }

      // Only search analyzed resumes for better results
      criteria.status = 'analyzed';

      const results = await searchShortlistedResumes(criteria);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert(
          'No Results',
          'No shortlisted resumes found matching your criteria. Try adjusting your search parameters.'
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert(
        'Search Error',
        error instanceof Error ? error.message : 'Failed to search resumes. Please try again.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSkills('');
    setMinExperience('');
    setJobDescription('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.searchCard, { backgroundColor: cardBg, borderColor }]}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          🔍 Search Shortlisted Resumes
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: borderColor }]}>
          Search through shortlisted resumes by skills, experience, or job description
        </ThemedText>

        <View style={styles.searchSection}>
          <ThemedText style={[styles.label, { color: textColor }]}>Skills (comma-separated)</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
            placeholder="e.g., React, TypeScript, Node.js"
            placeholderTextColor={borderColor}
            value={skills}
            onChangeText={setSkills}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.searchSection}>
          <ThemedText style={[styles.label, { color: textColor }]}>Minimum Experience (years)</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
            placeholder="e.g., 3"
            placeholderTextColor={borderColor}
            value={minExperience}
            onChangeText={setMinExperience}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.searchSection}>
          <ThemedText style={[styles.label, { color: textColor }]}>Job Description</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: inputBg, color: textColor, borderColor }]}
            placeholder="Enter job requirements, responsibilities, and qualifications..."
            placeholderTextColor={borderColor}
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: borderColor + '30', borderColor }]}
            onPress={handleClear}
            disabled={isSearching}>
            <ThemedText style={[styles.buttonText, { color: textColor }]}>Clear</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: accentColor }]}
            onPress={handleSearch}
            disabled={isSearching}>
            {isSearching ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.searchButtonText}>Search</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>

      {hasSearched && !isSearching && (
        <View style={styles.resultsSection}>
          <ThemedText style={[styles.resultsTitle, { color: textColor }]}>
            Search Results ({searchResults.length})
          </ThemedText>
          {searchResults.length > 0 ? (
            <ScrollView style={styles.resultsList}>
              {searchResults.map((resume) => (
                <TouchableOpacity
                  key={resume.id}
                  style={[styles.resultCard, { backgroundColor: cardBg, borderColor }]}
                  onPress={() => onResumeSelect?.(resume)}
                  activeOpacity={0.7}>
                  <View style={styles.resultHeader}>
                    <ThemedText style={[styles.resultName, { color: textColor }]} numberOfLines={1}>
                      👤 {resume.candidate_name || 'Unknown'}
                    </ThemedText>
                    {resume.analysis_data?.match_score && (
                      <View style={[styles.scoreBadge, { backgroundColor: accentColor + '20' }]}>
                        <ThemedText style={[styles.scoreText, { color: accentColor }]}>
                          {Math.round(resume.analysis_data.match_score * 100)}% match
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={[styles.resultFile, { color: borderColor }]} numberOfLines={1}>
                    📄 {resume.file_name}
                  </ThemedText>
                  {resume.parsed_data?.skills && resume.parsed_data.skills.length > 0 && (
                    <View style={styles.skillsContainer}>
                      {resume.parsed_data.skills.slice(0, 5).map((skill, index) => (
                        <View key={index} style={[styles.skillTag, { backgroundColor: borderColor + '30' }]}>
                          <ThemedText style={[styles.skillText, { color: textColor }]}>{skill}</ThemedText>
                        </View>
                      ))}
                      {resume.parsed_data.skills.length > 5 && (
                        <ThemedText style={[styles.moreSkills, { color: borderColor }]}>
                          +{resume.parsed_data.skills.length - 5} more
                        </ThemedText>
                      )}
                    </View>
                  )}
                  {resume.parsed_data?.experience && resume.parsed_data.experience.length > 0 && (
                    <ThemedText style={[styles.resultExp, { color: borderColor }]} numberOfLines={1}>
                      💼 {resume.parsed_data.experience[0].title} at {resume.parsed_data.experience[0].company}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <ThemedView style={[styles.emptyState, { backgroundColor: cardBg, borderColor }]}>
              <ThemedText style={[styles.emptyText, { color: borderColor }]}>
                No shortlisted resumes found matching your criteria.
              </ThemedText>
            </ThemedView>
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  searchSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  searchButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  resultsList: {
    flex: 1,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultFile: {
    fontSize: 13,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  skillTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 11,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  resultExp: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

