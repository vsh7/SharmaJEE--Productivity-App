import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import api from '../api';
import { registerForPushNotifications } from '../notifications';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response && response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);

        // Get user role from response
        const userRole = response.data.user?.role || 'student';
        await AsyncStorage.setItem('userRole', userRole);

        // Register push notification token
        registerForPushNotifications();

        if (userRole === 'mentor') {
          router.replace('/mentor/dashboard');
        } else {
          router.replace('/dashboard');
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message || "Login failed. Please try again.";
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={[styles.heading, { color: theme.textPrimary }]}>Welcome back</Text>
            <Text style={[styles.subHeading, { color: theme.textSecondary }]}>Enter your email to login</Text>

            {/* Email Input */}
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

            {/* Password Input */}
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
              style={[styles.primaryButton, { backgroundColor: theme.btnPrimaryBg, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[styles.primaryButtonText, { color: theme.btnPrimaryText }]}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/signup')}
            >
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Don't have an account? <Text style={[styles.linkTextBold, { color: theme.headerBg }]}>Sign Up</Text>
              </Text>
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
    marginBottom: 24,
  },

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

  linkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  linkText: {
    fontSize: 14,
  },

  linkTextBold: {
    fontWeight: '700',
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