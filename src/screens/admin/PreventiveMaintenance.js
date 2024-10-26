import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../../store/currentNavStore';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';
import { fetchAllPreventiveMaintenance, updatePreventiveTaskStatus } from '../../services/apiServices';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons'; // Importing the icons from Expo

export default function PreventiveMaintenanceTask({ navigation }) {
    const { setNavigation } = useCurrentNavStore();
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preventiveDatas, setPreventiveDatas] = useState([]);

    const getAllData = async () => {
        setMainDataLoading(true);
        try {
            const response = await fetchAllPreventiveMaintenance();
            setPreventiveDatas(response);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    const handleUpdateStatus = async (data) => {
        const payload = { ...data, status: 'in-progress' }
        setLoading(false);
        try {
            setLoading(true);
            const response = await updatePreventiveTaskStatus(payload);
            Toast.show({ type: 'success', text1: 'Success', text2: response.message });
            setTimeout(() => {
                getAllData(); // Refresh data after updating
            })
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const confirm = (data) => {
        Alert.alert(
            "Confirm Preventive Task",
            `Are you sure you want to make "${data.name}" in-progress?`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: () => handleUpdateStatus(data),
                    style: "default"
                }
            ]
        );
    };

    useFocusEffect(
        useCallback(() => {
        getAllData();
            setNavigation('PreventiveMaintenance');
        }, [])
    );

    if (mainDataLoading) return <Loading />;

    return (
        <View className="flex-1 py-6">
            <Header navigation={navigation} />
            <ScrollView className="px-4 py-6">
                <Text className="text-2xl font-bold mb-6">Preventive Maintenance Task</Text>

                {preventiveDatas.map((maintenance) => (
                    <View key={maintenance.id} className="flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
                        <View style={{ flex: 1 }}>
                            <Text className="text-xl font-bold text-gray-800">{maintenance.name}</Text>
                            <Text className="text-gray-600 mb-2">{maintenance.description}</Text>
                            <Text className="text-gray-700 mb-1">Scheduled From: {maintenance.scheduled_date_from}</Text>
                            <Text className="text-gray-700 mb-1">Scheduled To: {maintenance.scheduled_date_to}</Text>
                            <Text className="text-gray-700 mb-2">Status:
                                <Text
                                    className={`text-white ${maintenance.status === 'in-progress' ? 'bg-blue-400'
                                        : maintenance.status === 'pending' ? 'bg-yellow-400' : 'bg-emerald-400'}`}>
                                    {" " + maintenance.status + " "}
                                </Text>
                            </Text>

                            <Text className="mt-4 font-semibold text-gray-800">Assigned Users:</Text>
                            {maintenance.users.map((user) => (
                                <View key={user.id} className="ml-4 mt-2">
                                    <Text className="text-gray-700">{`${user.firstname || 'N/A'} ${user.lastname || 'N/A'} (${user.department || 'N/A'})`}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Scheduled Preventive Maintenance', { data: maintenance })}
                            className={`flex-row items-center p-2 rounded bg-blue-400`}
                        >
                            <MaterialIcons name="edit" size={15} color="white" />
                            <Text className="text-white font-bold ml-1">Edit</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {loading && <Loading />}
                <Toast />
            </ScrollView>
        </View>
    );
}
