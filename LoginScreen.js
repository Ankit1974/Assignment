import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // For navigation
import axios from 'axios'; // Make sure to install axios
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  
  // State variables for email, password, and password visibility
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });
  
      if (response.data.token) {
        Alert.alert('Login Successful', 'You are logged in!');
        await AsyncStorage.setItem('isLoggedIn', 'true'); // Save login state
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };


  return (
    <View style={styles.container}>
      
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={{ uri: 'https://example.com/illustration.png' }}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Login Header */}
      <Text style={styles.loginHeader}>Login</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="email-outline" size={24} color="#6e6e6e" style={styles.inputIcon} />
          <TextInput
            placeholder="Email ID"
            style={styles.textInput}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail} // Update email state
          />
        </View>
        <View style={styles.separator} />

        <View style={styles.inputWrapper}>
          <Icon name="lock-outline" size={26} color="#6e6e6e" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword} // Update password state
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconWrapper}>
            <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={27} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>OR</Text>

      {/* Register Link */}
      <Text style={styles.registerText}>
        New to Logistics?{' '}
        <Text style={styles.registerLink}>Register</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    height: height,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  illustration: {
    width: width * 0.6,
    height: height * 0.25,
  },
  loginHeader: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginBottom: height * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.003,
    paddingHorizontal: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  inputIcon: {
    marginRight: width * 0.04,
    marginLeft: -7,
  },
  textInput: {
    flex: 1,
    height: height * 0.05,
  },
  eyeIconWrapper: {
    marginLeft: width * 0.03,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'blue',
    fontSize: width * 0.04,
    marginBottom: height * 0.045,
    marginRight: 15,
  },
  loginButton: {
    backgroundColor: 'blue',
    borderRadius: 14,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#6e6e6e',
    marginVertical: height * 0.03,
  },
  registerText: {
    textAlign: 'center',
    marginTop: height * 0.02,
    color: 'black',
    fontSize:15
  },
  registerLink: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize:15
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 0,
    marginLeft: 50,
    marginBottom: 25,
    marginRight: 15,
  },
});

export default LoginScreen;

