import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchServicesByCurrentUser } from '../services/apiServices';
import Loading from '../components/Loading';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function FacultyScreen({ navigation }) {
  const [requestedServices, setRequestedServices] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);

  const getRequestedServices = async () => {
    setMainDataLoading(true);
    try {
      const response = await fetchServicesByCurrentUser();
      setRequestedServices(response); // Update the state with the fetched data
      // console.log('Available Services:', response); // Correct log after fetching data
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRequestedServices();
    }, [])
);

  if (mainDataLoading) return <Loading />;

  return (
    <View className="flex-1 py-6">
      <Header navigation={navigation} />

      <Text className="text-2xl font-bold p-4">Requested Services</Text>

      <FlatList
        data={requestedServices}
        keyExtractor={(item) => item.id.toString()} // Use item.id as key
        renderItem={({ item }) => (

          <View className="flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
            <View style={{ flex: 1 }}>
              <Text className="text-xl font-bold text-gray-800">{item.service.name}</Text>
              <Text className="text-gray-600 mb-2">Description: {item.description}</Text>
              <Text className="text-gray-600 mb-2">Expected Start Date: {item.expected_start_date}</Text>
              <Text className="text-gray-600 mb-2">Expected End Date: {item.expected_end_date}</Text>
              <Text className="text-gray-600 mb-2">Status: {item.status}</Text>
              <Text className="text-gray-600 mb-2">
                Approved By: {item.approved_by ? item.approved_by : 'Pending'}
              </Text>
              
              <Text className="text-gray-600 mb-2">Date Requested: {new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Edit Requested Services', { data: item })}
              className={`flex-row items-center p-2 rounded bg-blue-400`}
            >
              <MaterialIcons name="edit" size={15} color="white" />
              <Text className="text-white font-bold ml-1">Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500">No services requested.</Text>
        )}
      />
    </View>
  );
}