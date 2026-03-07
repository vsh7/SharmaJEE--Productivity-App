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
const MOCK_STATS = {
    studentName: 'Rahul Kumar',
    overview: {
        totalHours: 142,
        streak: 12,
        completionRate: '85%'
    },
    recentReports: [
        { id: '1', date: 'Mar 07', hours: 6, tasks: 'Completed Mechanics' },
        { id: '2', date: 'Mar 06', hours: 5.5, tasks: 'Organic Chemistry' },
        { id: '3', date: 'Mar 05', hours: 7, tasks: 'Mock Test 1' },
    ]
};

const MentorStudentStats = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();
    const [stats, setStats] = useState(MOCK_STATS);

    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        borderColor: isDarkMode ? '#334155' : '#E5E7EB',
        primaryBlue: '#3B82F6',
        accentOrange: '#F59E0B',
        accentGreen: '#10B981',
    };

    const renderReportItem = ({ item }) => (
        <View style={styles.historyRow}>
            <View style={[styles.historyIconBox, { backgroundColor: theme.primaryBlue + '20' }]}>
                <MaterialCommunityIcons name="clipboard-text" size={16} color={theme.primaryBlue} />
            </View>
            <View style={styles.historyContent}>
                <Text style={[styles.historyDate, { color: theme.textMain }]}>{item.date}</Text>
                <Text style={[styles.historyTasks, { color: theme.textSub }]} numberOfLines={1}>
                    {item.tasks}
                </Text>
            </View>
            <Text style={[styles.historyHours, { color: theme.textMain }]}>{item.hours} hrs</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textMain} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textMain }]}>Student Stats</Text>
            </View>

            <View style={styles.content}>
                {/* STUDENT INFO */}
                <View style={styles.profileSection}>
                    <View style={[styles.avatar, { backgroundColor: theme.primaryBlue + '20' }]}>
                        <Text style={[styles.avatarText, { color: theme.primaryBlue }]}>{stats.studentName.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.studentName, { color: theme.textMain }]}>{stats.studentName}</Text>
                    <Text style={[styles.studentEmail, { color: theme.textSub }]}>Monitoring since Feb 2026</Text>
                </View>

                {/* STATS CARDS */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color={theme.primaryBlue} />
                        <Text style={[styles.statValue, { color: theme.textMain }]}>{stats.overview.totalHours}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSub }]}>Total Hours</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                        <MaterialCommunityIcons name="fire" size={20} color={theme.accentOrange} />
                        <Text style={[styles.statValue, { color: theme.textMain }]}>{stats.overview.streak}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSub }]}>Day Streak</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                        <MaterialCommunityIcons name="check-decagram" size={20} color={theme.accentGreen} />
                        <Text style={[styles.statValue, { color: theme.textMain }]}>{stats.overview.completionRate}</Text>
                        <Text style={[styles.statLabel, { color: theme.textSub }]}>Tasks Done</Text>
                    </View>
                </View>

                {/* RECENT HISTORY */}
                <View style={[styles.recentSection, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
                    <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Recent Reports</Text>
                    <FlatList
                        data={stats.recentReports}
                        keyExtractor={item => item.id}
                        renderItem={renderReportItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MentorStudentStats;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20, flex: 1 },

    profileSection: { alignItems: 'center', marginBottom: 24 },
    avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 28, fontWeight: 'bold' },
    studentName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    studentEmail: { fontSize: 13 },

    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statBox: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginHorizontal: 4 },
    statValue: { fontSize: 22, fontWeight: 'bold', marginVertical: 6 },
    statLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },

    recentSection: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },

    historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    historyIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    historyContent: { flex: 1 },
    historyDate: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    historyTasks: { fontSize: 13 },
    historyHours: { fontSize: 15, fontWeight: '700' }
});
