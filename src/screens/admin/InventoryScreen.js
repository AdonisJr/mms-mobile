import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { useCurrentNavStore } from '../../store/currentNavStore';
import { fetchInventory } from '../../services/apiServices';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this icon package

export default function InventoryScreen({ navigation }) {
    const { setNavigation } = useCurrentNavStore();
    const [datas, setDatas] = useState([]);
    const [mainDataLoading, setMainDataLoading] = useState(false);

    const getData = async () => {
        setMainDataLoading(true);
        try {
            const response = await fetchInventory();
            setDatas(response);
            console.log('Available Inventory:', response);
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setMainDataLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getData();
            setNavigation('Inventory');
        }, [])
    );

    if (mainDataLoading) {
        return <Loading />;
    }

    const renderItem = ({ item }) => (
        <View className="flex-col justify-between mb-6 p-4 bg-white rounded-lg shadow">
            <View style={{ flex: 1 }}>
                <Text className="text-xl font-bold text-gray-800">{item.equipment_type}</Text>
                <Text className="text-gray-600 mb-2 text-lg">Name: {item.name}</Text>
                <Text className="text-gray-600 mb-2 text-lg">Model: {item.model || 'N/A'}</Text>
                <Text className="text-gray-700 mb-1 text-lg">Acquisition Date: {item.acquisition_date}</Text>
                <Text className="text-gray-700 mb-1 text-lg">Warranty: {item.warranty || 'N/A'}</Text>
                <Text className="text-gray-700 mb-1 text-lg">Office: {item.location}</Text>
                <Text className="text-gray-700 mb-1 text-lg">Department: {item.department}</Text>
                <Text className="text-gray-700 mb-2 text-lg">Status: {item.status}</Text>
                <Text className="text-gray-700 mb-2 text-lg">Condition: {item.condition}</Text>
                <Text className="text-gray-700 mb-2 text-lg">Health: {item.health}</Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Edit Inventory', { data: item })}
                className="flex-row w-full justify-center items-center p-2 rounded bg-blue-400"
            >
                <MaterialIcons name="edit" size={15} color="white" />
                <Text className="text-white font-bold ml-1 text-lg">Edit</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 py-6 bg-gray-100">
            <Header navigation={navigation} />
            <View className="px-4 py-6">
                {
                    datas.length === 0 ? '' :
                        <Text className="text-2xl font-bold mb-6">Inventory List</Text>
                }
                <FlatList
                    data={datas}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} // Assuming 'id' is a unique identifier
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text className="text-center text-gray-500">No Inventory found.</Text>}
                />

                <Toast />
            </View>
        </View>
    );
}
