import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';

const ReviewFromMentor = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await api.get('/api/feedback/my-feedback');
                setFeedback(response.data || []);
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        borderColor: isDarkMode ? '#334155' : '#E5E7EB',
        accentPurple: '#8B5CF6',
        accentBlue: '#3B82F6',
    };

    const renderFeedbackCard = ({ item }) => {
        const mentorName = item.mentor?.name || 'Mentor';
        const feedbackDate = new Date(item.createdAt).toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        const report = item.dailyReport;
        const reportDate = report?.date
            ? new Date(report.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            : 'N/A';

        const hours = report?.hours || {};
        const totalHours = (parseFloat(hours.physics) || 0) + (parseFloat(hours.chemistry) || 0)
            + (parseFloat(hours.math) || 0) + (parseFloat(hours.biology) || 0);

        return (
            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                {/* Mentor info */}
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: theme.accentPurple + '20' }]}>
                        <Text style={[styles.avatarText, { color: theme.accentPurple }]}>
                            {mentorName.charAt(0)}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.mentorName, { color: theme.textMain }]}>{mentorName}</Text>
                        <Text style={[styles.feedbackDate, { color: theme.textSub }]}>{feedbackDate}</Text>
                    </View>
                </View>

                {/* Feedback comment */}
                <View style={[styles.commentBox, { backgroundColor: theme.accentPurple + '10' }]}>
                    <MaterialCommunityIcons name="comment-quote" size={16} color={theme.accentPurple} style={{ marginRight: 8, marginTop: 2 }} />
                    <Text style={[styles.commentText, { color: theme.textMain }]}>{item.comments}</Text>
                </View>

                {/* Report reference */}
                <View style={[styles.reportRef, { borderColor: theme.borderColor }]}>
                    <Text style={[styles.reportRefLabel, { color: theme.textSub }]}>Report: {reportDate}</Text>
                    {totalHours > 0 && (
                        <Text style={[styles.reportRefHours, { color: theme.accentBlue }]}>{totalHours} hrs</Text>
                    )}
                    {report?.tasksCompleted ? (
                        <Text style={[styles.reportRefTasks, { color: theme.textSub }]} numberOfLines={2}>
                            {report.tasksCompleted}
                        </Text>
                    ) : null}
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.accentPurple} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textMain} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textMain }]}>Mentor Reviews</Text>
            </View>

            {feedback.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="comment-remove-outline" size={48} color={theme.textSub} />
                    <Text style={[styles.emptyTitle, { color: theme.textMain }]}>No Reviews Yet</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textSub }]}>
                        Your mentor hasn't reviewed any of your work yet. Keep submitting your daily reports!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={feedback}
                    keyExtractor={item => item._id}
                    renderItem={renderFeedbackCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default ReviewFromMentor;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20, paddingBottom: 40 },

    card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: 'bold' },
    mentorName: { fontSize: 16, fontWeight: '700' },
    feedbackDate: { fontSize: 12, marginTop: 2 },

    commentBox: { flexDirection: 'row', padding: 12, borderRadius: 12, marginBottom: 12 },
    commentText: { fontSize: 14, lineHeight: 20, flex: 1 },

    reportRef: { borderTopWidth: 1, paddingTop: 12 },
    reportRefLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    reportRefHours: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
    reportRefTasks: { fontSize: 13, lineHeight: 18 },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
