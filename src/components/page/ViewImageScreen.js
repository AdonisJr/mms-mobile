import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, Button } from 'react-native-elements';
import { IMG_URL } from '@env';

export const ViewImageScreen = ({ route, navigation }) => {
  const data = route.params.data; // Get image URI from params
  console.log(data.proof)
  
  return (
    <View className="flex-1 items-center bg-gray-100 p-4">
      <View>
        <Text className="text-2xl py-3 px-2">Image Preview</Text>
      </View>
      <View className="w-full border-2 border-slate-200 rounded-2xl h-[90%]">
        {data?.proof ? (
          <Image
            // source={{ uri: `http://192.168.1.167:8000/storage/proofs/1730018966_proof.jpg` }}
            source={{ uri: `${IMG_URL}${data?.proof}` }}
            className="w-full h-full border border-gray-800"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-center text-red-500">No Image Available</Text>
        )}
      </View>
      {/* <Button
        title="Close"
        buttonStyle={`mt-4 bg-blue-600 rounded-full w-1/3`}
        onPress={() => navigation.goBack()}
      /> */}
    </View>
  );
};