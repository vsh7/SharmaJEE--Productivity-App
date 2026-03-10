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

const MentorDashboard = () => {
    // 1. Detect System Theme
    const isDarkMode = useColorScheme() === 'dark';
    const router = useRouter();

    // 2. Define Theming (Matches the Student Design)
    const theme = {
        background: isDarkMode ? '#0F172A' : '#F3F4F6',
        textMain: isDarkMode ? '#FFFFFF' : '#111827',
        textSub: isDarkMode ? '#94A3B8' : '#6B7280',
        cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
        accentGreen: '#10B981',
        accentOrange: '#F59E0B',
        accentBlue: '#3B82F6',
        accentPurple: '#8B5CF6',
        iconBgGreen: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
        iconBgOrange: isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FFF7ED',
        iconBgBlue: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
        iconBgPurple: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF',
    };

    const [overview, setOverview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['userToken', 'userRole']);
        router.replace('/login');
    };

    const getTodayDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await api.get('/api/mentor/overview');
                setOverview(res.data);
            } catch (error) {
                console.error('Error fetching mentor overview:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, []);

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
                    <Text style={[styles.welcomeText, { color: theme.textMain }]}>Welcome, Mentor!</Text>
                </View>
                <TouchableOpacity style={[styles.profileBtn, { backgroundColor: theme.cardBg }]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={theme.textMain} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 1. STATS GRID */}
                <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Overview Today</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Active Students"
                        value={String(overview?.activeStudents ?? 0)}
                        icon="account-group"
                        color={theme.accentBlue}
                        bg={theme.iconBgBlue}
                        theme={theme}
                    />
                    <StatCard
                        label="Reports Submitted"
                        value={String(overview?.reportsToday ?? 0)}
                        icon="clipboard-text"
                        color={theme.accentGreen}
                        bg={theme.iconBgGreen}
                        theme={theme}
                    />
                    <StatCard
                        label="Pending Feedback"
                        value={String(overview?.pendingFeedback ?? 0)}
                        icon="message-alert"
                        color={theme.accentOrange}
                        bg={theme.iconBgOrange}
                        theme={theme}
                    />
                    <StatCard
                        label="Timetables Set"
                        value={String(overview?.timetablesToday ?? 0)}
                        icon="calendar-check"
                        color={theme.accentPurple}
                        bg={theme.iconBgPurple}
                        theme={theme}
                    />
                </View>

                {/* 2. MAIN ACTIONS */}
                <Text style={[styles.sectionTitle, { color: theme.textMain, marginTop: 24 }]}>Mentor Actions</Text>

                <ActionCard
                    title="Student Daily Reports"
                    subtitle="Review work and provide feedback"
                    icon="clipboard-text-search"
                    iconColor={theme.accentOrange}
                    iconBg={theme.iconBgOrange}
                    theme={theme}
                    onPress={() => router.push('/mentor/students-work')}
                />

                <ActionCard
                    title="Student Timetables"
                    subtitle="View today's plans set by students"
                    icon="calendar-multiselect"
                    iconColor={theme.accentGreen}
                    iconBg={theme.iconBgGreen}
                    theme={theme}
                    onPress={() => router.push('/mentor/students-timetables')}
                />

                <ActionCard
                    title="Student Analytics"
                    subtitle="View performance and consistency stats"
                    icon="chart-bar"
                    iconColor={theme.accentBlue}
                    iconBg={theme.iconBgBlue}
                    theme={theme}
                    onPress={() => router.push('/mentor/student-stats')}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// --- COMPONENT: STAT CARD ---
const StatCard = ({ label, value, icon, color, bg, theme }) => (
    <View style={[styles.statCard, { backgroundColor: theme.cardBg }]}>
        <View style={[styles.statIconBox, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.statValue, { color: theme.textMain }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.textSub }]}>{label}</Text>
    </View>
);

// --- COMPONENT: ACTION CARD ---
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

export default MentorDashboard;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    welcomeText: { fontSize: 24, fontWeight: 'bold' },
    dateText: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    profileBtn: {
        width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    },
    scrollContent: { paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statCard: {
        width: '48%', padding: 16, borderRadius: 20, marginBottom: 16,
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
    },
    statIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    statLabel: { fontSize: 13 },

    actionCard: {
        flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 16,
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    },
    actionIconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    actionContent: { flex: 1, paddingRight: 8 },
    actionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
    actionSubtitle: { fontSize: 13, lineHeight: 18 },
});
