import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchUserByType, deleteAvailableServices } from '../../services/apiServices';
import Toast from 'react-native-toast-message';
import Loading from '../Loading';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import UsersModal from '../modal/UsersModal';
import { useUserStore } from '../../store/userStore';
import { useCurrentNavStore } from '../../store/currentNavStore';

export default function Users({ navigation, activePage }) {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [mainDataLoading, setMainDataLoading] = useState(false);
  const { user } = useUserStore();
  const { setNavigation } = useCurrentNavStore();

  const getUsers = async () => {
    setMainDataLoading(false);
    try {
      setMainDataLoading(true);
      const response = await fetchUserByType(activePage);
      setUsers(response); // Update the state with the fetched data
      console.log('Available Users:', response); // Correct log after fetching data
    } catch (error) {
      console.log(error)
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setMainDataLoading(false);
    }
  };


  // get full date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };


  useFocusEffect(
    useCallback(() => {
      getUsers();
      setNavigation('Users');
    }, [activePage])
  );

  // Render a message while loading
  if (mainDataLoading) return <Loading />;

  // Handle the case when no services are available
  if (!users) return <Text>No available services found</Text>;


  // Render the list of available services
  return (


    <View className="p-4">

      {/* Available services list */}
      {
        !users ? '' :
          <FlatList
            className="h-[80%]"
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              console.log({ length: users.length })
              if (item.id === user?.id) {
                if (users.length === 1) {
                  return (
                    <View>
                      <Text className="text-center bg-red-50 p-2">No data</Text>
                    </View>
                  )
                }
                return null; // Don't render the item if ids match
              }

              return (
                <View className="flex-row items-center justify-between p-4 mb-3 bg-white rounded-lg shadow-md">
                  <View className='w-5/6'>
                    <Text className="text-lg font-semibold">{item?.firstname} {item?.middlename || null} {item?.lastname}</Text>
                    <Text className="text-sm text-black">{item?.email}</Text>
                    {/* <Text className="text-sm text-slate-500">{item?.type === 'general_service' ? 'ADMIN' : item.type === 'utility_worker' ? 'PERSONNEL' : item?.type.toUpperCase()}</Text> */}
                    <Text className="text-xs text-slate-500">{formatDate(item?.created_at)}</Text>
                  </View>
                  <View className='flex-col gap-5'>
                    <TouchableOpacity className="p-2 rounded-full bg-emerald-200" onPress={() => navigation.navigate('Edit User', { data: item })}>
                      <MaterialIcons name="edit" size={18} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )

            }}
          />
      }


      {/* Modal */}
      {modalVisible && <UsersModal selected={selected} setModalVisible={setModalVisible} modalVisible={modalVisible} setSelected={setSelected} getUsers={getUsers} />}
      {loading && <Loading />}

      <Toast />
    </View>
  );
}
