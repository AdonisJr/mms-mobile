import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loading from '../Loading';
import { insertUser, updateUser, updateUsers } from '../../services/apiServices';
import Toast from 'react-native-toast-message';

export default function UsersModal({ selected, setModalVisible, modalVisible, setSelected, getUsers }) {

    const [formData, setFormData] = useState(selected || '');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (selected) {
            setFormData(selected);
        }
    }, [])

    const handleFormSubmit = async () => {
        setLoading(false);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData.firstname === '' || !formData.firstname) return Toast.show({ type: 'error', text1: 'Error', text2: 'First Name is required.' });
        if (formData.lastname === '' || !formData.lastname) return Toast.show({ type: 'error', text1: 'Error', text2: 'Last Name is required' });
        if (formData.email === '' || !formData.email) return Toast.show({ type: 'error', text1: 'Error', text2: 'Email is required.' });
        if (!emailRegex.test(formData.email)) return Toast.show({ type: 'error', text2: 'Invalid email format' });
        if (formData.type === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Type is required' });
        if (formData.type === 'faculty' && formData.department === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select department' });
       
        try {
            setLoading(true);

            if (selected) {

                const response = await updateUser(formData);
                // console.log('Available Services:', response); // Correct log after fetching data
                Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully updated' });
                setSelected(null);
                setTimeout(() => {
                    getUsers()
                    setModalVisible(false)
                }, 1000)
            } else {
                if (formData.password === '' || formData.password.length < 6) return Toast.show({ type: 'error', text1: 'Error', text2: 'Password must at least 6 characters' });
                if (formData.password !== formData.password_confirmation) return Toast.show({ type: 'error', text1: 'Error', text2: "Password does not match" });


                console.log(formData)
                const response = await insertUser(formData);
                // console.log('Available Services:', response); // Correct log after fetching data
                Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully inserted' });
                setSelected(null);
                setTimeout(() => {
                    getUsers()
                    setModalVisible(false)
                }, 1000)
            }

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }

    }

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            className="z-10"
        >

            <ScrollView className="flex-1">
                <View className="flex-1 justify-center items-center h-screen">
                    <View className="absolute w-full h-full top-0 left-0 bg-black opacity-60"></View>
                    <View className="bg-white p-6 rounded-lg shadow-lg w-5/6 relative">
                        <Text className="text-lg font-bold mb-4">
                            {selected ? "Update User" : 'Add New User'}
                        </Text>
                        {/* First name Input */}
                        <TextInput
                            placeholder="First Name"
                            value={formData.firstname}
                            onChangeText={(text) => setFormData({ ...formData, firstname: text })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                        />

                        {/* Middle name Input */}
                        <TextInput
                            placeholder="Middle Name"
                            value={formData.middlename}
                            onChangeText={(text) => setFormData({ ...formData, middlename: text })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                        />

                        {/* Last name Input */}
                        <TextInput
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChangeText={(text) => setFormData({ ...formData, lastname: text })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                        />

                        {/* Email Input */}
                        <TextInput
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                        />

                        {/* TYPE */}

                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker
                                selectedValue={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <Picker.Item label="Select Type of user" value="" enabled={false} />

                                <Picker.Item label="General Service Personnel" value="general_service" />
                                <Picker.Item label="Faculty" value="faculty" />
                                <Picker.Item label="Utility Worker" value="utility_worker" />
                            </Picker>
                        </View>

                        {/* TYPE */}

                        {
                            formData.type !== 'faculty' ? '' :
                                <View className="border border-gray-300 rounded-lg mb-4">
                                    <Picker
                                        selectedValue={formData.department}
                                        onValueChange={(value) => setFormData({ ...formData, department: value })}
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

                        {/* TYPE */}

                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker
                                selectedValue={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <Picker.Item label="Select Gender" value="" enabled={false} />

                                <Picker.Item label="Male" value="male" />
                                <Picker.Item label="Female" value="female" />
                            </Picker>
                        </View>

                        {/* Role */}

                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker
                                selectedValue={formData.role}
                                onValueChange={(value) => setFormData({ ...formData, role: value })}
                            >
                                <Picker.Item label="Select Role of user" value="" enabled={false} />

                                <Picker.Item label="User" value="user" />
                                <Picker.Item label="Admin" value="Admin" />
                            </Picker>
                        </View>

                        {/* Password input */}
                        <TextInput
                            placeholder="Password"
                            value={formData.password}
                            onChangeText={(value) => setFormData({ ...formData, password: value })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                            secureTextEntry
                        />

                        {/* Confirm Password input */}
                        <TextInput
                            placeholder="Confirm Password"
                            value={formData.password_confirmation}
                            onChangeText={(value) => setFormData({ ...formData, password_confirmation: value })}
                            className="border border-gray-300 p-3 rounded-lg mb-4"
                            secureTextEntry
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleFormSubmit}
                            className="bg-green-500 w-full p-4 rounded-lg items-center"
                        >
                            <Text className="text-white text-lg font-bold">{selected ? 'UPDATE' : 'INSERT'}</Text>
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity
                            className="absolute top-3 right-3"
                            onPress={() => [setModalVisible(false), setSelected(null)]}
                        >
                            <MaterialIcons name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Toast />
            {loading && <Loading />}
        </Modal>


    )
}