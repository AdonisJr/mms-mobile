import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loading from '../../components/Loading';
import { insertUser, updateUser, updateUsers } from '../../services/apiServices';
import Toast from 'react-native-toast-message';

export default function EditUser({ route, navigation }) {
    const selected = route.params.data;
    const [formData, setFormData] = useState(selected);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        setLoading(false);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData?.firstname === '' || !formData?.firstname) return Toast.show({ type: 'error', text1: 'Error', text2: 'First Name is required.' });
        if (formData?.lastname === '' || !formData?.lastname) return Toast.show({ type: 'error', text1: 'Error', text2: 'Last Name is required' });
        if (formData.email === '' || !formData.email) return Toast.show({ type: 'error', text1: 'Error', text2: 'Email is required.' });
        if (!emailRegex.test(formData.email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (formData.type === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Type is required' });
        if (formData.type === 'faculty' && formData.department === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select department' });

        try {
            setLoading(true);
            const response = await updateUser(formData);
            // console.log('Available Services:', response); // Correct log after fetching data
            Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully updated' });
            setTimeout(() => {
                navigation.goBack()
            }, 1000)


        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }

    }

    return (
        <ScrollView className="flex-1">
            <View className="flex-1 h-screen p-4">
                <View className="bg-white p-6 rounded-lg shadow-lg w-full relative">
                    {/* First name Input */}
                    <TextInput
                        placeholder="First Name"
                        value={formData?.firstname}
                        onChangeText={(text) => setFormData({ ...formData, firstname: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Middle name Input */}
                    <TextInput
                        placeholder="Middle Name"
                        value={formData?.middlename}
                        onChangeText={(text) => setFormData({ ...formData, middlename: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Last name Input */}
                    <TextInput
                        placeholder="Last Name"
                        value={formData?.lastname}
                        onChangeText={(text) => setFormData({ ...formData, lastname: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Email Input */}
                    <TextInput
                        placeholder="Email"
                        value={formData?.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* TYPE */}

                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData?.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <Picker.Item label="Select Type of user" value="" enabled={false} />

                            <Picker.Item label="Admin" value="general_service" />
                            <Picker.Item label="Faculty" value="faculty" />
                            <Picker.Item label="General Services Personnel" value="utility_worker" />
                        </Picker>
                    </View>

                    {/* TYPE */}

                    {
                        formData?.type === 'faculty' ?
                            <View className="border border-gray-300 rounded-lg mb-4">
                                <Picker
                                    selectedValue={formData?.department}
                                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                                >
                                    <Picker.Item label="Select Department" value="" enabled={false} />

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
                            :
                            formData?.type === 'utility_worker' ?
                                <View className="border border-gray-300 rounded-lg mb-4">
                                    <Picker
                                        selectedValue={formData?.department}
                                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                                    >
                                        <Picker.Item label="Select Department" value="" enabled={false} />

                                        <Picker.Item label="Maintenance Department" value="Maintenance Department" />
                                        <Picker.Item label="Housekeeping Department" value="Housekeeping Department" />
                                        <Picker.Item label="Security Department" value="Security Department" />
                                        <Picker.Item label="Transportation Department" value="Transportation Department" />
                                        <Picker.Item label="Waste Management Department" value="Waste Management Department" />
                                        <Picker.Item label="Groundskeeping Department" value="Groundskeeping Department" />
                                        <Picker.Item label="Utility Services Department" value="Utility Services Department" />
                                    </Picker>
                                </View>

                                : ''
                    }



                    {/* TYPE */}

                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData?.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                            <Picker.Item label="Select Gender" value="" enabled={false} />

                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>

                    {/* Password input */}
                    <TextInput
                        placeholder="Password"
                        value={formData?.password}
                        onChangeText={(value) => setFormData({ ...formData, password: value })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                        secureTextEntry
                    />

                    {/* Confirm Password input */}
                    <TextInput
                        placeholder="Confirm Password"
                        value={formData?.password_confirmation}
                        onChangeText={(value) => setFormData({ ...formData, password_confirmation: value })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                        secureTextEntry
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleFormSubmit}
                        className="bg-green-500 w-full p-4 rounded-lg items-center"
                    >
                        <Text className="text-white text-lg font-bold">UPDATE</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />

            {loading && <Loading />}
        </ScrollView>


    )
}