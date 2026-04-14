import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import useAuth from '../hooks/useAuth';
import AuthWrapper from './AuthWrapper';
import AuthLogin from './AuthLogin';
import { useAppTheme } from "../../../context/ThemeContext";

// Images
import logo from '../../../assets/acaciaLogo.svg';
import acaciaDark from '../../../assets/AcaciaDark.svg';

export default function Login() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
const [renderCount, setRenderCount] = useState(0);
  const { tokens } = useAppTheme();
  // Get auth param from route params (similar to useSearchParams)
  const auth = route.params?.auth || null;
  // Track renders
  // React.useEffect(() => {
  //   setRenderCount(prev => prev + 1);
  //   console.log("📱 Login component rendered", renderCount + 1, "times");
  // });
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterNavigation = () => {
    if (isLoggedIn) {
      navigation.navigate('Register');
    } else if (auth) {
      navigation.navigate('Register', { auth: 'jwt' });
    } else {
      navigation.navigate('Register');
    }
  };

  return (
    <AuthWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: tokens.background }]}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: tokens.background }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image 
                source={logo} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Image 
                source={acaciaDark}
                style={styles.textImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: tokens.heading }]}>Welcome Back,</Text>
          </View>

          {/* Login and Register Section */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: tokens.text }]}>Login in to your account</Text>
            <TouchableOpacity onPress={handleRegisterNavigation}>
            </TouchableOpacity>
          </View>

          {/* Auth Form Section */}
          <View style={styles.formContainer}>
            <AuthLogin isDemo={isLoggedIn} showPassword={showPassword} onTogglePassword={handleClickShowPassword}   key="auth-login"/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  textImage: {
    width: 100,
    height: 30,
  },
  welcomeContainer: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  formContainer: {
    flex: 1,
  },
});

