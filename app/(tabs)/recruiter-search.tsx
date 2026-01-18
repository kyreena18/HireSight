import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { Search, Filter, Users } from 'lucide-react-native';

interface Resume {
  id: string;
  file_name: string;
  skills: string[];
  years_of_experience: number;
  summary: string;
  email: string;
  phone: string;
  user_id: string;
}

export default function RecruiterSearchScreen() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    filterResumes();
  }, [searchQuery, skillFilter, minExperience, resumes]);

  const fetchResumes = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('status', 'parsed')
        .order('upload_date', { ascending: false });

      if (error) throw error;

      setResumes(data || []);
      setFilteredResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResumes = () => {
    let filtered = resumes;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        resume =>
          resume.file_name?.toLowerCase().includes(query) ||
          resume.summary?.toLowerCase().includes(query) ||
          resume.email?.toLowerCase().includes(query) ||
          resume.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (skillFilter) {
      const skills = skillFilter.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(resume =>
        skills.some(skill =>
          resume.skills?.some(resumeSkill => resumeSkill.toLowerCase().includes(skill))
        )
      );
    }

    if (minExperience) {
      const minExp = parseInt(minExperience);
      if (!isNaN(minExp)) {
        filtered = filtered.filter(resume => (resume.years_of_experience || 0) >= minExp);
      }
    }

    setFilteredResumes(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSkillFilter('');
    setMinExperience('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading resumes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Search size={28} color="#007AFF" />
          <Text style={styles.headerTitle}>Resume Search</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {filteredResumes.length} of {resumes.length} resumes
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>
            <Filter size={18} color="#666" /> Filters
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Search</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by name, email, or keywords..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Required Skills</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., python, react, aws (comma separated)"
              value={skillFilter}
              onChangeText={setSkillFilter}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Minimum Experience (years)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 3"
              value={minExperience}
              onChangeText={setMinExperience}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            <Users size={18} color="#333" /> Results
          </Text>

          {filteredResumes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No resumes match your criteria</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
            </View>
          ) : (
            filteredResumes.map(resume => (
              <View key={resume.id} style={styles.resumeCard}>
                <Text style={styles.resumeName}>{resume.file_name}</Text>

                {resume.email && (
                  <Text style={styles.resumeDetail}>Email: {resume.email}</Text>
                )}

                {resume.phone && (
                  <Text style={styles.resumeDetail}>Phone: {resume.phone}</Text>
                )}

                <Text style={styles.resumeDetail}>
                  Experience: {resume.years_of_experience || 0} years
                </Text>

                {resume.skills && resume.skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    <Text style={styles.skillsLabel}>Skills:</Text>
                    <View style={styles.skillsList}>
                      {resume.skills.slice(0, 5).map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                      {resume.skills.length > 5 && (
                        <Text style={styles.moreSkills}>+{resume.skills.length - 5} more</Text>
                      )}
                    </View>
                  </View>
                )}

                {resume.summary && (
                  <Text style={styles.resumeSummary} numberOfLines={3}>
                    {resume.summary}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clearButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  resultsSection: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  resumeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resumeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  resumeDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  skillsContainer: {
    marginTop: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
  },
  resumeSummary: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
