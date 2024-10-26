
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// components
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function GSTabs() {
    return(
        <Tab.Navigator>
            <Tab.Screen name='HomeScreen' component={HomeScreen} />
            <Tab.Screen name='UserScreen' component={HomeScreen} />
        </Tab.Navigator>
    )
}

// import { View, Text } from 'react-native'
// import React from 'react'

// export default function gsTabs() {
//   return (
//     <View>
//       <Text>gsTabs</Text>
//     </View>
//   )
// }