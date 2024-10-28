import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
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
        confirm_password: '', // Use this for confirmation
        department: '',
        type: '',
        role: 'user',
    });

    // handle register
    const handleRegister = async () => {
        setLoading(false); // Start loading
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Basic validation
        if (credentials.firstname === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'First Name is required' });
        if (credentials.lastname === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Last Name is required' });
        if (credentials.email === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Email is required' });
        if (!emailRegex.test(credentials.email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (credentials.type === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Type is required' });
        if (credentials.type === 'faculty' && credentials.department === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select department' });
        if (credentials.password === '' || credentials.password.length < 6) return Toast.show({ type: 'error', text1: 'Error', text2: 'Password must be at least 6 characters' });
        if (credentials.password !== credentials.confirm_password) return Toast.show({ type: 'error', text1: 'Error', text2: 'Passwords do not match' });

        try {
            setLoading(true)
            const response = await axios.post(`${API_URL}/register`, credentials); // Properly interpolate URL

            const userData = response.data;
            if (response.status === 200) {
                Toast.show({ type: 'success', text1: 'Registration Successful!' });
                setTimeout(() => {
                    navigation.navigate('Login'); // Navigate to Login if successful
                }, 1500);
            } else {
                Toast.show({ type: 'error', text1: 'Invalid registration credentials.' });
            }
        } catch (error) {
            console.log(error.response.data.message);
            Toast.show({ type: 'error', text1: 'Error', text2: error.response.data.message });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View className="flex-1">

            <View className="flex-row items-center justify-center mt-5 bg-gray-100">
                <Text className="text-4xl mt-10 font-bold text-blue-500 mb-10">Welcome</Text>
            </View>
            <ScrollView className="flex-1 bg-gray-100">
                <View className="flex-1 justify-center items-center p-4">
                    {/* Logo or title */}

                    {/* Input fields */}
                    {[
                        { placeholder: "First Name", key: "firstname" },
                        { placeholder: "Middle Name", key: "middlename" },
                        { placeholder: "Last Name", key: "lastname" },
                        { placeholder: "Email", key: "email", keyboardType: "email-address" },
                        { placeholder: "Password", key: "password", secureTextEntry: true },
                        { placeholder: "Confirm Password", key: "confirm_password", secureTextEntry: true }
                    ].map((input) => (
                        <TextInput
                            key={input.key}
                            placeholder={input.placeholder}
                            value={credentials[input.key]}
                            onChangeText={(value) => setCredentials({ ...credentials, [input.key]: value })}
                            className="bg-white w-5/6 p-4 mb-4 rounded-lg shadow-md text-lg"
                            keyboardType={input.keyboardType}
                            secureTextEntry={input.secureTextEntry}
                        />
                    ))}

                    {/* Gender Picker */}
                    <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                        <Picker
                            selectedValue={credentials.gender}
                            onValueChange={(value) => setCredentials({ ...credentials, gender: value })}
                        >
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>

                    {/* Type Picker */}
                    <View className="bg-white w-5/6 p-1 mb-4 rounded-lg shadow-md text-lg">
                        <Picker
                            selectedValue={credentials.type}
                            onValueChange={(value) => setCredentials({ ...credentials, type: value })}
                        >
                            <Picker.Item label="Select Type" value="" enabled={false} />
                            <Picker.Item label="Faculty" value="faculty" />
                            <Picker.Item label="General Service" value="general_service" />
                            <Picker.Item label="Personnel" value="utility_worker" />
                        </Picker>
                    </View>

                    {/* Department Picker (only if type is faculty) */}
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

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        className="bg-blue-500 w-5/6 p-4 rounded-lg items-center shadow-lg"
                    >
                        <Text className="text-white text-lg font-bold">Register</Text>
                    </TouchableOpacity>

                    {/* Sign in link */}
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
            </ScrollView>
            <Toast />
        </View>
    );
}
