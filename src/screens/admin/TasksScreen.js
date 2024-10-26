import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchTasks } from '../../services/apiServices';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons'; // Importing the icons from Expo

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);

  const getTasks = async () => {
    setMainDataLoading(true);
    try {
      const response = await fetchTasks();
      setTasks(response);
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
      getTasks();
    }, [])
  );

  // Render a single task
  const renderTask = ({ item }) => {
    const { service_request, utility_workers, deadline, status } = item;
    const { service, requested, approver } = service_request;
    return (
      <View className="flex-row justify-between items-center bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200">
        <View>
          {/* Task Details */}
          <Text className="text-lg font-bold text-gray-900">Task: {service?.name}</Text>
          <Text className="text-sm font-semibold text-gray-700 mt-2">Where: {requested?.department}</Text>
          <Text className="text-sm text-gray-600">Task Status: {status}</Text>
          <Text className="text-sm text-gray-600">Deadline: {deadline}</Text>

          {/* Service Request Details */}
          <Text className="font-semibold text-base text-gray-800 mt-4">Service Request</Text>
          <Text className="text-sm text-gray-700">Service: {service ? service.name : 'N/A'}</Text>
          <Text className="text-sm text-gray-700">Requested By: {requested ? `${requested.firstname} ${requested.lastname}` : 'N/A'}</Text>
          <Text className="text-sm text-gray-700">Approved By: {approver ? `${approver.firstname} ${approver.lastname}` : 'N/A'}</Text>

          {/* Utility Worker Details */}
          <Text className="font-semibold text-base text-gray-800 mt-4 mb-2">Assigned Personnel</Text>
          {
            utility_workers && utility_workers.map((utility_worker, index) => (
              <Text key={index} className="text-sm text-gray-700 ml-2">{utility_worker ? `${utility_worker.firstname} ${utility_worker.lastname} ( ${utility_worker.department} )` : 'N/A'}</Text>
            ))
          }

        </View>
        {/* EDIT BUTTON */}

        {/* hide for now until i resolve the bugs in response from server */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Edit Task', { data: item })}
          className={`flex-row items-center p-2 rounded bg-blue-400`}
        >
          <MaterialIcons name="edit" size={15} color="white" />
          <Text className="text-white font-bold ml-1">Edit</Text>
        </TouchableOpacity> */}
        
      </View>

    );
  };

  return (
    <View className="flex-1 py-6 bg-gray-100">
      <Header navigation={navigation} />
      <Text className="text-2xl pt-4 pl-4 font-bold text-gray-900">Tasks Lists</Text>
      <View className="p-3 pb-28">
        {mainDataLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTask}
            ListEmptyComponent={<Text className="text-center text-gray-600 mt-4">No tasks available</Text>}
          />
        )}
      </View>
      <Toast />
    </View>
  );
}
