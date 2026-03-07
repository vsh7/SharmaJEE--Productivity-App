import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
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

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. New State for Toggle
  const [userType, setUserType] = useState('student');

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const theme = {
    mainBg: isDarkMode ? '#111827' : '#FFFFFF',
    headerBg: isDarkMode ? '#0F172A' : '#172554', // Your Blue
    cardBg: isDarkMode ? '#1F2937' : '#FFFFFF',
    textPrimary: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
    inputBg: isDarkMode ? '#374151' : '#FAFAFA',
    inputBorder: isDarkMode ? '#4B5563' : '#E5E7EB',
    placeholder: '#9CA3AF',
    btnPrimaryBg: isDarkMode ? '#FFFFFF' : '#000000',
    btnPrimaryText: isDarkMode ? '#000000' : '#FFFFFF',
    btnSocialBg: isDarkMode ? '#1F2937' : '#FFFFFF',
    btnSocialBorder: isDarkMode ? '#4B5563' : '#E5E7EB',
    btnSocialText: isDarkMode ? '#FFFFFF' : '#000000',
    divider: isDarkMode ? '#4B5563' : '#E5E7EB',
  };

  return (
    // FIX 2: Set root background to theme.cardBg (White/Gray)
    // This ensures that when the keyboard pushes content up, the bottom area remains white, not blue.
    <View style={[styles.mainContainer, { backgroundColor: theme.cardBg }]}>

      <StatusBar barStyle="light-content" backgroundColor={theme.headerBg} />

      {/* Absolute Blue Header - Keeps your design intact */}
      <View style={[styles.blueHeaderBackground, { backgroundColor: theme.headerBg }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // Using 'padding' for iOS and 'height' for Android usually gives the best "no hide" result
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* Logo and App Name (Kept EXACTLY as provided) */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Darkmode.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandText}>SharmaJEE Productivity</Text>
        </View>

        {/* Form Section */}
        <View style={[styles.contentContainer, { backgroundColor: theme.cardBg }]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.heading, { color: theme.textPrimary }]}>Create an account</Text>
            <Text style={[styles.subHeading, { color: theme.textSecondary }]}>Enter your email to sign up</Text>

            {/* --- NEW ADDITION: Student/Mentor Toggle --- */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>I am a</Text>
            <View style={styles.toggleContainer}>
              {/* Student Button */}
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  userType === 'student'
                    ? { backgroundColor: theme.headerBg, borderColor: theme.headerBg } // Active: Blue
                    : { backgroundColor: theme.inputBg, borderColor: theme.inputBorder } // Inactive: Gray
                ]}
                onPress={() => setUserType('student')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.toggleText,
                  userType === 'student' ? { color: '#FFFFFF' } : { color: theme.textPrimary }
                ]}>
                  Student
                </Text>
              </TouchableOpacity>

              <View style={{ width: 12 }} />

              {/* Mentor Button */}
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  userType === 'mentor'
                    ? { backgroundColor: theme.headerBg, borderColor: theme.headerBg }
                    : { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }
                ]}
                onPress={() => setUserType('mentor')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.toggleText,
                  userType === 'mentor' ? { color: '#FFFFFF' } : { color: theme.textPrimary }
                ]}>
                  Mentor
                </Text>
              </TouchableOpacity>
            </View>
            {/* ------------------------------------------- */}

            <TextInput
              placeholder='Enter your email'
              placeholderTextColor={theme.placeholder}
              style={[styles.input, {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textPrimary
              }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.textPrimary
              }]}
              placeholder='Enter your password'
              placeholderTextColor={theme.placeholder}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.btnPrimaryBg }]}
              onPress={() => {
                if (userType === 'mentor') {
                  router.replace('/mentor/dashboard');
                } else {
                  router.replace('/dashboard');
                }
              }}
            >
              <Text style={[styles.primaryButtonText, { color: theme.btnPrimaryText }]}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
              <Text style={styles.orText}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
            </View>

            <TouchableOpacity style={[styles.socialButton, {
              backgroundColor: theme.btnSocialBg,
              borderColor: theme.btnSocialBorder
            }]}>
              <Text style={[styles.socialText, { color: theme.btnSocialText }]}>Continue with Google</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By clicking continue you agree to our Terms of Service and Privacy Policy
            </Text>

          </ScrollView>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  blueHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },

  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 110, // Kept exactly as provided
    paddingBottom: 60,
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingTop: 20
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },

  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
    marginTop: 20,
  },

  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    flexGrow: 1,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 15,
    marginBottom: 20, // Reduced slightly to fit toggle better
  },

  // --- New Toggle Styles ---
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // -------------------------

  input: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  primaryButton: {
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#9CA3AF',
  },

  socialButton: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
});