import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Loading from '../../components/Loading';
import { insertInventory } from '../../services/apiServices'; // Adjust import according to your structure
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function InsertInventory({ navigation }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formData, setFormData] = useState({
        equipment_type: '',
        model: '',
        acquisition_date: new Date(),
        location: '',
        warranty: '',
        department: '',
        status: 'Available',
        condition: 'Good',
        health: 100,
        name: ''
    });

    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        setLoading(false);

        // Validate required fields
        if (!formData.equipment_type) return Toast.show({ type: 'error', text1: 'Error', text2: 'Equipment Type is required.' });
        if (!formData.name) return Toast.show({ type: 'error', text1: 'Error', text2: 'Equipment Name is required.' });
        if (!formData.acquisition_date) return Toast.show({ type: 'error', text1: 'Error', text2: 'Acquisition Date is required.' });
        if (!formData.location) return Toast.show({ type: 'error', text1: 'Error', text2: 'Location is required.' });
        if (!formData.department) return Toast.show({ type: 'error', text1: 'Error', text2: 'Department is required.' });

        try {
            setLoading(true);
            console.log(formData);
            const response = await insertInventory(formData); // Adjust according to your insert function
            Toast.show({ type: 'success', text1: 'Success', text2: 'Successfully inserted inventory.' });
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: error.message });
        } finally {
            setLoading(false);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false); // Hide the date picker after selection
        setFormData({ ...formData, acquisition_date: currentDate }); // Update the selected date
    };

    return (
        <ScrollView className="flex-1">
            <View className="flex-1 h-screen p-4">
                <View className="bg-white p-6 rounded-lg shadow-lg w-full relative">

                    {/* Equipment Type Input */}
                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData.equipment_type}
                            onValueChange={(value) => setFormData({ ...formData, equipment_type: value })}
                        >
                            <Picker.Item label="Select Equipment Type" value="" enabled={false} />
                            <Picker.Item label="Electrical Equipment" value="Electrical Equipment" />
                            <Picker.Item label="Office Equipment" value="Office Equipment" />
                            <Picker.Item label="HVAC Equipment" value="HVAC Equipment" />
                            <Picker.Item label="Cleaning Equipment" value="Cleaning Equipment" />
                            <Picker.Item label="Safety Equipment" value="Safety Equipment" />
                            <Picker.Item label="Lighting Equipment" value="Lighting Equipment" />
                            <Picker.Item label="Power Tools" value="Power Tools" />
                            <Picker.Item label="Hand Tools" value="Hand Tools" />
                            <Picker.Item label="Furniture" value="Furniture" />
                            <Picker.Item label="Sports Equipment" value="Sports Equipment" />
                        </Picker>
                    </View>

                    {/* Name Input */}
                    <TextInput
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Model Input */}
                    <TextInput
                        placeholder="Model"
                        value={formData.model}
                        onChangeText={(text) => setFormData({ ...formData, model: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Acquisition Date Input */}
                    <Text className="text-lg font-bold text-gray-800 mb-1">Acquisition Date:</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            padding: 10,
                            borderRadius: 8,
                            backgroundColor: '#fff',
                        }}
                        className="mb-3"
                    >
                        <Text>{formData.acquisition_date.toLocaleDateString()}</Text>
                    </TouchableOpacity>

                    {/* Date picker modal */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.acquisition_date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    {/* Location Input */}
                    <TextInput
                        placeholder="Location"
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Warranty Input */}
                    <TextInput
                        placeholder="Warranty (optional)"
                        value={formData.warranty}
                        onChangeText={(text) => setFormData({ ...formData, warranty: text })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Department Input */}
                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData.department}
                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                        >
                            <Picker.Item label="Select Department" value="" enabled={false} />
                            <Picker.Item label="Maintenance Department" value="Maintenance Department" />
                            <Picker.Item label="Mathematics" value="Mathematics" />
                            <Picker.Item label="English" value="English" />
                            <Picker.Item label="Physical Education" value="Physical Education" />
                            <Picker.Item label="Health and Nursing" value="Health and Nursing" />
                            <Picker.Item label="Library" value="Library" />
                            <Picker.Item label="Engineering" value="Engineering" />
                            <Picker.Item label="Art" value="Art" />
                            <Picker.Item label="Business" value="Business" />
                        </Picker>
                    </View>

                    {/* Status Input */}
                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <Picker.Item label="Select Status" value="" enabled={false} />
                            <Picker.Item label="Available" value="Available" />
                            <Picker.Item label="Unavailable" value="Unavailable" />
                        </Picker>
                    </View>

                    {/* Condition Input */}
                    <View className="border border-gray-300 rounded-lg mb-4">
                        <Picker
                            selectedValue={formData.condition}
                            onValueChange={(value) => setFormData({ ...formData, condition: value })}
                        >
                            <Picker.Item label="Select Condition" value="" enabled={false} />
                            <Picker.Item label="Good" value="Good" />
                            <Picker.Item label="Needs Repair" value="Needs Repair" />
                            <Picker.Item label="Critical" value="Critical" />
                        </Picker>
                    </View>

                    {/* Health Input */}
                    <TextInput
                        placeholder="Health (0-100)"
                        value={String(formData.health)}
                        keyboardType="numeric"
                        onChangeText={(text) => setFormData({ ...formData, health: parseInt(text) })}
                        className="border border-gray-300 p-3 rounded-lg mb-4"
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleFormSubmit}
                        className="bg-green-500 w-full p-4 rounded-lg items-center"
                    >
                        <Text className="text-white text-lg font-bold">INSERT</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />
            {loading && <Loading />}
        </ScrollView>
    );
}
