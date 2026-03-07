import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- MOCK DATA ---
const INITIAL_TIMETABLES = [
    {
        id: '1',
        studentName: 'Rahul Kumar',
        date: '2026-03-07',
        tasks: [
            { id: 't1', title: 'Physics Mechanics', isCompleted: true },
            { id: 't2', title: 'Chemistry Organic', isCompleted: false }
        ]
    },
    {
        id: '2',
        studentName: 'Priya Sharma',
        date: '2026-03-07',
        tasks: [
            { id: 't3', title: 'Math Calculus', isCompleted: true },
            { id: 't4', title: 'Biology Revision', isCompleted: true }
        ]
    }
];

const MentorStudentsTimetables = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [timetables, setTimetables] = useState(INITIAL_TIMETABLES);

    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        borderColor: isDarkMode ? '#334155' : '#E5E7EB',
        primaryBlue: '#3B82F6',
        taskDoneText: isDarkMode ? '#10B981' : '#059669',
    };

    const renderTimetable = ({ item }) => {
        const totalTasks = item.tasks.length;
        const completedTasks = item.tasks.filter(t => t.isCompleted).length;

        return (
            <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.avatar, { backgroundColor: theme.primaryBlue + '20' }]}>
                            <Text style={[styles.avatarText, { color: theme.primaryBlue }]}>{item.studentName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={[styles.studentName, { color: theme.textMain }]}>{item.studentName}</Text>
                            <Text style={[styles.taskCount, { color: theme.textSub }]}>{completedTasks} of {totalTasks} tasks done</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.borderColor }]} />

                {item.tasks.map(task => (
                    <View key={task.id} style={styles.taskRow}>
                        <MaterialCommunityIcons
                            name={task.isCompleted ? "check-circle" : "checkbox-blank-circle-outline"}
                            size={18}
                            color={task.isCompleted ? theme.taskDoneText : theme.textSub}
                        />
                        <Text style={[
                            styles.taskTitle,
                            { color: task.isCompleted ? theme.textSub : theme.textMain, textDecorationLine: task.isCompleted ? 'line-through' : 'none' }
                        ]}>
                            {task.title}
                        </Text>
                    </View>
                ))}
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
                <Text style={[styles.headerTitle, { color: theme.textMain }]}>Students Timetables</Text>
            </View>

            <FlatList
                data={timetables}
                keyExtractor={item => item.id}
                renderItem={renderTimetable}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default MentorStudentsTimetables;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    listContent: { padding: 20, paddingBottom: 40 },

    card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    cardHeader: { marginBottom: 16 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: 'bold' },
    studentName: { fontSize: 16, fontWeight: '700' },
    taskCount: { fontSize: 13, marginTop: 2 },

    divider: { height: 1, marginBottom: 16 },
    taskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    taskTitle: { fontSize: 14, marginLeft: 8 },
});
