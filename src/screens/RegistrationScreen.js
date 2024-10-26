
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'
import Toast from 'react-native-toast-message'; // Import Toast
import Loading from '../components/Loading';
import axios from 'axios';
import { API_URL, API_KEY } from '@env';

export default function RegistrationScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        gender: 'male',
        email: '',
        password: '',
        confirm_password: '',
        department: '',
        type: '',
        role: 'user'
    })

    // handle register

    const handleRegister = async () => {
        setLoading(false); // Stop loading initially
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Basic validation
        if (credentials.firstname === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'First Name is required' });
        if (credentials.lastname === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Last Name is required' });
        if (credentials.email === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Email is required' });
        if (!emailRegex.test(credentials.email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (credentials.type === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Type is required' });
        if (credentials.type === 'faculty' && credentials.department === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select department' });
        if (credentials.password === '' || credentials.password.length < 6) return Toast.show({ type: 'error', text1: 'Error', text2: 'Password must at least 6 characters' });
        if (credentials.password !== credentials.password_confirmation) return Toast.show({ type: 'error', text1: 'Error', text2: "Password does not match" });
        // return console.log(credentials)
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/register`, credentials);

            const userData = response.data;
            if (response.status === 200) {
                Toast.show({ type: 'success', text1: 'Login Successful!' });

                setTimeout(() => {
                    navigation.navigate('Login'); // Navigate to MainApp if successful
                }, 1500)

            } else {
                setErrorMessage('Invalid login credentials.');
                Toast.show({ type: 'error', text1: 'Invalid login credentials' });
            }

        } catch (error) {
            console.log(error.response.data.message)
            Toast.show({ type: 'error', text1: 'Error', text2: error.response.data.message });
        } finally {
            setTimeout(() => {
                setLoading(false); // Stop loading
            }, 1000)
        }
    }

    return (
        <ScrollView className="flex-1 bg-gray-100">
            <View className="flex-1 justify-center items-center p-4">
                {/* Logo or title */}
                <Text className="text-4xl font-bold text-blue-500 mb-10">Welcome</Text>

                {/* firstname input */}
                <TextInput
                    placeholder="First Name"
                    value={credentials.firstname}
                    onChangeText={(value) => setCredentials({ ...credentials, firstname: value })}
                    className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                    keyboardType="default"
                    autoCapitalize="none"
                />

                {/* middlename input */}
                <TextInput
                    placeholder="Middle Name"
                    value={credentials.middlename}
                    onChangeText={(value) => setCredentials({ ...credentials, middlename: value })}
                    className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                    keyboardType="default"
                    autoCapitalize="none"
                />

                {/* lastname input */}
                <TextInput
                    placeholder="Last Name"
                    value={credentials.lastname}
                    onChangeText={(value) => setCredentials({ ...credentials, lastname: value })}
                    className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                    keyboardType="default"
                    autoCapitalize="none"
                />

                {/* Email input */}
                <TextInput
                    placeholder="Email"
                    value={credentials.email}
                    onChangeText={(value) => setCredentials({ ...credentials, email: value })}
                    className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                    <Picker
                        selectedValue={credentials.gender}
                        onValueChange={(value) => setCredentials({ ...credentials, gender: value })}
                    >
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                    <Picker
                        selectedValue={credentials.type}
                        onValueChange={(value) => setCredentials({ ...credentials, type: value })}
                    >
                        <Picker.Item label="Select Type" value="" enabled={false} />

                        <Picker.Item label="Faculty" value="faculty" />
                        <Picker.Item label="General Service" value="general service" />
                        <Picker.Item label="Utility Worker" value="utility worker" />
                    </Picker>
                </View>
                {
                    credentials.type !== 'faculty' ? '' :
                        <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                            <Picker
                                selectedValue={credentials.department}
                                onValueChange={(value) => setCredentials({ ...credentials, department: value })}
                            >
                                <Picker.Item label="Select Department" value="" enabled={false} />

                                <Picker.Item label="Science" value="Science" />
                                <Picker.Item label="Mathematics" value="Mathematics" />
                                <Picker.Item label="English" value="English" />
                                <Picker.Item label="Physical Education" value="Physical Education" />
                                <Picker.Item label="Health and Nursing" value="Health and Nursing" />
                                <Picker.Item label="Library" value="Library" />
                                <Picker.Item label="Engineering" value="Engineering" />
                                <Picker.Item label="Art" value="Art" />
                                <Picker.Item label="Business" value="Business" />
                            </Picker>
                        </View>
                }


                {/* Password input */}
                <TextInput
                    placeholder="Password"
                    value={credentials.password}
                    onChangeText={(value) => setCredentials({ ...credentials, password: value })}
                    className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                    secureTextEntry
                />

                {/* Confirm Password input */}
                <TextInput
                    placeholder="Confirm Password"
                    value={credentials.password_confirmation}
                    onChangeText={(value) => setCredentials({ ...credentials, password_confirmation: value })}
                    className="bg-white w-5/6 p-4 mb-6 rounded-lg shadow-md text-lg"
                    secureTextEntry
                />

                {/* Login button */}
                <TouchableOpacity
                    onPress={handleRegister}
                    className="bg-blue-500 w-5/6 p-4 rounded-lg items-center shadow-lg"
                >
                    <Text className="text-white text-lg font-bold">Register</Text>
                </TouchableOpacity>

                {/* Sign up link */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    className="mt-4"
                >
                    <Text>Already have an account?
                        <Text className="text-blue-500 underline"> Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Loading Overlay */}
            {loading && <Loading />}
            {/* Toast Container */}
            <Toast />
        </ScrollView>
    )
}