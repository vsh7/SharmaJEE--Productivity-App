import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';

const AIInsightsScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  const theme = {
    background: isDarkMode ? '#0F172A' : '#F9FAFB',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#111827',
    textSub: isDarkMode ? '#94A3B8' : '#6B7280',
    borderColor: isDarkMode ? '#334155' : '#E5E7EB',
    accent: isDarkMode ? '#3B82F6' : '#2563EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  useEffect(() => {
    fetchAISuggestions();
  }, []);

  const fetchAISuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/ai/suggestions');

      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
        setAnalytics(response.data.analytics);
      } else {
        setError(response.data.message || 'Not enough data yet');
      }
    } catch (err) {
      console.error('AI Suggestions Error:', err);
      setError(err.response?.data?.message || 'Failed to load AI suggestions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAISuggestions();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TIME_MANAGEMENT': return 'clock-outline';
      case 'SUBJECT_BALANCE': return 'scale-balance';
      case 'CONSISTENCY': return 'calendar-check';
      case 'PRODUCTIVITY': return 'trending-up';
      case 'EXAM_PREP': return 'book-open-variant';
      case 'BREAKS': return 'coffee-outline';
      default: return 'lightbulb-outline';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'TIME_MANAGEMENT': return '#3B82F6';
      case 'SUBJECT_BALANCE': return '#8B5CF6';
      case 'CONSISTENCY': return '#10B981';
      case 'PRODUCTIVITY': return '#F59E0B';
      case 'EXAM_PREP': return '#EF4444';
      case 'BREAKS': return '#06B6D4';
      default: return theme.accent;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSub }]}>
            AI is analyzing your study patterns...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>AI Study Insights</Text>
          <Text style={[styles.headerSub, { color: theme.textSub }]}>
            Powered by Google Gemini AI
          </Text>
        </View>
        <TouchableOpacity onPress={fetchAISuggestions}>
          <MaterialCommunityIcons name="refresh" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={[styles.errorCard, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <MaterialCommunityIcons name="information-outline" size={48} color={theme.warning} />
            <Text style={[styles.errorTitle, { color: theme.textMain }]}>Not Enough Data Yet</Text>
            <Text style={[styles.errorText, { color: theme.textSub }]}>{error}</Text>
            <Text style={[styles.errorHint, { color: theme.textSub }]}>
              Submit a few daily reports to get personalized AI suggestions!
            </Text>
          </View>
        ) : (
          <>
            {/* Analytics Summary */}
            {analytics && (
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Your Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.accent }]}>
                      {analytics.totalDays}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSub }]}>Days Tracked</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.success }]}>
                      {analytics.consistency.score}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSub }]}>Consistency</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.warning }]}>
                      {analytics.patterns.avgTotalHours}h
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSub }]}>Avg Hours/Day</Text>
                  </View>
                </View>
              </View>
            )}

            {/* AI Suggestions */}
            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="robot-excited-outline" size={24} color={theme.accent} />
                <Text style={[styles.sectionTitle, { color: theme.textMain, marginLeft: 8 }]}>
                  AI Recommendations
                </Text>
              </View>

              {suggestions.map((suggestion, index) => (
                <View
                  key={index}
                  style={[styles.suggestionCard, {
                    backgroundColor: isDarkMode ? '#334155' : '#F3F4F6',
                    borderLeftColor: getCategoryColor(suggestion.category),
                  }]}
                >
                  <View style={styles.suggestionHeader}>
                    <MaterialCommunityIcons
                      name={getCategoryIcon(suggestion.category)}
                      size={20}
                      color={getCategoryColor(suggestion.category)}
                    />
                    <Text style={[styles.categoryTag, { color: getCategoryColor(suggestion.category) }]}>
                      {suggestion.category.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text style={[styles.suggestionText, { color: theme.textMain }]}>
                    {suggestion.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Subject Breakdown */}
            {analytics && analytics.subjectStats && (
              <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Subject Breakdown</Text>
                {Object.entries(analytics.subjectStats).map(([subject, stats]) => (
                  <View key={subject} style={styles.subjectRow}>
                    <View style={styles.subjectInfo}>
                      <Text style={[styles.subjectName, { color: theme.textMain }]}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </Text>
                      <Text style={[styles.subjectDetails, { color: theme.textSub }]}>
                        {stats.days} days • {stats.totalHours.toFixed(1)}h total
                      </Text>
                    </View>
                    <Text style={[styles.avgHours, { color: theme.accent }]}>
                      {stats.avgHours}h/day
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AIInsightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  errorCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  suggestionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB20',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subjectDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  avgHours: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
