// src/screens/LoginScreen.js
import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import Loading from '../components/Loading';
import { useUserStore } from '../store/userStore';
import { storeData } from '../store/LocalStorage';
import { Platform } from 'react-native';
import { API_URL, API_KEY, MAIN_URL } from '@env';

const LoginScreen = ({ navigation }) => {

    //     const URL = Platform.OS === 'android' && !__DEV__
    //   ? ANDROID_URL // Replace with your actual IP address
    //   : API_URL; // For the emulator


    const { setUser, setAccessToken } = useUserStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(false); // Stop loading initially
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Basic validation
        // if (email === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Email is required' });
        if (!emailRegex.test(email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (password === '') return Toast.show({ type: 'error', text1: 'Password is required' });
        // if (password.length < 3) return Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });

        try {
            setLoading(true);
            const response = await axios.post(`http://192.168.1.6:8000/api/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers here
                }
            });
            const userData = response.data;
            if (response && response.status === 200) {
                setUser(userData.user); // Save user data in your store
                setAccessToken(userData.token); // Save user data in your store
                Toast.show({ type: 'success', text1: 'Login Successful!' });
                await storeData('accessToken', userData.token)
                await storeData('user', userData.user)
                setTimeout(() => {
                    if (userData.user.type === 'general_service') {
                        navigation.navigate('MainApp'); // Navigate to MainApp if successful
                    } else if (userData.user.type === 'faculty') {
                        navigation.navigate('FacultyApp'); // Navigate to MainApp if successful
                    } else {
                        navigation.navigate('WorkerApp')
                    }
                }, 1500)

            } else {
                setErrorMessage('Invalid login credentials.');
                Toast.show({ type: 'error', text1: 'Error', text2: 'Invalid login credentials' });
            }

        } catch (error) {
            console.log(error)
            Toast.show({ type: 'error', text1: 'Error', text2: error.response.data.message });
        } finally {
            setTimeout(() => {
                setLoading(false); // Stop loading
            }, 1000)
        }
    };

    return (
        <View className="flex-1 justify-center items-center">
            <View>

            </View>
            {/* Email input */}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
            />
            {/* Password input */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                secureTextEntry
            />

            {/* Login button */}
            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-500 w-5/6 p-4 rounded-lg items-center shadow-lg"
            >
                <Text className="text-white text-lg font-bold">Login</Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                className="mt-4"
            >
                <Text>Don't have an account?
                    <Text className="text-blue-500 underline"> Sign up</Text>
                </Text>
            </TouchableOpacity>

            {loading && <Loading />}
            <Toast />
        </View>
    );
};

export default LoginScreen;
