import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Brand Name */}
                <Text style={styles.brandText}>SharmaJEE Productivity</Text>
                
                {/* Main Heading */}
                <Text style={styles.heading}>Create an account</Text>
                
                {/* Sub Heading */}
                <Text style={styles.subHeading}>Enter your email to sign up</Text>
                
                {/* Email Input */}
                <TextInput
                    placeholder='Enter your email'
                    placeholderTextColor="#9CA3AF"
                    keyboardType='email-address'
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                /> 
                
                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder='Enter your password'
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                
                {/* OR Divider */}
                <Text style={styles.orText}>or</Text>
                
                {/* Social Button (Google) */}
                <TouchableOpacity style={styles.socialButton}>
                    <Text style={styles.socialText}>Continue with Google</Text>
                </TouchableOpacity>
                
                {/* Footer Terms */}
                <Text style={styles.footerText}>
                    By clicking continue you agree to our Terms of Service and Privacy Policy
                </Text>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  
  brandText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 12,
  },

 
  heading: {
    fontSize: 32, 
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  subHeading: {
    fontSize: 16,
    color: "#6B7280", 
    marginBottom: 32,
  },

  
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB", 
    borderRadius: 12, 
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },

 
  orText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 14,
    color: "#9CA3AF",
  },

  
  socialButton: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  
  footerText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 20,
    paddingHorizontal: 20, 
  },
});