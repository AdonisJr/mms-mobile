import { View, Text, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useUserStore } from '../store/userStore';
import { useCurrentNavStore } from '../store/currentNavStore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Header({ navigation }) {
    const { user, logout } = useUserStore();
    const { currentApp } = useCurrentNavStore();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleLogout = () => {
        logout();
        navigation.navigate('Login');
        setDropdownVisible(false);
    };

    return (
        <View className="bg-slate-100">
            <View className="p-4 bg-blue-800 rounded-3xl mx-2">
                <View className="absolute -top-2 flex-row w-screen justify-center">
                    <View className="bg-slate-100 w-72 h-5 rounded-lg">
                        <Text></Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center pl-2">
                    <TouchableOpacity
                        className="flex-col items-center"
                        onPress={() =>
                            currentApp === 'Main'
                                ? navigation.navigate('Services')
                                : currentApp === 'Faculty'
                                    ? navigation.navigate('Services')
                                    : navigation.navigate('AvailableTask')
                        }

                    >
                        <View className="flex-col justify-center items-center">
                            <FontAwesome5 name="tools" size={24} color="white" />
                            <Text className="text-xs font-bold text-white">GSMMS</Text>
                        </View>
                        {/* <Feather name="home" size={20} color="white" /> */}
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity className="relative">
                            <View className="absolute top-0 -right-2 bg-red-500 rounded-full flex items-center justify-center z-40 w-5 h-3">
                                <Text className="text-xs text-white font-bold">0</Text>
                            </View>
                            <MaterialCommunityIcons name="bell-badge" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                            <View className="bg-white p-2 rounded-full">
                                <Entypo name="user" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <Modal
                transparent={true}
                visible={dropdownVisible}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <View
                    onPress={() => setDropdownVisible(false)}
                    className="bg-black bg-opacity-30">
                </View>
                <TouchableOpacity
                    className="flex-1"
                    onPress={() => setDropdownVisible(false)}
                    activeOpacity={1}
                >
                    <View className="absolute top-14 right-4 bg-slate-200 shadow-lg rounded-lg p-4 w-40">
                        <Text className="text-lg font-bold mb-2 text-gray-800">{user?.firstname} {user?.lastname}</Text>
                        <TouchableOpacity
                            className="flex-row items-center py-2"
                            onPress={() => {
                                navigation.navigate('Settings');
                                setDropdownVisible(false);
                            }}
                        >
                            <MaterialIcons name="settings" size={20} color="gray" />
                            <Text className="ml-2 text-gray-800">Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center py-2"
                            onPress={handleLogout}
                        >
                            <AntDesign name="logout" size={20} color="gray" />
                            <Text className="ml-2 text-gray-800">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
