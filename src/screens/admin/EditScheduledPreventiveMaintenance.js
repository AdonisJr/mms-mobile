import { View, Text, TextInput, Button, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';
import { fetchUserByType, updatePreventiveTaskStatus } from '../../services/apiServices';
import { CheckBox } from 'react-native-elements'; // Use CheckBox from react-native-elements
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../../store/currentNavStore';
import { useUserStore } from '../../store/userStore';
// import Checkbox from 'expo-checkbox';

export default function EditScheduledPreventiveMaintenance({ route, navigation }) {

    const selected = route.params.data;
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(selected.users.map(user => user.id));
    const [modalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePicker2, setShowDatePicker2] = useState(false);
    const { setNavigation } = useCurrentNavStore();
    const { user } = useUserStore();


    // State for form data
    // const [formData, setFormData] = useState({
    //     name: '',
    //     description: '',
    //     scheduled_date_from: new Date(),
    //     scheduled_date_to: new Date(),
    //     status: 'pending',
    //     user_ids: [],
    //     created_by: user.id
    // });

    // console.log(selected)

    // State for form data
    const [formData, setFormData] = useState({
        name: selected.name,
        description: selected.description,
        scheduled_date_from: new Date(),
        scheduled_date_to: new Date(selected.scheduled_date_to) || new Date(),
        status: selected.status,
        user_ids: selectedUsers,
        id: selected.id
    });

    const getUsers = async () => {
        setMainDataLoading(false);
        try {
            setMainDataLoading(true);
            const response = await fetchUserByType('utility_worker');
            setUsers(response);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    const onSubmit = async () => {
        setLoading(false);
        const payload = { ...formData, user_ids: selectedUsers }

        if (payload.name === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select task type.' });
        if (payload.user_ids.length === 0) return Toast.show({ type: 'error', text1: 'Error', text2: 'Please assign atleast 1 user.' });
        try {
            setLoading(true);
            const response = await updatePreventiveTaskStatus(payload);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Preventive maintenance successfully updated.' });
            setTimeout(() => {
                navigation.goBack();
            }, 2000)
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false); // Hide the date picker after selection
        setFormData({ ...formData, scheduled_date_from: currentDate }); // Update the selected date
    };

    const onChangeDate2 = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker2(false); // Hide the date picker after selection
        setFormData({ ...formData, scheduled_date_to: currentDate }); // Update the selected date
    };

    // Use useFocusEffect to trigger getMyTasks when screen regains focus
    useFocusEffect(
        useCallback(() => {
            getUsers();
            setNavigation('PreventiveMaintenance');
        }, [])
    );

    if (mainDataLoading) return <Loading />;

    return (
        <View className="flex-1">
            <View className="flex-row border-b-2 border-slate-300 pl-4 py-3 gap-2 items-center">
                <FontAwesome6 name="edit" size={24} color="black" />
                <Text className="text-lg font-bold py-2">Edit Form</Text>
            </View>
            <ScrollView className="mt-1 p-4">

                {/* Name Input */}
                <Text className="text-lg font-bold py-2">Type</Text>
                <View className="bg-white p-1 mb-4 rounded-lg shadow-md">
                    <Picker
                        selectedValue={formData.name}
                        onValueChange={(itemValue) => setFormData({ ...formData, name: itemValue })}
                    >
                        <Picker.Item label="Select Type" value="" enabled={false} />
                        <Picker.Item label="Preventive Maintenance" value="Preventive Maintenance" />
                        <Picker.Item label="Inspection" value="Inspection" />
                        <Picker.Item label="Repair" value="Repair" />
                        <Picker.Item label="Replacement" value="Replacement" />
                        <Picker.Item label="Calibration" value="Calibration" />
                        <Picker.Item label="Garbage Collection" value="Garbage Collection" />
                    </Picker>
                </View>

                {/* Description Input */}
                <Text className="text-lg font-bold py-2">Description</Text>
                <TextInput
                    className="bg-white p-3 mb-4 rounded-lg shadow-md"
                    placeholder="Description"
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    value={formData.description}
                />

                {/* Scheduling Date */}
                <Text className="text-lg font-bold py-2">Schedule Date From</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                    }}
                    className="mb-2 p-3"
                >
                    <Text>{formData.scheduled_date_from}</Text>
                </TouchableOpacity>

                {/* Date picker modal */}
                {showDatePicker && (
                    <DateTimePicker
                        value={formData.scheduled_date_from}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

                {/* Scheduling date to */}
                <Text className="text-lg font-bold py-2">Schedule Date To</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker2(true)}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                    }}
                    className="mb-2 p-3"
                >
                    <Text>{formData.scheduled_date_to}</Text>
                </TouchableOpacity>

                {/* Date picker modal */}
                {showDatePicker2 && (
                    <DateTimePicker
                        value={formData.scheduled_date_to}
                        mode="date"
                        display="default"
                        onChange={onChangeDate2}
                    />
                )}

                <Text className="text-lg font-bold py-2">Type</Text>
                <View className="bg-white p-1 mb-4 rounded-lg shadow-md">
                    <Picker
                        selectedValue={formData.status}
                        onValueChange={(itemValue) => setFormData({ ...formData, status: itemValue })}
                    >
                        <Picker.Item label="pending" value="pending" />
                        <Picker.Item label="completed" value="completed" />
                    </Picker>
                </View>

                {/* User Selection */}
                <View className="flex-row gap-2 py-2 justify-between items-center mb-2">
                    <Pressable className="flex-row gap-2 items-center" onPress={() => setModalVisible(true)} >
                        <Ionicons name="person-add-outline" size={20} color="#007bff" className="mr-2" />
                        <Text className="font-bold text-blue-600">Select Users</Text>
                    </Pressable>
                    <Text className="font-bold">Selected User ({selectedUsers.length})</Text>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    className="absolute top-0 left-0 flex-col items-center justify-center w-screen h-screen"
                >
                    <View className="bg-slate-200">

                        <View className="flex-row gap-10 border-b-2 border-slate-200 sticky top-0 pt-5 left-5">
                            <Ionicons name="arrow-back-outline" size={30} color="black" onPress={() => setModalVisible(false)} />
                            <Text className="text-lg font-bold mb-4">Select Users</Text>
                        </View>
                        <ScrollView className="bg-white rounded p-4 w-full mb-20 h-[85%]"
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >

                            {users.map((user) => (
                                <View key={user.id} className="flex-row items-center mb-2 bg-white p-2 w-full rounded">
                                    <CheckBox
                                        checked={selectedUsers.includes(user.id)}
                                        onPress={() => {
                                            setSelectedUsers((prev) =>
                                                prev.includes(user.id)
                                                    ? prev.filter((id) => id !== user.id)
                                                    : [...prev, user.id]
                                            );
                                        }}
                                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }} // Use transparent background for better styling
                                    />
                                    <Text style={{ marginLeft: 10 }}>{user.firstname} {user.middlename} {user.lastname}</Text>
                                </View>
                            ))}

                            {/* expo checkbox */}
                            {/* {users.map((user) => (
                                <View key={user.id} className="flex-row gap-3 items-center mb-2 bg-red-500 p-2 w-full rounded">
                                    <Checkbox
                                        value={selectedUsers.includes(user.id)}
                                        onValueChange={() => {
                                            setSelectedUsers((prev) =>
                                                prev.includes(user.id)
                                                    ? prev.filter((id) => id !== user.id)
                                                    : [...prev, user.id]
                                            );
                                        }}
                                        color={selectedUsers.includes(user.id) ? '#007bff' : undefined}
                                    />
                                    <Text>{user.firstname}</Text>
                                </View>
                            ))} */}
                            <TouchableOpacity
                                style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 10 }}
                                onPress={() => setModalVisible(false)}
                                className="mb-10"
                            >
                                <Text className="text-white text-center font-bold text-xl">Done</Text>
                            </TouchableOpacity>
                            <View></View>
                        </ScrollView>
                    </View>
                </Modal>

                {/* Submit Button */}
                <View className="p-4">
                    <TouchableOpacity className="flex-row gap-2 items-center justify-center py-3 bg-blue-500 rounded-full" onPress={onSubmit} >
                        <Text className="text-white font-bold text-xl">Submit</Text>
                        <View className="flex justify-center items-center absolute -top-1 right-3 bg-red-100 p-2 w-12 h-12 rounded-full">
                            <FontAwesome6 name="check" size={24} color="blue" />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
            {loading && <Loading />}
        </View>
    );
}
