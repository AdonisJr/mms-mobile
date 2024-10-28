import { View, Text, Button, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import { useUserStore } from '../store/userStore'
import Header from '../components/Header';
import { useState, useCallback } from 'react';
import { API_URL, API_KEY } from '@env';
import Users from '../components/page/Users';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentNavStore } from '../store/currentNavStore';

export default function UsersScreen({ navigation }) {
  const { user } = useUserStore();
  const { setNavigation } = useCurrentNavStore();
  const [activePage, setActivePage] = useState('all');

  useFocusEffect(
    useCallback(() => {
      setNavigation('Users');
    }, [])
  );

  return (
    <View className="flex-1 py-6">
      <Header navigation={navigation} />
      <View className="bg-blue-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-5 ps-2 px-2 w-full pe-4">
          <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
            onPress={(value) => setActivePage('all')}
          >
            <Text className={`font-semibold
                        ${activePage === 'all' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}
            >
              <Text className="text-blue-200">e</Text> All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
            onPress={(value) => setActivePage('general_service')}
          >
            <Text className={`font-semibold
                        ${activePage === 'general_service' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}
            >
              <Text className="text-blue-200">e</Text> ADMIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
            onPress={(value) => setActivePage('faculty')}
          >
            <Text className={`font-semibold
                        ${activePage === 'faculty' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}
            >
              FACULTY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className='h-[60px] flex-row items-center justify-center'
            onPress={(value) => setActivePage('utility_worker')}
          >
            <Text className={`font-semibold
                        ${activePage === 'utility_worker' ? 'text-lg text-black font-bold' : 'text-sm text-slate-600'}`}
            >
              GENERAL SERVICES PERSONNEL <Text className="text-blue-200">eee</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      <Users navigation={navigation} activePage={activePage} />

    </View>
  )
}