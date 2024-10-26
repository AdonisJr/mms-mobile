import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import { useState, useCallback } from 'react';
import AvailableServices from '../components/page/AvailableServices';
import RequestedServices from '../components/page/admin/RequestedServices';
import Toast from 'react-native-toast-message';
import Loading from '../components/Loading';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';

export default function HomeScreen({ navigation }) {
    const { user } = useUserStore();
    const [activePage, setActivePage] = useState('requested services');
    const { setNavigation } = useCurrentNavStore();
    useFocusEffect(
        useCallback(() => {
            setNavigation('Services');
        }, [])
    );
    return (
        <View className="flex-1 py-6">
            <Header navigation={navigation} />
            <View className="bg-blue-200">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-5 ps-2 px-2 w-full pe-4">
                    <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
                        onPress={() => setActivePage('requested services')}
                    >
                        <Text className={`font-semibold ${activePage === 'requested services' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}>
                            <Text className="text-blue-200">e</Text> Requested Services
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
                        onPress={() => setActivePage('available services')}
                    >
                        <Text className={`font-semibold ${activePage === 'available services' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}>
                            Available Services
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
                        onPress={() => setActivePage('pending services')}
                    >
                        <Text className={`font-semibold ${activePage === 'pending services' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}>
                            Pending Services <Text className="text-blue-200">eee</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {activePage === 'requested services' ? (
                <RequestedServices navigation={navigation} /> // Use the new component here
            ) : (
                <AvailableServices navigation={navigation} />
            )}
            <Toast />
        </View>
    );
}
