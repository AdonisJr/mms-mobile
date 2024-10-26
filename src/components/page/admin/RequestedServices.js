import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useUserStore } from '../../../store/userStore';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchRequestedServices, updateRequestedStatus } from '../../../services/apiServices';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import Loading from '../../Loading';

export default function RequestedServices({ navigation }) {
  const { user } = useUserStore();
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const [requestedServices, setRequestedServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // State to hold the current filter

  const getRequestedServices = async () => {
    setMainDataLoading(true);
    try {
      const response = await fetchRequestedServices();
      setRequestedServices(response);
      setFilteredServices(response); // Initialize filtered services
      console.log('Requested Services:', response);
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };

  const handleChange = async (data, value) => {
    setLoading(true);
    try {
      await updateRequestedStatus(data.id, value);
      Toast.show({ type: 'success', text1: 'Success', text2: `Successfully updated to ${value}` });
      getRequestedServices();
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (requestedServices) {
    requestedServices.map(requested => { console.log(requested.tasks[0]?.assigned_to) })
  }

  const confirmUpdate = (item, value) => {
    Alert.alert(
      "Confirm Update",
      `Are you sure you want to update to ${value}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => handleChange(item, value),
          style: "default"
        }
      ]
    );
  };

  const handleAssignTask = (data) => {
    if (data.status !== 'approved') {
      return Toast.show({
        type: 'error',
        text1: 'Action Not Allowed',
        text2: 'You can only assign tasks to services that are approved.'
      });
    }
    navigation.navigate('AssignTask', { services: data });
  };


  // Use useFocusEffect to trigger getRequestedServices when screen regains focus
  useFocusEffect(
    useCallback(() => {
      getRequestedServices();
    }, [])
  );

  useEffect(() => {
    // Filter services based on selected filter
    if (filter === 'all') {
      setFilteredServices(requestedServices);
    } else {
      setFilteredServices(requestedServices.filter(service => service.status === filter));
    }
  }, [filter, requestedServices]);

  const renderServiceItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-2xl flex-row justify-between items-center mt-2">
      <View className="flex-1 mr-2">
        <Text className="text-lg font-bold text-gray-800">{item.service.name}</Text>
        <Text className="text-gray-600">{item.description}</Text>
        <Text className="text-gray-800">Requested by:
          <Text className="font-semibold">{`${item.user.firstname} ${item.user.lastname}`}</Text>
        </Text>
        <Text className="text-gray-800">Department: <Text className="font-semibold">{item.user.department}</Text></Text>
        <Text className={`text-gray-600 ${item.status === 'approved' ? '' : 'mb-2'}`}>Requested Date: {new Date(item.created_at).toLocaleDateString()}</Text>
        {item.status === 'approved' && (
          <Text className="text-gray-600 mb-2">Approved on: {new Date(item.updated_at).toLocaleDateString()}</Text>
        )}
        <View className={`rounded-2xl w-[150px] ${item.status === 'approved' ? 'bg-emerald-200' : item.status === 'rejected' ? 'bg-red-200' : 'bg-orange-200'}`}>
          <Picker
            selectedValue={item.status}
            style={{ height: 50, width: 150 }}
            onValueChange={(value) => confirmUpdate(item, value)}
          >
            <Picker.Item label="Approved" value="approved" />
            <Picker.Item label="Rejected" value="rejected" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
        </View>
      </View>

      <View className="flex-col gap-10">
        <TouchableOpacity
          className={`text-white px-4 py-2 rounded-lg  ${item.tasks.length ? 'bg-blue-300' : 'bg-blue-500'}`}
          onPress={() => handleAssignTask(item)}
          // requested.tasks[0]?.assigned_to
          disabled={item.tasks.length !== 0}
        >
          <Text className={`font-semibold text-white`}>
            {item.tasks.length !== 0 ? 'Assigned' : 'Assign Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );



  if (mainDataLoading) return <Loading />;

  return (
    <View className="flex-1">
      {/* Filter buttons */}
      <View className="flex-row justify-around bg-blue-200 p-3">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${filter === status ? 'bg-blue-500' : 'bg-blue-300'}`}
          >
            <Text className={`text-white font-semibold`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredServices} // Use filtered services here
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        className="px-4 bg-slate-100"
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Toast />
    </View>
  );
}
