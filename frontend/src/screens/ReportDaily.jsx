import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import api from '../api';

const ReportWorkScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  // --- STATE FOR INPUTS ---
  const [timeSlots, setTimeSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states for Add/Edit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [slotSubject, setSlotSubject] = useState('physics');
  const [slotDescription, setSlotDescription] = useState('');

  const subjectsList = [
    { label: 'Physics', value: 'physics', icon: 'atom' },
    { label: 'Chemistry', value: 'chemistry', icon: 'flask-outline' },
    { label: 'Math', value: 'math', icon: 'calculator' },
    { label: 'Biology', value: 'biology', icon: 'dna' }
  ];

  useEffect(() => {
    fetchTodayReport();
  }, []);

  const fetchTodayReport = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/reports/today');
      if (response.data && response.data.timeSlots) {
        setTimeSlots(response.data.timeSlots || []);
        setNotes(response.data.notes || '');
      }
    } catch (error) {
      console.log('Error fetching today report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CALCULATE TOTAL HOURS AUTOMATICALLY ---
  useEffect(() => {
    let total = 0;
    timeSlots.forEach(slot => {
      const [startH, startM] = (slot.startTime || "00:00").split(':').map(Number);
      const [endH, endM] = (slot.endTime || "00:00").split(':').map(Number);
      
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
        let duration = (endH + endM / 60) - (startH + startM / 60);
        if (duration < 0) duration += 24;
        total += duration;
      }
    });
    setTotalHours(total);
  }, [timeSlots]);

  const handleSubmit = async () => {
    if (timeSlots.length === 0) {
      Alert.alert("Validation Error", "Please add at least one time slot for your daily report.");
      return;
    }

    if (totalHours > 24) {
      Alert.alert("Validation Error", "Total study hours cannot exceed 24 hours per day! Please adjust your time slots.");
      return;
    }

    setIsLoading(true);
    try {
      const reportData = {
        date: new Date().toISOString(),
        timeSlots: timeSlots,
        notes: notes
      };

      await api.post('/api/reports/submit', reportData);
      Alert.alert('Success', 'Daily report submitted successfully!');
      router.back();
    } catch (error) {
      console.error('Submit report error:', error);
      Alert.alert('Error', error.response?.data?.msg || 'Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSlotId(null);
    setSlotStartTime('');
    setSlotEndTime('');
    setSlotSubject('physics');
    setSlotDescription('');
    setIsModalVisible(true);
  };

  const openEditModal = (slot) => {
    setEditingSlotId(slot._id || slot.id);
    setSlotStartTime(slot.startTime || '');
    setSlotEndTime(slot.endTime || '');
    setSlotSubject(slot.subject || 'physics');
    setSlotDescription(slot.taskDescription || '');
    setIsModalVisible(true);
  };

  const handleDeleteSlot = (slotId) => {
    setTimeSlots(timeSlots.filter(s => s._id !== slotId && s.id !== slotId));
  };

  const handleSaveSlot = () => {
    if (!slotStartTime || !slotEndTime || !slotSubject) {
      Alert.alert("Validation Error", "Please fill in Start Time, End Time, and Select a Subject.");
      return;
    }

    // Basic time validation HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slotStartTime) || !timeRegex.test(slotEndTime)) {
      Alert.alert("Validation Error", "Please use HH:MM format for times (e.g., 14:30)");
      return;
    }

    const newSlot = {
      id: editingSlotId || uuidv4(),
      startTime: slotStartTime,
      endTime: slotEndTime,
      subject: slotSubject,
      taskDescription: slotDescription
    };

    if (editingSlotId) {
      setTimeSlots(timeSlots.map(s => (s._id === editingSlotId || s.id === editingSlotId) ? newSlot : s));
    } else {
      setTimeSlots([...timeSlots, newSlot]);
    }
    
    setIsModalVisible(false);
  };

  // --- THEME CONFIGURATION ---
  const theme = {
    background: isDarkMode ? '#0F172A' : '#F9FAFB',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#111827',
    textSub: isDarkMode ? '#94A3B8' : '#6B7280',
    borderColor: isDarkMode ? '#334155' : '#E5E7EB',
    inputBg: isDarkMode ? '#334155' : '#F3F4F6',
    primaryGreen: '#10B981',
    bannerBg: isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#FFF7ED',
    bannerBorder: isDarkMode ? '#78350F' : '#FFEDD5',
    bannerText: isDarkMode ? '#FCD34D' : '#9A3412',
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const getSubjectColor = (subjectValue) => {
    switch (subjectValue) {
      case 'physics': return '#3B82F6'; // Blue
      case 'chemistry': return '#F59E0B'; // Amber
      case 'math': return '#EF4444'; // Red
      case 'biology': return '#10B981'; // Green
      default: return theme.primaryGreen;
    }
  };

  const getSubjectLabel = (subjectValue) => {
    const s = subjectsList.find(s => s.value === subjectValue);
    return s ? s.label : 'Subject';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMain} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textMain }]}>Report Work Daily</Text>
          <Text style={[styles.headerSub, { color: theme.textSub }]}>Log your study time blocks</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={[styles.banner, { backgroundColor: theme.bannerBg, borderColor: theme.bannerBorder }]}>
            <MaterialCommunityIcons name="bell-ring-outline" size={22} color={theme.bannerText} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: theme.bannerText }]}>Daily Reminder Active</Text>
              <Text style={[styles.bannerText, { color: theme.bannerText, opacity: 0.8 }]}>
                You&apos;ll receive a reminder at 9 PM if report isn&apos;t submitted.
              </Text>
            </View>
          </View>

          {/* Time Slots Section */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="timeline-clock-outline" size={20} color={theme.textMain} />
                <Text style={[styles.cardTitle, { color: theme.textMain, marginLeft: 8 }]}>Time Blocks</Text>
              </View>
              <Text style={[styles.dateLabelText, { color: theme.textSub }]}>{getTodayDate()}</Text>
            </View>
            <Text style={[styles.cardSub, { color: theme.textSub }]}>Add your study time slots below</Text>

            {timeSlots.map((slot, index) => (
              <View key={slot._id || slot.id || index} style={[styles.slotItem, { borderColor: theme.borderColor }]}>
                <View style={{ width: 4, backgroundColor: getSubjectColor(slot.subject), borderRadius: 2, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.slotTime, { color: theme.textMain }]}>{slot.startTime} - {slot.endTime}</Text>
                  <Text style={[styles.slotSubject, { color: getSubjectColor(slot.subject) }]}>
                    {getSubjectLabel(slot.subject)}
                  </Text>
                  {slot.taskDescription ? (
                    <Text style={[styles.slotDesc, { color: theme.textSub }]} numberOfLines={1}>{slot.taskDescription}</Text>
                  ) : null}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => openEditModal(slot)} style={{ padding: 6 }}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.textSub} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSlot(slot._id || slot.id)} style={{ padding: 6 }}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.addSlotBtn, { borderColor: theme.primaryGreen }]} onPress={openAddModal}>
              <Ionicons name="add" size={20} color={theme.primaryGreen} />
              <Text style={[styles.addSlotText, { color: theme.primaryGreen }]}>Add Time Block</Text>
            </TouchableOpacity>

            <View style={[styles.totalBox, { backgroundColor: theme.inputBg, marginTop: 16 }]}>
              <Text style={[styles.totalLabel, { color: theme.textSub }]}>Total Hours Calculated</Text>
              <Text style={[styles.totalValue, {
                color: totalHours > 24 ? '#EF4444' : totalHours > 20 ? '#F59E0B' : theme.textMain
              }]}>{totalHours.toFixed(2)}</Text>
              {totalHours > 24 && (
                <Text style={[styles.warningText, { color: '#EF4444' }]}>⚠️ Exceeds 24 hours!</Text>
              )}
            </View>
          </View>

          {/* Notes Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.textMain }]}>Additional Notes (Optional)</Text>
            </View>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
              placeholder="Challenges faced, areas to improve..."
              placeholderTextColor={theme.textSub}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: isLoading ? '#9CA3AF' : theme.primaryGreen }]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="send-check-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.submitText}>{isLoading ? 'Saving...' : 'Submit Daily Report'}</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ADD/EDIT MODAL */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.modalTitle, { color: theme.textMain }]}>
                {editingSlotId ? 'Edit Time Block' : 'Add Time Block'}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.label, { color: theme.textSub }]}>Start Time</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
                    placeholder="HH:MM"
                    placeholderTextColor="#9CA3AF"
                    value={slotStartTime}
                    onChangeText={setSlotStartTime}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.label, { color: theme.textSub }]}>End Time</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
                    placeholder="HH:MM"
                    placeholderTextColor="#9CA3AF"
                    value={slotEndTime}
                    onChangeText={setSlotEndTime}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: theme.textSub, marginTop: 12 }]}>Subject</Text>
              <View style={styles.subjectRow}>
                {subjectsList.map(subj => (
                  <TouchableOpacity
                    key={subj.value}
                    style={[
                      styles.subjectBtn,
                      { 
                        backgroundColor: slotSubject === subj.value ? getSubjectColor(subj.value) : theme.inputBg,
                        borderColor: slotSubject === subj.value ? getSubjectColor(subj.value) : theme.borderColor
                      }
                    ]}
                    onPress={() => setSlotSubject(subj.value)}
                  >
                    <Text style={{ 
                      color: slotSubject === subj.value ? '#FFFFFF' : theme.textMain,
                      fontSize: 12,
                      fontWeight: '600'
                    }}>
                      {subj.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSub, marginTop: 16 }]}>Task Description</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.borderColor }]}
                placeholder="e.g., Mechanics Numericals"
                placeholderTextColor="#9CA3AF"
                value={slotDescription}
                onChangeText={setSlotDescription}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.inputBg, borderColor: theme.borderColor, borderWidth: 1, marginRight: 10 }]} onPress={() => setIsModalVisible(false)}>
                  <Text style={{ color: theme.textMain, fontWeight: '600', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: theme.primaryGreen }]} onPress={handleSaveSlot}>
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Save Block</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

export default ReportWorkScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 },
  backBtn: { marginRight: 16, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerSub: { fontSize: 13 },
  scrollContent: { padding: 20 },
  banner: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24, alignItems: 'flex-start' },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  bannerText: { fontSize: 12, lineHeight: 18 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { fontSize: 12, marginBottom: 16 },
  dateLabelText: { fontSize: 14, fontWeight: 'bold' },
  slotItem: { flexDirection: 'row', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10, alignItems: 'center' },
  slotTime: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  slotSubject: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  slotDesc: { fontSize: 12 },
  addSlotBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', marginTop: 8 },
  addSlotText: { fontSize: 14, fontWeight: '600', marginLeft: 6 },
  totalBox: { alignItems: 'center', padding: 16, borderRadius: 12 },
  totalLabel: { fontSize: 12, marginBottom: 4 },
  totalValue: { fontSize: 32, fontWeight: 'bold' },
  warningText: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  textArea: { borderRadius: 12, padding: 12, borderWidth: 1, minHeight: 80, marginTop: 8 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, marginTop: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { width: '100%', padding: 24, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, fontSize: 15 },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  subjectBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, width: '48%', marginBottom: 10, alignItems: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }
});