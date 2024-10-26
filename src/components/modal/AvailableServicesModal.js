import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loading from '../Loading';
import { insertAvailableServices, updateAvailableServices } from '../../services/apiServices';
import Toast from 'react-native-toast-message';

export default function AvailableServicesModal({ selected, setModalVisible, modalVisible, setSelected, getAvailableServices }) {

  const [formData, setFormData] = useState(selected || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setFormData(selected);
    }
  }, [])

  const handleFormSubmit = async () => {
    setLoading(false);
    if(formData.name === '' || !formData.name) return Toast.show({type: 'error', text1: 'Error', text2: 'Service Name is required.'});
    if(formData.type_of_service === '' || !formData.type_of_service) return Toast.show({type: 'error', text1: 'Error', text2: 'Please select type of service.'});
    if(formData.description === '' || !formData.description) return Toast.show({type: 'error', text1: 'Error', text2: 'Description is required.'});

    try {
      setLoading(true);

      if (selected) {
        const response = await updateAvailableServices(formData);
        // console.log('Available Services:', response); // Correct log after fetching data
        Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully updated' });
        setSelected(null);
        setTimeout(() => {
          getAvailableServices()
          setModalVisible(false)
        }, 1000)
      } else {
        const response = await insertAvailableServices(formData);
        // console.log('Available Services:', response); // Correct log after fetching data
        Toast.show({ type: 'success', text1: 'Success Message', text2: 'Successfully inserted' });
        setSelected(null);
        setTimeout(() => {
          getAvailableServices()
          setModalVisible(false)
        }, 1000)
      }

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }

  }

  return (

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      className="z-10"
    >

      <View className="flex-1 justify-center items-center">
        <View className="absolute w-full h-full top-0 left-0 bg-black opacity-60"></View>
        <View className="bg-white p-6 rounded-lg shadow-lg w-5/6 relative">
          <Text className="text-lg font-bold mb-4">
            {selected ? "Update Services" : 'Add New Services'}
          </Text>
          {/* Name Input */}
          <TextInput
            placeholder="Service Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="border border-gray-300 p-3 rounded-lg mb-4"
          />

          {/* TYPE */}

          <View className="border border-gray-300 p-3 rounded-lg mb-4">
            <Picker
              selectedValue={formData.type_of_service}
              onValueChange={(value) => [setFormData({ ...formData, type_of_service: value }), console.log(value)]}
            >
              <Picker.Item label="Select Type Of Service" value="" enabled={false} />

              <Picker.Item label="Repair" value="repair" />
              <Picker.Item label="Replacement" value="replacement" />
              <Picker.Item label="Installation" value="installation" />
              <Picker.Item label="General_cleaning" value="general_cleaning" />
              <Picker.Item label="Garbage_removal" value="garbage_removal" />
              <Picker.Item label="Transfer Of Equipment" value="transfer_of_equipment" />
            </Picker>
          </View>

          {/* Description Input */}
          <TextInput
            placeholder="Service Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            className="border border-gray-300 p-3 rounded-lg mb-4"
            multiline
            numberOfLines={4}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleFormSubmit}
            className="bg-green-500 w-full p-4 rounded-lg items-center"
          >
            <Text className="text-white text-lg font-bold">{selected ? 'UPDATE' : 'INSERT'}</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            className="absolute top-3 right-3"
            onPress={() => [setModalVisible(false), setSelected(null)]}
          >
            <MaterialIcons name="close" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
      {loading && <Loading />}
    </Modal>


  )
}