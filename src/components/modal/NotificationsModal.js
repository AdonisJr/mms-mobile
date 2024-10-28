import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { fetchNotifications } from '../../services/apiServices';

export default function NotificationsModal({ visible, setModalVisible }) {
    const [notifications, setNotifications] = useState([]);
    const [mainDataLoading, setMainDataLoading] = useState(false);


    const getNotifications = async () => {
        setMainDataLoading(true);
        try {
            const response = await fetchNotifications();
            setNotifications(response);
            console.log('Requested Services:', response);
        } catch (error) {
            console.log(error);
            // Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getNotifications();
        }, [])
    );

    return (
        <View className="bg-slate-300 rounded-lg p-5 w-6/12 max-h-3/4 mt-5">
            <Text style={`text-lg font-semibold mb-4`}>Notifications</Text>
            <ScrollView style={`mb-4`}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <View key={notification.id} style={`p-3 mb-2 bg-gray-100 rounded-lg`}>
                            <Text style={`text-gray-700`}>{notification.message}</Text>
                            <Text style={`text-xs text-gray-500`}>{new Date(notification.created_at).toLocaleString()}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={`text-gray-500`}>No notifications</Text>
                )}
            </ScrollView>
            <TouchableOpacity
                style={`bg-blue-500 rounded-lg py-2 px-4`}
                onPress={() => setModalVisible(false)}
            >
                <Text style={`text-white text-center`}>Close</Text>
            </TouchableOpacity>
        </View>
    );
}
