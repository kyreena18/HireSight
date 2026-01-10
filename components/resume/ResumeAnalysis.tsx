import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Resume } from '@/services/resumeService';

interface ResumeAnalysisProps {
  resume: Resume;
}

export function ResumeAnalysis({ resume }: ResumeAnalysisProps) {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const sectionBg = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';

  const analysis = resume.analysis_data;

  if (!analysis) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={[styles.emptyText, { color: borderColor }]}>
          Analysis not available yet. Resume is being analyzed...
        </ThemedText>
      </ThemedView>
    );
  }

  const getSuitabilityColor = (suitability?: string): string => {
    switch (suitability) {
      case 'strong':
        return '#228b22';
      case 'moderate':
        return '#ffa500';
      case 'weak':
        return '#dc143c';
      default:
        return borderColor;
    }
  };

  const getMatchScoreColor = (score?: number): string => {
    if (!score) return borderColor;
    if (score >= 80) return '#228b22';
    if (score >= 60) return '#ffa500';
    return '#dc143c';
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>Resume Analysis</ThemedText>
      </ThemedView>

      {analysis.match_score !== undefined && (
        <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Match Score</ThemedText>
          <View style={styles.scoreContainer}>
            <ThemedText
              style={[
                styles.matchScore,
                { color: getMatchScoreColor(analysis.match_score) },
              ]}>
              {analysis.match_score}%
            </ThemedText>
            {analysis.suitability && (
              <View
                style={[
                  styles.suitabilityBadge,
                  { backgroundColor: getSuitabilityColor(analysis.suitability) + '20' },
                ]}>
                <ThemedText
                  style={[
                    styles.suitabilityText,
                    { color: getSuitabilityColor(analysis.suitability) },
                  ]}>
                  {analysis.suitability.toUpperCase()}
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>
      )}

      {analysis.matched_skills && analysis.matched_skills.length > 0 && (
        <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            ✅ Matched Skills
          </ThemedText>
          <View style={styles.skillsContainer}>
            {analysis.matched_skills.map((skill, index) => (
              <View key={index} style={[styles.skillTag, { backgroundColor: '#228b2220', borderColor: '#228b22' }]}>
                <ThemedText style={[styles.skillText, { color: '#228b22' }]}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {analysis.missing_skills && analysis.missing_skills.length > 0 && (
        <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            ⚠️ Missing Skills
          </ThemedText>
          <View style={styles.skillsContainer}>
            {analysis.missing_skills.map((skill, index) => (
              <View key={index} style={[styles.skillTag, { backgroundColor: '#dc143c20', borderColor: '#dc143c' }]}>
                <ThemedText style={[styles.skillText, { color: '#dc143c' }]}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      )}

      {analysis.insights && analysis.insights.length > 0 && (
        <ThemedView style={[styles.section, { backgroundColor: sectionBg }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>💡 Insights</ThemedText>
          {analysis.insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <ThemedText style={[styles.insightText, { color: textColor }]}>
                • {insight}
              </ThemedText>
            </View>
          ))}
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  suitabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  suitabilityText: {
    fontSize: 14,
    fontWeight: '600',
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
    fontWeight: '500',
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});




