import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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

const StudentDashboard = () => {
    // 1. Detect System Theme
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // 2. Define Theming (Matches your Web Design & Dark Mode preference)
    const theme = {
        // Page Background
        background: isDarkMode ? '#0F172A' : '#F3F4F6', // Deep Slate Blue vs Light Gray

        // Typography
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',

        // Card Surface
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',

        // Brand Accents (From your Web Screenshot)
        accentGreen: '#10B981',
        accentOrange: '#F59E0B',
        accentBlue: '#3B82F6',
        accentRed: '#EF4444',

        // Icon Backgrounds (Light & Transparent)
        iconBgGreen: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
        iconBgOrange: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FFF7ED',
        iconBgBlue: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
        iconBgRed: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
    };

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['userToken', 'userRole']);
        router.replace('/login');
    };

    // Helper for Date
    const getTodayDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    const [stats, setStats] = useState({
        streak: 0,
        hours: 0,
        tasksDone: '0%',
        reviews: 0,
        name: 'Student'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Basic data fetch - in a real app this would be a single aggregated endpoint
            const timetablesRes = await api.get('/student/timetable/history');
            const reportsRes = await api.get('/api/reports/history');

            const feedbackRes = await api.get('/api/feedback/my-feedback');
            const reviewsCount = feedbackRes.data ? feedbackRes.data.length : 0;

            let totalHours = 0;
            if (reportsRes.data) {
                reportsRes.data.forEach(r => {
                    const h = r.hours || {};
                    totalHours += (parseFloat(h.physics) || 0) + (parseFloat(h.chemistry) || 0) + (parseFloat(h.math) || 0) + (parseFloat(h.biology) || 0);
                });
            }

            // Calculate tasks done percentage from today's timetable
            let tasksDonePercent = 'N/A';
            try {
                const todayTimetableRes = await api.get('/student/timetable/today');
                if (todayTimetableRes.data && todayTimetableRes.data.timetable && todayTimetableRes.data.timetable.tasks) {
                    const tasks = todayTimetableRes.data.timetable.tasks;
                    const totalTasks = tasks.length;
                    const completedTasks = tasks.filter(t => t.isDone).length;
                    if (totalTasks > 0) {
                        tasksDonePercent = Math.round((completedTasks / totalTasks) * 100) + '%';
                    }
                }
            } catch (error) {
                console.error('Error fetching today\'s timetable:', error);
            }

            setStats({
                streak: timetablesRes.data ? timetablesRes.data.length : 0,
                hours: totalHours,
                tasksDone: tasksDonePercent,
                reviews: reviewsCount,
                name: 'Student' // To get real name we'd need a /me endpoint
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
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
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.dateText, { color: theme.textSub }]}>{getTodayDate()}</Text>
                    <Text style={[styles.welcomeText, { color: theme.textMain }]}>Welcome back!</Text>
                </View>
                <TouchableOpacity style={[styles.profileBtn, { backgroundColor: theme.cardBg }]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={theme.textMain} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. STATS GRID (The 4 Web Stats adapted for Mobile) */}
                <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Your Progress</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Day Streak"
                        value={String(stats.streak)}
                        icon="fire"
                        color={theme.accentRed}
                        bg={theme.iconBgRed}
                        theme={theme}
                    />
                    <StatCard
                        label="Total Hours"
                        value={String(stats.hours)}
                        icon="clock-time-four"
                        color={theme.accentOrange}
                        bg={theme.iconBgOrange}
                        theme={theme}
                    />
                    <StatCard
                        label="Tasks Done"
                        value={stats.tasksDone}
                        icon="check-circle"
                        color={theme.accentGreen}
                        bg={theme.iconBgGreen}
                        theme={theme}
                    />
                    <StatCard
                        label="New Reviews"
                        value={String(stats.reviews)}
                        icon="message-text"
                        color={theme.accentBlue}
                        bg={theme.iconBgBlue}
                        theme={theme}
                    />
                </View>

                {/* 2. MAIN ACTIONS (The 4 Big Cards) */}
                <Text style={[styles.sectionTitle, { color: theme.textMain, marginTop: 24 }]}>Quick Actions</Text>

                <ActionCard
                    title="Make Timetable"
                    subtitle="Create your daily study schedule"
                    icon="calendar-edit"
                    iconColor={theme.accentGreen}
                    iconBg={theme.iconBgGreen}
                    theme={theme}
                    onPress={() => router.push('/make-timetable')}
                />

                <ActionCard
                    title="Report Work Daily"
                    subtitle="Log your study hours & tasks"
                    icon="clipboard-text"
                    iconColor={theme.accentOrange}
                    iconBg={theme.iconBgOrange}
                    theme={theme}
                    onPress={() => router.push('/report-daily')}
                />

                <ActionCard
                    title="View Past Timetables"
                    subtitle="Track your consistency over time"
                    icon="history"
                    iconColor={theme.accentBlue}
                    iconBg={theme.iconBgBlue}
                    theme={theme}
                    onPress={() => router.push('/past-timetables')}
                />

                <ActionCard
                    title="Review From Mentor"
                    subtitle="View feedback on your work"
                    icon="comment-quote"
                    iconColor="#8B5CF6" // Purple for distinction
                    iconBg={isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF'}
                    theme={theme}
                    onPress={() => router.push('/mentor-reviews')}
                />

                <ActionCard
                    title="AI Study Insights"
                    subtitle="Get personalized AI recommendations"
                    icon="robot-excited-outline"
                    iconColor="#EC4899" // Pink for AI
                    iconBg={isDarkMode ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3'}
                    theme={theme}
                    onPress={() => router.push('/ai-insights')}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// --- COMPONENT: STAT CARD (Small Square) ---
const StatCard = ({ label, value, icon, color, bg, theme }) => (
    <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
        <View style={[styles.statIconBox, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.statValue, { color: theme.textMain }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.textSub }]}>{label}</Text>
    </View>
);

// --- COMPONENT: ACTION CARD (Wide Rectangle) ---
const ActionCard = ({ title, subtitle, icon, iconColor, iconBg, theme, onPress }) => (
    <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: theme.cardBg }]}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <View style={[styles.actionIconBox, { backgroundColor: iconBg }]}>
            <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
        </View>
        <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: theme.textMain }]}>{title}</Text>
            <Text style={[styles.actionSubtitle, { color: theme.textSub }]}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textSub} />
    </TouchableOpacity>
);

export default StudentDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },

    // Grid Layout for Stats
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%', // Fits 2 per row
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
    },

    // List Layout for Actions
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
        paddingRight: 8,
    },
    actionTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
});