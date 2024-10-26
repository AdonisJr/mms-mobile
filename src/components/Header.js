import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useUserStore } from '../store/userStore';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Header({ navigation }) {
    const { user, logout } = useUserStore();

    return (
        <View className="bg-blue-200"><View className="p-4 bg-blue-800 rounded-3xl mx-2">
            <View className="absolute -top-2 flex-row w-screen justify-center">
                <View className="bg-slate-100 w-[300px] h-[20px] rounded-lg">
                    <Text></Text>
                </View>
            </View>
            <View className="flex-row justify-between items-center">
                <TouchableOpacity className="flex-col items-center" onPress={() => navigation.navigate('MainApp')}>
                    <AntDesign name="bars" size={25} color="white" />
                </TouchableOpacity>
                <Text className="text-xs font-bold text-white">GSMMS</Text>
                <TouchableOpacity onPress={() => [navigation.navigate('Login'), logout()]}>
                    <View className="bg-white p-2 rounded-full">
                        <Entypo name="user" size={25} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        </View>

    )
}
