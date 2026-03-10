import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';

const MentorStudentsWork = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/api/mentor/work');
            setReports(response.data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        borderColor: isDarkMode ? '#334155' : '#E5E7EB',
        primaryBlue: '#3B82F6',
        primaryGreen: '#10B981',
        inputBg: isDarkMode ? '#334155' : '#F9FAFB',
        badgeBg: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
    };

    const openFeedbackModal = (report) => {
        setSelectedReport(report);
        setFeedbackText('');
        setModalVisible(true);
    };

    const submitFeedback = async () => {
        if (!feedbackText.trim() || !selectedReport) return;
        try {
            setIsLoading(true);
            await api.post('/api/mentor/feedback', {
                studentId: selectedReport.student._id,
                dailyReportId: selectedReport._id,
                comments: feedbackText
            });
            alert('Feedback submitted successfully!');
            fetchReports(); // Refresh the list
            setModalVisible(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderReportCard = ({ item }) => {
        const studentName = item.student?.name || 'Unknown Student';

        // Calculate total hours
        const h = item.hours || {};
        const total = (parseFloat(h.physics) || 0) + (parseFloat(h.chemistry) || 0) + (parseFloat(h.math) || 0) + (parseFloat(h.biology) || 0);

        return (
            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>

                {/* HEADER */}
                <View style={styles.cardHeader}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => router.push(`/mentor/student-stats?studentId=${item.student?._id}`)}>
                        <View style={[styles.avatar, { backgroundColor: theme.primaryBlue + '20' }]}>
                            <Text style={[styles.avatarText, { color: theme.primaryBlue }]}>{studentName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={[styles.studentName, { color: theme.textMain }]}>{studentName}</Text>
                            <Text style={[styles.dateText, { color: theme.textSub }]}>{new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                        <Text style={[styles.badgeText, { color: theme.primaryBlue }]}>{total} hrs</Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

                {/* CONTENT */}
                <Text style={[styles.sectionLabel, { color: theme.textSub }]}>Tasks Completed</Text>
                <Text style={[styles.contentText, { color: theme.textMain }]}>{item.tasksCompleted}</Text>

                {item.notes ? (
                    <>
                        <Text style={[styles.sectionLabel, { color: theme.textSub, marginTop: 12 }]}>Student Notes</Text>
                        <Text style={[styles.contentText, { color: theme.textSub, fontStyle: 'italic' }]}>"{item.notes}"</Text>
                    </>
                ) : null}

                {/* ACTIONS */}
                <View style={{ marginTop: 20 }}>
                    {item.hasFeedback ? (
                        <View style={styles.feedbackGivenContainer}>
                            <MaterialCommunityIcons name="check-circle" size={16} color={theme.primaryGreen} />
                            <Text style={[styles.feedbackGivenText, { color: theme.primaryGreen }]}>Feedback Submitted</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.feedbackBtn, { backgroundColor: theme.primaryBlue }]}
                            onPress={() => openFeedbackModal(item)}
                        >
                            <MaterialCommunityIcons name="comment-plus-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                            <Text style={styles.feedbackBtnText}>Give Feedback</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textMain} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textMain }]}>Students Work Reports</Text>
            </View>

            <FlatList
                data={reports}
                keyExtractor={item => item._id}
                renderItem={renderReportCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* FEEDBACK MODAL */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                        <Text style={[styles.modalTitle, { color: theme.textMain }]}>
                            Feedback for {selectedReport?.studentName}
                        </Text>
                        <Text style={[styles.modalSub, { color: theme.textSub }]}>
                            Your feedback will be sent as a notification to the student.
                        </Text>

                        <TextInput
                            style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
                            placeholder="Write your constructive feedback here..."
                            placeholderTextColor={theme.textSub}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.inputBg }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.textMain }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.primaryBlue, marginLeft: 12 }]}
                                onPress={submitFeedback}
                            >
                                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Submit Feedback</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MentorStudentsWork;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20, paddingBottom: 40 },

    card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: 'bold' },
    studentName: { fontSize: 17, fontWeight: '700' },
    dateText: { fontSize: 13, marginTop: 4 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 12, fontWeight: '700' },

    divider: { height: 1, marginBottom: 16 },
    sectionLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
    contentText: { fontSize: 15, lineHeight: 22 },

    feedbackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
    feedbackBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
    feedbackGivenContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
    feedbackGivenText: { marginLeft: 6, fontWeight: '600', fontSize: 15 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    modalSub: { fontSize: 14, marginBottom: 20 },
    modalInput: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120, fontSize: 16 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, marginBottom: Platform.OS === 'ios' ? 20 : 0 },
    modalBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, minWidth: 100, alignItems: 'center' },
    modalBtnText: { fontWeight: '600', fontSize: 15 },
});
