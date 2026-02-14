import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- MOCK DATA (To visualize the design) ---
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Physics - Mechanics',
    time: '06:00 - 08:00',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Chemistry - Organic',
    time: '08:30 - 10:30',
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Mathematics - Calculus',
    time: '11:00 - 13:00',
    isCompleted: false,
  },
];

const MakeTimetableScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // --- THEME DEFINITION ---
  const theme = {
    background: isDarkMode ? '#0F172A' : '#F3F4F6',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#111827',
    textSub: isDarkMode ? '#94A3B8' : '#6B7280',
    primaryGreen: '#10B981',
    // Background for completed tasks
    completedTaskBg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
    borderColor: isDarkMode ? '#334155' : '#E5E7EB',
  };

  // Get today's date in the desired format
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;

  // --- RENDER ITEM FOR FLATLIST ---
  const renderTaskItem = ({ item }) => {
    return (
      <View
        style={[
          styles.taskCard,
          {
            backgroundColor: item.isCompleted ? theme.completedTaskBg : theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        {/* 1. CHECKBOX & TASK DETAILS */}
        <View style={styles.taskLeft}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => console.log('Toggle Task', item.id)}>
            <Ionicons
              name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={item.isCompleted ? theme.primaryGreen : theme.textSub}
            />
          </TouchableOpacity>

          <View style={styles.taskTextContainer}>
            <Text
              style={[
                styles.taskTitle,
                {
                  color: theme.textMain,
                  textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                  opacity: item.isCompleted ? 0.6 : 1,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text style={[styles.taskTime, { color: theme.textSub }]}>{item.time}</Text>
          </View>
        </View>

        {/* 2. ACTION ICONS (Edit / Delete) */}
        <View style={styles.taskActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('Edit', item.id)}>
            <MaterialCommunityIcons name="pencil-outline" size={22} color={theme.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('Delete', item.id)}>
            <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.accentRed || '#EF4444'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.contentContainer}>
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textMain} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: theme.textMain }]}>Make Timetable</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSub }]}>Plan your study schedule for today</Text>
          </View>
        </View>

        {/* --- DATE & ADD BUTTON BAR --- */}
        <View style={[styles.dateBar, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
          <View>
            <Text style={[styles.dateLabel, { color: theme.textSub }]}>Today&apos;s Date</Text>
            <Text style={[styles.dateValue, { color: theme.textMain }]}>{getFormattedDate()}</Text>
          </View>
          <TouchableOpacity style={[styles.addTaskBtn, { backgroundColor: theme.primaryGreen }]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addTaskText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* --- TASK LIST SECTION --- */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.textMain }]}>Today&apos;s Tasks</Text>
          <Text style={[styles.listProgress, { color: theme.textSub }]}>
            {completedCount}/{tasks.length} completed
          </Text>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* --- FLOATING SUBMIT BUTTON --- */}
      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: theme.primaryGreen }]}>
        <MaterialCommunityIcons name="send-check-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.submitText}>Submit Timetable</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MakeTimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  // Date Bar Styles
  dateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addTaskText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },

  // List Header Styles
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listProgress: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80, // Space for floating button
  },

  // Task Card Styles
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 13,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 8,
  },

  // Floating Submit Button Styles
  submitBtn: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});