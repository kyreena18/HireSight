import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  searchByJobDescription,
  searchBySkills,
  searchByEducation,
  generalSearch,
  SearchResult,
} from '@/services/resumeSearchService';
import { Resume, getResumeById } from '@/services/resumeService';
import { HRResumeSearch } from '@/components/resume/HRResumeSearch';

export default function ExploreScreen() {
  const [searchMode, setSearchMode] = useState<'all' | 'shortlisted'>('shortlisted');
  const [searchType, setSearchType] = useState<'jd' | 'skills' | 'education' | 'general'>('jd');
  const [jdQuery, setJdQuery] = useState('');
  const [skillsQuery, setSkillsQuery] = useState('');
  const [yearsQuery, setYearsQuery] = useState('');
  const [educationQuery, setEducationQuery] = useState('');
  const [generalQuery, setGeneralQuery] = useState('');
  const [includeNotes, setIncludeNotes] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = colorScheme === 'dark' ? '#2a2a2a' : '#ffffff';
  const accentColor = '#0a7ea4';
  const inputBg = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    setSearchMessage('');

    try {
      let response;
      switch (searchType) {
        case 'jd':
          if (!jdQuery.trim()) {
            Alert.alert('Error', 'Please enter a job description');
            setIsSearching(false);
            return;
          }
          response = await searchByJobDescription(jdQuery);
          break;
        case 'skills':
          if (!skillsQuery.trim()) {
            Alert.alert('Error', 'Please enter skills');
            setIsSearching(false);
            return;
          }
          response = await searchBySkills(skillsQuery, yearsQuery || '0');
          break;
        case 'education':
          if (!educationQuery.trim()) {
            Alert.alert('Error', 'Please enter education levels');
            setIsSearching(false);
            return;
          }
          response = await searchByEducation(educationQuery);
          break;
        case 'general':
          if (!generalQuery.trim()) {
            Alert.alert('Error', 'Please enter a search query');
            setIsSearching(false);
            return;
          }
          response = await generalSearch(generalQuery, includeNotes);
          break;
      }

      setResults(response.results || []);
      setSearchMessage(response.message || '');
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert(
        'Search Error',
        error instanceof Error ? error.message : 'Failed to search resumes. Make sure the Flask backend is running.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewResume = async (resumeFileName: string) => {
    try {
      // Try to find the resume in the database by file name
      // For now, we'll open the resume URL directly if available
      // In a real implementation, you'd match the filename to a resume record
      Alert.alert(
        'View Resume',
        `Would you like to view ${resumeFileName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View',
            onPress: () => {
              // This would open the resume file
              // For now, we'll show an alert
              Alert.alert('Info', 'Resume viewing will be implemented with file viewer');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load resume');
    }
  };

  const renderSearchForm = () => {
    switch (searchType) {
      case 'jd':
        return (
          <View style={styles.searchSection}>
            <ThemedText style={[styles.label, { color: textColor }]}>Job Description</ThemedText>
            <TextInput
              style={[styles.textArea, { backgroundColor: inputBg, color: textColor, borderColor }]}
              placeholder="Enter job description, requirements, and qualifications..."
              placeholderTextColor={borderColor}
              multiline
              numberOfLines={6}
              value={jdQuery}
              onChangeText={setJdQuery}
            />
          </View>
        );
      case 'skills':
        return (
          <View style={styles.searchSection}>
            <ThemedText style={[styles.label, { color: textColor }]}>Skills (comma-separated)</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              placeholder="e.g., Python, React, SQL"
              placeholderTextColor={borderColor}
              value={skillsQuery}
              onChangeText={setSkillsQuery}
            />
            <ThemedText style={[styles.label, { color: textColor, marginTop: 12 }]}>
              Minimum Years of Experience
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              placeholder="e.g., 3"
              placeholderTextColor={borderColor}
              keyboardType="numeric"
              value={yearsQuery}
              onChangeText={setYearsQuery}
            />
          </View>
        );
      case 'education':
        return (
          <View style={styles.searchSection}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Education Levels (comma-separated)
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
              placeholder="e.g., bachelors, masters, phd"
              placeholderTextColor={borderColor}
              value={educationQuery}
              onChangeText={setEducationQuery}
            />
          </View>
        );
      case 'general':
        return (
          <View style={styles.searchSection}>
            <ThemedText style={[styles.label, { color: textColor }]}>Search Query</ThemedText>
            <TextInput
              style={[styles.textArea, { backgroundColor: inputBg, color: textColor, borderColor }]}
              placeholder="Enter any search terms..."
              placeholderTextColor={borderColor}
              multiline
              numberOfLines={4}
              value={generalQuery}
              onChangeText={setGeneralQuery}
            />
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIncludeNotes(!includeNotes)}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor, backgroundColor: includeNotes ? accentColor : 'transparent' },
                ]}
              />
              <ThemedText style={[styles.checkboxLabel, { color: textColor }]}>
                Include interview notes
              </ThemedText>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const handleResumeSelect = (resume: Resume) => {
    setSelectedResume(resume);
    // Navigate to resume details or show in modal
    Alert.alert(
      'Resume Selected',
      `Selected: ${resume.candidate_name || resume.file_name}`,
      [
        { text: 'OK' },
        {
          text: 'View Details',
          onPress: () => {
            // You can navigate to a resume detail screen here
            console.log('View resume:', resume.id);
          },
        },
      ]
    );
  };

  // If searching shortlisted resumes, use the dedicated component
  if (searchMode === 'shortlisted') {
    return (
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: accentColor }]}>
            <ThemedText style={styles.headerTitle}>🔍 Search Shortlisted Resumes</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Search through shortlisted candidates by skills, experience, or job description
            </ThemedText>
          </ThemedView>

          {/* Mode Toggle */}
          <ThemedView style={styles.section}>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  searchMode === 'shortlisted' && styles.modeButtonActive,
                  { borderColor, backgroundColor: searchMode === 'shortlisted' ? accentColor : cardBg },
                ]}
                onPress={() => setSearchMode('shortlisted')}>
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    { color: searchMode === 'shortlisted' ? '#ffffff' : textColor },
                  ]}>
                  ⭐ Shortlisted Only
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  searchMode === 'all' && styles.modeButtonActive,
                  { borderColor, backgroundColor: searchMode === 'all' ? accentColor : cardBg },
                ]}
                onPress={() => setSearchMode('all')}>
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    { color: searchMode === 'all' ? '#ffffff' : textColor },
                  ]}>
                  🌐 All Resumes
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>

          <HRResumeSearch onResumeSelect={handleResumeSelect} />
        </ScrollView>
      </ThemedView>
    );
  }

  // Original search for all resumes (Flask backend)
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: accentColor }]}>
          <ThemedText style={styles.headerTitle}>🔍 Search Candidates</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Find the perfect candidates using AI-powered search (All Resumes)
          </ThemedText>
        </ThemedView>

        {/* Mode Toggle */}
        <ThemedView style={styles.section}>
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === 'shortlisted' && styles.modeButtonActive,
                { borderColor, backgroundColor: searchMode === 'shortlisted' ? accentColor : cardBg },
              ]}
              onPress={() => setSearchMode('shortlisted')}>
              <ThemedText
                style={[
                  styles.modeButtonText,
                  { color: searchMode === 'shortlisted' ? '#ffffff' : textColor },
                ]}>
                ⭐ Shortlisted Only
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                searchMode === 'all' && styles.modeButtonActive,
                { borderColor, backgroundColor: searchMode === 'all' ? accentColor : cardBg },
              ]}
              onPress={() => setSearchMode('all')}>
              <ThemedText
                style={[
                  styles.modeButtonText,
                  { color: searchMode === 'all' ? '#ffffff' : textColor },
                ]}>
                🌐 All Resumes
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Search Type Selector */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Search Type</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
            {(['jd', 'skills', 'education', 'general'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: searchType === type ? accentColor : cardBg,
                    borderColor,
                  },
                ]}
                onPress={() => setSearchType(type)}>
                <ThemedText
                  style={[
                    styles.typeButtonText,
                    { color: searchType === type ? '#ffffff' : textColor },
                  ]}>
                  {type === 'jd' && '📋 Job Description'}
                  {type === 'skills' && '💼 Skills & Experience'}
                  {type === 'education' && '🎓 Education'}
                  {type === 'general' && '🔎 General Search'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Search Form */}
        <ThemedView style={[styles.section, { backgroundColor: cardBg, borderColor }]}>
          {renderSearchForm()}
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
        </ThemedView>

        {/* Search Message */}
        {searchMessage ? (
          <ThemedView style={styles.section}>
            <ThemedText style={[styles.message, { color: borderColor }]}>{searchMessage}</ThemedText>
          </ThemedView>
        ) : null}

        {/* Results */}
        {results.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Search Results ({results.length})
            </ThemedText>
            {results.map((result, index) => (
              <View key={index} style={[styles.resultCard, { backgroundColor: cardBg, borderColor }]}>
                <View style={styles.resultHeader}>
                  <ThemedText style={[styles.resultName, { color: textColor }]}>
                    👤 {result.name}
                  </ThemedText>
                  <View style={styles.matchInfo}>
                    {result.match_percent !== undefined && (
                      <View style={[styles.matchBadge, { backgroundColor: accentColor + '20' }]}>
                        <ThemedText style={[styles.matchPercent, { color: accentColor }]}>
                          {result.match_percent}% Match
                        </ThemedText>
                      </View>
                    )}
                    <View style={[styles.similarityBadge, { backgroundColor: borderColor + '20' }]}>
                      <ThemedText style={[styles.similarityText, { color: borderColor }]}>
                        {(result.similarity * 100).toFixed(1)}% Similar
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.matchTypeContainer}>
                  <ThemedText style={[styles.matchType, { color: result.found_in_resume ? '#228b22' : '#ffa500' }]}>
                    {result.match_type}
                  </ThemedText>
                </View>

                {result.keywords_found && result.keywords_found.length > 0 && (
                  <View style={styles.keywordsContainer}>
                    <ThemedText style={[styles.keywordsLabel, { color: borderColor }]}>
                      Keywords Found:
                    </ThemedText>
                    <View style={styles.keywordsList}>
                      {result.keywords_found.map((keyword, idx) => (
                        <View key={idx} style={[styles.keywordTag, { backgroundColor: accentColor + '20' }]}>
                          <ThemedText style={[styles.keywordText, { color: accentColor }]}>
                            {keyword}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <ThemedText style={[styles.preview, { color: textColor }]} numberOfLines={3}>
                  {result.preview.replace(/<mark>/g, '').replace(/<\/mark>/g, '')}
                </ThemedText>

                {result.resume && (
                  <TouchableOpacity
                    style={[styles.viewResumeButton, { backgroundColor: accentColor }]}
                    onPress={() => handleViewResume(result.resume!)}>
                    <ThemedText style={styles.viewResumeText}>📄 View Resume</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ThemedView>
        )}

        {results.length === 0 && !isSearching && searchMessage && (
          <ThemedView style={styles.section}>
            <ThemedText style={[styles.emptyText, { color: borderColor }]}>
              No results found. Try adjusting your search criteria.
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeSelector: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  searchButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  matchInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  matchPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  similarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  similarityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  matchTypeContainer: {
    marginBottom: 12,
  },
  matchType: {
    fontSize: 13,
    fontWeight: '500',
  },
  keywordsContainer: {
    marginBottom: 12,
  },
  keywordsLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  keywordText: {
    fontSize: 11,
    fontWeight: '500',
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  viewResumeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewResumeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modeButtonActive: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
