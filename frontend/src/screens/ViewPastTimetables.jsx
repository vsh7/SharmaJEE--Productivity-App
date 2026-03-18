import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api';

const ViewPastTimetables = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [timetables, setTimetables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/student/timetable/history');
                setTimetables(response.data || []);
            } catch (error) {
                console.error('Error fetching timetable history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        borderColor: isDarkMode ? '#334155' : '#E5E7EB',
        accentBlue: '#3B82F6',
        accentGreen: '#10B981',
        taskDoneText: isDarkMode ? '#10B981' : '#059669',
    };

    const renderTimetable = ({ item }) => {
        const tasks = item.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.isDone).length;
        const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const isExpanded = expandedId === item._id;
        const dateStr = new Date(item.date).toLocaleDateString('en-US', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpandedId(isExpanded ? null : item._id)}
                style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.dateIconBox, { backgroundColor: theme.accentBlue + '20' }]}>
                        <MaterialCommunityIcons name="calendar" size={20} color={theme.accentBlue} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.dateText, { color: theme.textMain }]}>{dateStr}</Text>
                        <Text style={[styles.taskCount, { color: theme.textSub }]}>
                            {completedTasks} of {totalTasks} tasks completed
                        </Text>
                    </View>
                    <View style={[styles.pctBadge, { backgroundColor: completionPct === 100 ? theme.accentGreen + '20' : theme.accentBlue + '20' }]}>
                        <Text style={[styles.pctText, { color: completionPct === 100 ? theme.accentGreen : theme.accentBlue }]}>
                            {completionPct}%
                        </Text>
                    </View>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme.textSub}
                        style={{ marginLeft: 8 }}
                    />
                </View>

                {isExpanded && (
                    <View>
                        <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />
                        {tasks.map(task => (
                            <View key={task._id} style={styles.taskRow}>
                                <MaterialCommunityIcons
                                    name={task.isDone ? 'check-circle' : 'checkbox-blank-circle-outline'}
                                    size={18}
                                    color={task.isDone ? theme.taskDoneText : theme.textSub}
                                />
                                <Text style={[
                                    styles.taskTitle,
                                    { color: task.isDone ? theme.textSub : theme.textMain, textDecorationLine: task.isDone ? 'line-through' : 'none' }
                                ]}>
                                    {task.title}
                                </Text>
                                {task.startTime && (
                                    <Text style={[styles.taskTime, { color: theme.textSub }]}>
                                        {task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.accentBlue} />
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
                <Text style={[styles.headerTitle, { color: theme.textMain }]}>Past Timetables</Text>
            </View>

            {timetables.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="calendar-blank" size={48} color={theme.textSub} />
                    <Text style={[styles.emptyTitle, { color: theme.textMain }]}>No Timetables Yet</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textSub }]}>
                        Create your first timetable to start tracking your study schedule.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={timetables}
                    keyExtractor={item => item._id}
                    renderItem={renderTimetable}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default ViewPastTimetables;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20, paddingBottom: 40 },

    card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    dateIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    dateText: { fontSize: 15, fontWeight: '700' },
    taskCount: { fontSize: 13, marginTop: 2 },
    pctBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    pctText: { fontSize: 13, fontWeight: '700' },

    divider: { height: 1, marginVertical: 12 },
    taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    taskTitle: { fontSize: 14, marginLeft: 8, flex: 1 },
    taskTime: { fontSize: 12, marginLeft: 8 },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
