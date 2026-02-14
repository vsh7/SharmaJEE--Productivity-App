import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReportWorkScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  // --- STATE FOR INPUTS ---
  const [hours, setHours] = useState({
    physics: '',
    chemistry: '',
    math: '',
    biology: ''
  });
  const [tasks, setTasks] = useState('');
  const [notes, setNotes] = useState('');
  const [totalHours, setTotalHours] = useState(0);

  // --- THEME CONFIGURATION ---
  const theme = {
    background: isDarkMode ? '#0F172A' : '#F9FAFB',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#111827',
    textSub: isDarkMode ? '#94A3B8' : '#6B7280',
    borderColor: isDarkMode ? '#334155' : '#E5E7EB',
    inputBg: isDarkMode ? '#334155' : '#F3F4F6', // Slightly darker input bg
    primaryGreen: '#10B981',
    bannerBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FFF7ED',
    bannerBorder: isDarkMode ? '#78350F' : '#FFEDD5',
    bannerText: isDarkMode ? '#FCD34D' : '#9A3412',
  };

  // --- CALCULATE TOTAL HOURS AUTOMATICALLY ---
  useEffect(() => {
    const p = parseFloat(hours.physics) || 0;
    const c = parseFloat(hours.chemistry) || 0;
    const m = parseFloat(hours.math) || 0;
    const b = parseFloat(hours.biology) || 0;
    setTotalHours(p + c + m + b);
  }, [hours]);

  const handleHourChange = (subject, value) => {
    // Only allow numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setHours(prev => ({ ...prev, [subject]: value }));
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textMain} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Report Work Daily</Text>
          <Text style={[styles.headerSub, { color: theme.textSub }]}>Log your study progress for today</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 1. REMINDER BANNER */}
          <View style={[styles.banner, { backgroundColor: theme.bannerBg, borderColor: theme.bannerBorder }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={22} color={theme.bannerText} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: theme.bannerText }]}>Daily Reminder Active</Text>
              <Text style={[styles.bannerText, { color: theme.bannerText, opacity: 0.8 }]}>
                You&apos;ll receive a reminder at 9 PM if report isn&apos;t submitted.
              </Text>
            </View>
          </View>

          {/* 2. HOURS DEDICATED CARD */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="clock-time-four-outline" size={20} color={theme.textMain} />
              <Text style={[styles.cardTitle, { color: theme.textMain }]}> Hours Dedicated</Text>
            </View>
            <Text style={[styles.cardSub, { color: theme.textSub }]}>Enter the hours you spent on each subject</Text>

            {/* Date Field (Read Only) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSub }]}>Date</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.borderColor }]}>
                <Text style={{ color: theme.textMain }}>{getTodayDate()}</Text>
                <MaterialCommunityIcons name="calendar" size={18} color={theme.textSub} />
              </View>
            </View>

            {/* Subjects Grid */}
            <View style={styles.gridContainer}>
              {/* Physics */}
              <SubjectInput
                label="Physics"
                icon="atom"
                value={hours.physics}
                onChange={(v) => handleHourChange('physics', v)}
                theme={theme}
              />
              {/* Chemistry */}
              <SubjectInput
                label="Chemistry"
                icon="flask-outline"
                value={hours.chemistry}
                onChange={(v) => handleHourChange('chemistry', v)}
                theme={theme}
              />
              {/* Math */}
              <SubjectInput
                label="Mathematics"
                icon="calculator"
                value={hours.math}
                onChange={(v) => handleHourChange('math', v)}
                theme={theme}
              />
              {/* Biology */}
              <SubjectInput
                label="Biology (NEET)"
                icon="dna"
                value={hours.biology}
                onChange={(v) => handleHourChange('biology', v)}
                theme={theme}
              />
            </View>

            {/* Total Display */}
            <View style={[styles.totalBox, { backgroundColor: theme.inputBg }]}>
              <Text style={[styles.totalLabel, { color: theme.textSub }]}>Total Hours Today</Text>
              <Text style={[styles.totalValue, { color: theme.primaryGreen }]}>{totalHours}</Text>
            </View>
          </View>

          {/* 3. TASKS COMPLETED CARD */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.textMain }]}>Tasks Completed</Text>
            </View>
            <Text style={[styles.cardSub, { color: theme.textSub, marginBottom: 12 }]}>List the tasks you completed today</Text>

            {/* Completed Tasks Input */}
            <Text style={[styles.label, { color: theme.textSub }]}>Completed Tasks</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
              placeholder="e.g., Solved 50 physics numericals, Completed organic chemistry chapter..."
              placeholderTextColor={theme.textSub}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={tasks}
              onChangeText={setTasks}
            />

            {/* Additional Notes Input */}
            <Text style={[styles.label, { color: theme.textSub, marginTop: 16 }]}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
              placeholder="Any challenges faced, areas to improve, or notes for your mentor..."
              placeholderTextColor={theme.textSub}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primaryGreen }]}
            activeOpacity={0.8}
            onPress={() => console.log("Submit Report")}
          >
            <MaterialCommunityIcons name="send-check-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.submitText}>Submit Daily Report</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- HELPER COMPONENT: SUBJECT INPUT ---
const SubjectInput = ({ label, icon, value, onChange, theme }) => (
  <View style={styles.gridItem}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <MaterialCommunityIcons name={icon} size={14} color={theme.textSub} style={{ marginRight: 4 }} />
      <Text style={[styles.miniLabel, { color: theme.textSub }]}>{label}</Text>
    </View>
    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.borderColor }]}>
      <TextInput
        style={{ flex: 1, color: theme.textMain, fontWeight: '600' }}
        placeholder="0"
        placeholderTextColor={theme.textSub}
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
      />
      <Text style={{ fontSize: 12, color: theme.textSub }}>hrs</Text>
    </View>
  </View>
);

export default ReportWorkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
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
    fontSize: 13,
  },
  scrollContent: {
    padding: 20,
  },

  // Banner
  banner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    lineHeight: 18,
  },

  // Cards
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    marginBottom: 16,
  },

  // Inputs
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // 2 columns
    marginBottom: 16,
  },

  // Total Box
  totalBox: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  // Text Areas
  textArea: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    minHeight: 80,
  },

  // Submit Button
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});