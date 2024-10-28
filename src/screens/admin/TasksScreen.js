import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchTasks } from '../../services/apiServices';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { MaterialIcons } from '@expo/vector-icons'; // Importing the icons from Expo
import Entypo from '@expo/vector-icons/Entypo';
import { updateTaskStatus } from '../../services/apiServices';
import { useCurrentNavStore } from '../../store/currentNavStore';

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [showAll, setShowAll] = useState({});
  const initialDisplayCount = 3;
  const { setNavigation } = useCurrentNavStore();
  const [loading, setLoading] = useState(false);

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

  // Function to update task status
  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
        await updateTaskStatus({ id, status });
        Toast.show({ type: 'success', text1: 'Status Updated', text2: `Task is now ${status}` });
        getTasks(); // Refresh tasks
    } catch (error) {
        Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
        setLoading(false);
    }
};

  const toggleShowAll = (id) => {
    setShowAll((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the specific ID
    }));
  };

  useFocusEffect(
    useCallback(() => {
      getTasks();
      setNavigation('Tasks')
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
          <Text className="text-gray-700 mb-1">Task Status:
            <Text
              className={`text-white ${status === 'in_progress' ? 'bg-blue-400'
                : status === 'pending' ? 'bg-yellow-400' : 'bg-emerald-400'}`}>
              {" " + status.toUpperCase() + " "}
            </Text>
          </Text>
          <Text className="text-sm text-gray-600">Deadline: {deadline}</Text>

          {/* Service Request Details */}
          <Text className="font-semibold text-base text-gray-800 mt-4">Service Request</Text>
          <Text className="text-sm text-gray-700">Service: {service ? service.name : 'N/A'}</Text>
          <Text className="text-sm text-gray-700">Requested By: {requested ? `${requested.firstname} ${requested.lastname}` : 'N/A'}</Text>
          <Text className="text-sm text-gray-700">Approved By: {approver ? `${approver.firstname} ${approver.lastname}` : 'N/A'}</Text>

          {/* Utility Worker Details */}
          <Text className="font-semibold text-base text-gray-800 mt-4 mb-2">Assigned Personnel</Text>

          <View style={{ minHeight: 50 }}>
            {
              utility_workers.slice(0, showAll[item.id] ? utility_workers.length : initialDisplayCount)
                .map((worker, index) => (
                  <Text key={index} className="text-gray-700 pl-2">
                    {worker ? `${worker.firstname} ${worker.lastname} ( ${worker.department} )` : 'N/A'}
                  </Text>
                ))
            }
          </View>

          {/* Display "See More" if there are more workers to show */}
          {utility_workers.length > initialDisplayCount && (
            <TouchableOpacity onPress={() => toggleShowAll(item.id)}>
              <Text className={`pl-2 ${!showAll[item.id] ? '' : 'hidden'}`}>...</Text>
              <Text className="text-blue-600">
                {showAll[item.id] ? "See Less" : "See More"}
              </Text>
            </TouchableOpacity>
          )}

        </View>
        {/* EDIT BUTTON */}
        <View className="flex-col items-center gap-2">
          <TouchableOpacity
            onPress={() => updateStatus(item.id, 'completed')}
            className={`flex-row items-center p-2 rounded bg-blue-400 ${item?.proof && item?.status !== 'completed' ? 'flex' : 'hidden'}`}
          >
            <MaterialIcons name="edit" size={15} color="white" />
            <Text className="text-white font-bold ml-1">Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`flex-row bg-teal-600 p-1 rounded-md items-center ${item?.proof ? 'flex' : 'hidden'}`}
            onPress={() => navigation.navigate('Image Screen', { data: item })}>
            <Entypo name="magnifying-glass" size={24} color="white" />
            <Text className="text-white font-bold">
              View Image
            </Text>
          </TouchableOpacity>
        </View>
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
