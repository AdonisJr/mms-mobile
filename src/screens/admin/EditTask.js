import { View, Text, TextInput, Button, ScrollView, Modal, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';
import { assignTask, fetchUserByType } from '../../services/apiServices';
import { CheckBox } from 'react-native-elements'; // Use CheckBox from react-native-elements
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../../store/currentNavStore';

export default function EditTask({ navigation, route }) {
    const data = route.params.data;
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { setNavigation } = useCurrentNavStore();
    // State for form data
    const [formData, setFormData] = useState(data);

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
        const payload = { ...formData, assigned_to: selectedUsers }

        if (payload.deadline === '') return Toast.show({ type: 'error', text1: 'Error', text2: 'Please select deadline.' });
        if (payload.assigned_to.length === 0) return Toast.show({ type: 'error', text1: 'Error', text2: 'Please assign atleast 1 user.' });

        try {
            setLoading(true);
            const response = await assignTask(data.id, payload);
            Toast.show({ type: 'error', text1: 'Success', text2: 'Task successfully assigned.' });
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

    // Use useFocusEffect to trigger getMyTasks when screen regains focus
    useFocusEffect(
        useCallback(() => {
            getUsers();
            console.log({ user: users })
            // setNavigation('PreventiveMaintenance');
        }, [])
    );

    if (mainDataLoading) return <Loading />;

    return (
        <View className="flex-1">
            <ScrollView className="mt-4 p-4">

                <View className="bg-white p-4 mb-3 rounded-lg shadow-2xl flex-row justify-between items-center mt-2">
                    <View className="flex-1 mr-2">
                        <Text className="text-xl font-bold text-gray-800">{data?.service?.name}</Text>
                        <Text className="text-sm font-semibold text-gray-800">Description: {data?.description}</Text>
                        <Text className="text-sm font-semibold text-gray-800">No. of personnel needed: {data?.number_of_personnel}</Text>
                        <Text className="text-sm font-semibold text-gray-800">Classification : {data?.classification}</Text>
                        <Text className="text-gray-800">Requested by:
                            <Text className="font-semibold">{`${data.user?.firstname} ${data.user?.lastname}`}</Text>
                        </Text>
                        <Text className="text-gray-800">Department: <Text className="font-semibold">{data.user.department}</Text></Text>
                        <Text className={`text-gray-600 ${data.status === 'approved' ? '' : 'mb-2'}`}>Requested Date: {new Date(data.created_at).toLocaleDateString()}</Text>
                        {data.status === 'approved' && (
                            <Text className="text-gray-600 mb-2">Approved on: {new Date(data.updated_at).toLocaleDateString()}</Text>
                        )}
                        <Text className="text-gray-800">Expected Start Date:
                            <Text className="font-semibold"> {data.expected_start_date}</Text>
                        </Text>
                        <Text className="text-gray-800 mb-2">Expected End Date:
                            <Text className="font-semibold"> {data.expected_end_date}</Text>
                        </Text>
                        <Text className="bg-emerald-300 w-[150px] p-2 rounded-xl text-center">
                            {data.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Scheduling Date */}
                <Text className="text-lg font-bold py-2">Deadline</Text>
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
                    <Text>{formData.deadline.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {/* Date picker modal */}
                {showDatePicker && (
                    <DateTimePicker
                        value={formData.deadline}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}

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

                            {users && users.length > 0 ? (
                                users.map((user) => (
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
                                ))
                            ) : (
                                <Text>No users available</Text> // Display a message if users array is empty or undefined
                            )}

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

