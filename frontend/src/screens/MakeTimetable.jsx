import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
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
import { v4 as uuidv4 } from 'uuid';
import api from '../api';

const MakeTimetableScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states for Add/Edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskEndTime, setTaskEndTime] = useState('');
  const [timetableId, setTimetableId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/student/timetable/today');
      // Set tasks if a timetable for today exists, else empty array
      if (response.data && response.data.timetable && response.data.timetable.tasks) {
        setTasks(response.data.timetable.tasks);
        setTimetableId(response.data.timetable._id);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const completedCount = tasks.filter(t => t.isDone).length;

  const handleSaveTimetable = async () => {
    try {
      if (tasks.length === 0) {
        Alert.alert("Validation Error", "Please add at least one task");
        return;
      }
      setIsLoading(true);
      await api.post('/student/timetable', { date: new Date().toISOString(), tasks });
      Alert.alert("Success", "Timetable saved successfully!");
      fetchTasks();
    } catch (error) {
      console.error('Error saving timetable:', error);
      Alert.alert("Error", "Failed to save timetable");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskTime('');
    setTaskEndTime('');
    setIsModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task._id || task.id || uuidv4());
    setTaskTitle(task.title);
    setTaskTime(task.startTime || '');
    setTaskEndTime(task.endTime || '');
    setIsModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle || !taskTime) {
      Alert.alert("Validation Error", "Please fill in both fields");
      return;
    }

    if (editingTaskId) {
      // Edit exists locally
      setTasks(tasks.map(t => (t._id === editingTaskId || t.id === editingTaskId) ? { ...t, title: taskTitle, startTime: taskTime, endTime: taskEndTime } : t));
    } else {
      // Add new locally
      const newTask = {
        title: taskTitle,
        startTime: taskTime,
        endTime: taskEndTime,
        isDone: false,
        id: uuidv4()
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalVisible(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => (t._id !== taskId && t.id !== taskId)));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(t => (t._id === taskId || t.id === taskId) ? { ...t, isDone: !t.isDone } : t));
  };

  // --- RENDER ITEM FOR FLATLIST ---
  const renderTaskItem = ({ item }) => {
    return (
      <View
        style={[
          styles.taskCard,
          {
            backgroundColor: item.isDone ? theme.completedTaskBg : theme.cardBg,
            borderColor: theme.borderColor,
          },
        ]}
      >
        {/* 1. CHECKBOX & TASK DETAILS */}
        <View style={styles.taskLeft}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => toggleTaskCompletion(item._id || item.id)}>
            <Ionicons
              name={item.isDone ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={item.isDone ? theme.primaryGreen : theme.textSub}
            />
          </TouchableOpacity>

          <View style={styles.taskTextContainer}>
            <Text
              style={[
                styles.taskTitle,
                {
                  color: theme.textMain,
                  textDecorationLine: item.isDone ? 'line-through' : 'none',
                  opacity: item.isDone ? 0.6 : 1,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text style={[styles.taskTime, { color: theme.textSub }]}>{item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</Text>
          </View>
        </View>

        {/* 2. ACTION ICONS (Edit / Delete) */}
        <View style={styles.taskActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(item)}>
            <MaterialCommunityIcons name="pencil-outline" size={22} color={theme.textSub} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteTask(item._id || item.id)}>
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
          <TouchableOpacity style={[styles.addTaskBtn, { backgroundColor: theme.primaryGreen }]} onPress={openAddModal}>
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
          keyExtractor={item => item._id || item.id || uuidv4()}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* --- FLOATING SUBMIT BUTTON --- */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: isLoading ? '#9CA3AF' : theme.primaryGreen }]}
        onPress={handleSaveTimetable}
        disabled={isLoading}
      >
        <MaterialCommunityIcons name="send-check-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.submitText}>{isLoading ? 'Saving...' : (timetableId ? 'Update Timetable' : 'Submit Timetable')}</Text>
      </TouchableOpacity>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.textMain }]}>{editingTaskId ? 'Edit Task' : 'Add New Task'}</Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.textMain }]}
              placeholder="Task Title (e.g., Physics - Mechanics)"
              placeholderTextColor={theme.textSub}
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.textMain }]}
              placeholder="Start Time (e.g., 06:00)"
              placeholderTextColor={theme.textSub}
              value={taskTime}
              onChangeText={setTaskTime}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.textMain }]}
              placeholder="End Time (e.g., 08:00)"
              placeholderTextColor={theme.textSub}
              value={taskEndTime}
              onChangeText={setTaskEndTime}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.primaryGreen }]} onPress={handleSaveTask}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});