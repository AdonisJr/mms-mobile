// src/screens/LoginScreen.js
import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import Loading from '../components/Loading';
import { useUserStore } from '../store/userStore';
import { storeData } from '../store/LocalStorage';
import { Platform } from 'react-native';
import { API_URL, API_KEY, MAIN_URL, PROJECT_ID } from '@env'; // Import your project ID
import * as Notifications from 'expo-notifications'; // Import Notifications
import { AntDesign, FontAwesome } from '@expo/vector-icons'; // Import Expo Vector Icons

const LoginScreen = ({ navigation }) => {
    const { setUser, setAccessToken } = useUserStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(false); // Stop loading initially
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Basic validation
        if (!emailRegex.test(email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (password === '') return Toast.show({ type: 'error', text1: 'Password is required' });

        try {
            setLoading(true);
            // Get the Expo push token
            const token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;

            console.log(token);
            const response = await axios.post(`${API_URL}/login`, {
                email: email,
                password: password,
                expo_push_token: token // Send the token here
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const userData = response.data;
            if (response && response.status === 200) {
                setUser(userData.user); // Save user data in your store
                setAccessToken(userData.token); // Save user data in your store
                Toast.show({ type: 'success', text1: 'Login Successful!' });
                await storeData('accessToken', userData.token);
                await storeData('user', userData.user);
                console.log(userData)
                setTimeout(() => {
                    if (userData.user?.type === 'general_service') {
                        navigation.navigate('MainApp'); // Navigate to MainApp if successful
                    } else if (userData.user?.type === 'faculty') {
                        navigation.navigate('FacultyApp'); // Navigate to FacultyApp
                    } else {
                        navigation.navigate('WorkerApp'); // Navigate to WorkerApp
                    }
                }, 1500);
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Invalid login credentials' });
            }
        } catch (error) {
            console.log(error.response.data.message);
            Toast.show({ type: 'error', text1: 'Error', text2: error.response.data.message });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-6">
            {/* Email input */}
            <View className="flex-row items-center bg-white w-full p-4 mb-4 rounded-lg shadow-md">
                <AntDesign name="mail" size={20} color="gray" />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 ml-2 text-lg"
                    autoCapitalize="none"
                />
            </View>

            {/* Password input */}
            <View className="flex-row items-center bg-white w-full p-4 mb-6 rounded-lg shadow-md">
                <FontAwesome name="lock" size={20} color="gray" />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 ml-2 text-lg"
                    secureTextEntry
                />
            </View>

            {/* Login button */}
            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-500 w-full p-4 rounded-lg items-center shadow-lg"
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
