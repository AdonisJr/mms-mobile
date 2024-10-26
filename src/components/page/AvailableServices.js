import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchAvailableServices, deleteAvailableServices } from '../../services/apiServices';
import Toast from 'react-native-toast-message';
import Loading from '../Loading';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import AvailableServicesModal from '../modal/AvailableServicesModal';

export default function AvailableServices() {
  const [availableServices, setAvailableServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [mainDataLoading, setMainDataLoading] = useState(false);

  const getAvailableServices = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      const response = await fetchAvailableServices();
      setAvailableServices(response); // Update the state with the fetched data
      console.log('Available Services:', response); // Correct log after fetching data
    } catch (error) {
      console.log(error)
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };

  // DELETE

  const handleDelete = async (item) => {
    // This function gets called when the user confirms deletion
    setLoading(false);
    try {
      setLoading(true);
      const response = await deleteAvailableServices(item.id);
      console.log('Available Services:', response); // Correct log after fetching data
      Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully deleted' });
      setTimeout(() => {
        getAvailableServices();
      }, 1000)
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Delete",  // Title of the alert
      `Are you sure you want to delete ${item.name}?`,  // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => handleDelete(item), // Call delete handler if confirmed
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    getAvailableServices();
  }, []);

  // Render a message while loading
  if (mainDataLoading) return <Loading />;

  // Handle the case when no services are available
  if (!availableServices) return <Text>No available services found</Text>;



  // Render the list of available services
  return (


    <View className="p-4">
      {/* button and sorting */}
      <View className="flex-row gap-5 pb-5">
        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-blue-500 rounded-lg">
          <Text className="py-1 w-20 text-center text-white rounded-lg text-lg">ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Available services list */}
      <FlatList
        className="h-[80%]"
        data={availableServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-md">
            <View className='w-5/6'>
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-sm text-slate-500">{item.type_of_service}</Text>
              <Text className="text-sm text-black">{item.description}</Text>
            </View>
            <View className='flex-col gap-5'>
              <TouchableOpacity className="p-2 rounded-full bg-emerald-200" onPress={() => [setSelected(item), setModalVisible(true)]}>
                <MaterialIcons name="edit" size={18} color="black" />
              </TouchableOpacity>

              <TouchableOpacity className="p-2 rounded-full bg-rose-200" onPress={() => confirmDelete(item)}>
                <MaterialIcons name="delete" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      {modalVisible && <AvailableServicesModal selected={selected} setModalVisible={setModalVisible} modalVisible={modalVisible} setSelected={setSelected} getAvailableServices={getAvailableServices} />}
      {loading && <Loading />}

      <Toast />
    </View>
  );
}
