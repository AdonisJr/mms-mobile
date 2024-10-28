import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../../store/currentNavStore';
import Toast from 'react-native-toast-message';
import Loading from '../../components/Loading';
import { fetchMyPreventiveMaintenanceTasks, updatePreventiveTaskStatus } from '../../services/apiServices';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons'; // Importing the icons from Expo

export default function PreventiveMaintenanceTask({ navigation }) {
    const { setNavigation } = useCurrentNavStore();
    const [mainDataLoading, setMainDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preventiveDatas, setPreventiveDatas] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const initialDisplayCount = 3;

    const getAllData = async () => {
        setMainDataLoading(true);
        try {
            const response = await fetchMyPreventiveMaintenanceTasks();
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
            <Text className="text-2xl font-bold pl-4 pt-4">Preventive Maintenance Task</Text>
            <ScrollView className="px-4 py-6">

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
                                    {" " + maintenance.status.toUpperCase() + " "}
                                </Text>
                            </Text>

                            <Text className="mt-4 font-semibold text-gray-800">Assigned Personnel ( {maintenance?.users?.length} )</Text>
                            {/* {maintenance.users.map((user) => (
                                <View key={user.id} className="ml-4 mt-2">
                                    <Text className="text-gray-700">{`${user.firstname || 'N/A'} ${user.lastname || 'N/A'} (${user.department || 'N/A'})`}</Text>
                                </View>
                            ))} */}

                            <View style={{ minHeight: 50 }}>
                                {
                                    maintenance.users.slice(0, showAll ? maintenance.users.length : initialDisplayCount)
                                        .map((user, index) => (
                                            <Text key={index} className="text-gray-700 pl-2">
                                                {user ? `${user.firstname} ${user.lastname} ( ${user.department} )` : 'N/A'}
                                            </Text>
                                        ))
                                }
                            </View>

                            {/* Display "See More" if there are more workers to show */}
                            {maintenance.users.length > initialDisplayCount && (
                                <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                                    <Text className={`pl-2 ${showAll ? 'hidden' : ''}`}>...</Text>
                                    <Text className="text-blue-600">
                                        {showAll ? "See Less" : "See More"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* <TouchableOpacity
                            onPress={() => confirm(maintenance)}
                            className={`flex-row items-center p-2 rounded ${maintenance.status !== 'pending' ? 'bg-slate-400' : 'bg-blue-400'}`}
                            disabled={maintenance.status !== 'pending'}
                            style={{ display: }}
                        >
                            <MaterialIcons name="autorenew" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">In Progress</Text>
                        </TouchableOpacity> */}
                        {maintenance.status === 'pending' && (
                            <TouchableOpacity
                                onPress={() => confirm(maintenance)}
                                className={`flex-row items-center p-2 rounded ${maintenance.status !== 'pending' ? 'bg-slate-400' : 'bg-blue-400'}`}
                                disabled={maintenance.status !== 'pending'}
                            >
                                <MaterialIcons name="autorenew" size={20} color="white" />
                                <Text className="text-white font-bold ml-2">In Progress</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {loading && <Loading />}
                <Toast />
            </ScrollView>
        </View>
    );
}
