import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUserStore } from '../store/userStore';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';

export default function SettingsScreen({ navigation }) {
  const { user } = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    middlename: user?.middlename || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    gender: user?.gender || '',
    role: user?.role || '',
    department: user?.department || '',
    created_at: user?.created_at || ''
  });

  const handleToggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Logic for saving formData
    console.log("Updated Data:", formData);
    // Reset isEdit state to false after saving
    setIsEdit(false);
  };

  return (
    <View className="py-6 bg-slate-200">
      <Header navigation={navigation} />
      <View className="pt-4 pl-4 bg-white">
        <Text className="text-2xl font-bold border-b-2 border-slate-200">Personal Information</Text>
      </View>
      <ScrollView className="p-2 bg-white h-[85%]">
        {/* Edit Mode Toggle */}
        <View className="mb-4 px-4 flex-row justify-between items-center">
          <Text className="text-xl font-bold">Edit Mode</Text>
          <TouchableOpacity
            onPress={handleToggleEdit}
            className={`flex-row items-center p-2 rounded-md ${isEdit ? 'bg-green-500' : 'bg-blue-500'}`}
          >
            <MaterialIcons name={isEdit ? 'check-box' : 'edit'} size={24} color="white" />
            <Text className="ml-2 text-lg text-white">
              {isEdit ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Editable Fields */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">First Name</Text>
          <TextInput
            value={formData.firstname}
            onChangeText={(value) => handleChange('firstname', value)}
            className={`border p-2 rounded-lg ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            editable={isEdit}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500">Middle Name</Text>
          <TextInput
            value={formData.middlename}
            onChangeText={(value) => handleChange('middlename', value)}
            className={`border p-2 rounded-lg ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            editable={isEdit}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500">Last Name</Text>
          <TextInput
            value={formData.lastname}
            onChangeText={(value) => handleChange('lastname', value)}
            className={`border p-2 rounded-lg ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            editable={isEdit}
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500">Email</Text>
          <TextInput
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            className={`border p-2 rounded-lg ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            editable={isEdit}
          />
        </View>

        {/* Gender Picker */}
        <View className={`border p-2 rounded-lg mb-4 ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}>
          <Text className="text-sm text-gray-500">Gender</Text>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => handleChange('gender', value)}
            enabled={isEdit}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

        {/* Role Picker */}
        <View className={`border p-2 rounded-lg mb-4 ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}>
          <Text className="text-sm text-gray-500">Role</Text>
          <Picker
            selectedValue={formData.role}
            onValueChange={(value) => handleChange('role', value)}
            enabled={isEdit}
          >
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="User" value="user" />
          </Picker>
        </View>

        {/* Department */}
        <View className="mb-4">
          <Text className="text-sm text-gray-500">Department</Text>
          <TextInput
            value={formData.department}
            onChangeText={(value) => handleChange('department', value)}
            className={`border p-2 rounded-lg ${isEdit ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            editable={isEdit}
          />
        </View>

        {/* Timestamps */}
        <Text className="text-xl font-bold mb-4">Timestamps</Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-500">Created At</Text>
          <TextInput
            value={formData.created_at}
            className="border border-gray-300 p-2 rounded-lg"
            editable={false}
          />
        </View>

        {/* Save Button */}
        {isEdit && (
          <TouchableOpacity className="bg-green-500 p-4 rounded-lg mt-4 mb-5" onPress={handleSubmit}>
            <Text className="text-center text-white text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
