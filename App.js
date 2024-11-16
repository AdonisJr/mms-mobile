import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import Stack Navigator
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import Toast from 'react-native-toast-message'; // Import Toast
import { useNavigation, useRoute } from '@react-navigation/native';

// components import
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen'; // Import Login Screen
import RegistrationScreen from './src/screens/RegistrationScreen';
import UsersScreen from './src/screens/UsersScreen';
import FacultyScreen from './src/screens/FacultyScreen';
import RequestServices from './src/components/page/faculty/RequestServices';
import SettingsScreen from './src/screens/SettingsScreen';
import WorkerSettings from './src/screens/worker/WorkerSettings';

// data
import { getData } from './src/store/LocalStorage';
import { useUserStore } from './src/store/userStore';
import { useCurrentNavStore } from './src/store/currentNavStore';
import AssignTask from './src/screens/AssignTask';
import TasksScreen from './src/screens/admin/TasksScreen';
import WorkerScreen from './src/screens/worker/WorkerScreen';
import PreventiveMaintenance from './src/screens/admin/PreventiveMaintenance';
import InsertPreventiveMaintenance from './src/screens/admin/SchedulePreventiveMaintenance';
import InsertUser from './src/screens/admin/InsertUser';
import PreventiveMaintenanceTask from './src/screens/worker/PreventiveMaintenanceTask';
import EditScheduledPreventiveMaintenance from './src/screens/admin/EditScheduledPreventiveMaintenance';
import EditUser from './src/screens/admin/EditUser';
import InsertInventory from './src/screens/admin/InsertInventory';
import InventoryScreen from './src/screens/admin/InventoryScreen';
import EditInventory from './src/screens/admin/EditInventory';
import EditRequestedServices from './src/components/page/faculty/EditRequestedServices';
import EditTask from './src/screens/admin/EditTask';
import { ViewImageScreen } from './src/components/page/ViewImageScreen';
import NotificationScreen from './src/screens/NotificationScreen';

// expo related
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// expo
function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { setUser, setAccessToken } = useUserStore();
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token || ''))
      .catch(error => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const getCredentials = async () => {
    const token = await getData('accessToken');
    const storedUser = await getData('user');
    setAccessTokenState(token);
    setUserState(storedUser);
    setUser(storedUser); // Update Zustand store
    setAccessToken(token);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCredentials();
      setIsLoading(false); // Mark loading as false when data is fetched
    };
    fetchData();
  }, []);

  // Show loading screen while fetching credentials
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Toast />
      <Stack.Navigator initialRouteName={user?.type === 'general_service' ? 'MainApp' : user?.type === 'faculty' ? 'FacultyApp' : user?.type === 'utility_worker' ? 'WorkerApp' : 'LoginScreen'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        <Stack.Screen name="FacultyApp" component={FacultyApp} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerApp" component={WorkerApp} options={{ headerShown: false }} />
        <Stack.Screen name="Image Screen" component={ViewImageScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState('Services'); // Default route
  const navigation = useNavigation(); // Get the navigation object
  const route = useRoute(); // Get the current route object
  const { currentNav, setCurrentApp } = useCurrentNavStore();

  useEffect(() => {
    setCurrentApp('Main')
  }, [])
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => (
          <View className="flex-1">
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Services') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Users') {
                    iconName = focused ? 'people' : 'people-outline';
                  } else if (route.name === 'Maintenance') {
                    iconName = focused ? 'newspaper' : 'newspaper-outline';
                  } else if (route.name === 'Task') {
                    iconName = focused ? 'construct' : 'construct-outline';
                  } else if (route.name === 'Maintenance') {
                    iconName = focused ? 'newspaper' : 'newspaper-outline';
                  } else if (route.name === 'Inventory') {
                    iconName = focused ? 'add-circle' : 'add-circle-outline';
                  } else {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: 'teal',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: 'bg-gray-200 h-16 p-3 shadow-lg',
                tabBarLabelStyle: 'text-sm font-semibold',
              })}
            >
              <Tab.Screen name="Services" component={HomeScreen} />
              <Tab.Screen name="Users" component={UsersScreen} />
              <Tab.Screen name="Task" component={TasksScreen} />
              <Tab.Screen name="Maintenance" component={PreventiveMaintenance} />
              <Tab.Screen name="Inventory" component={InventoryScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
            {/* Floating Add Button using NativeWind */}
            <TouchableOpacity className="absolute bottom-8 self-center bg-white rounded-full z-10"
              onPress={() =>
                currentNav === 'PreventiveMaintenance'
                  ? navigation.navigate('Schedule Preventive Maintenance')
                  : currentNav === 'Inventory'
                    ? navigation.navigate('Inventory Equipment')
                    : navigation.navigate('Insert User')
              }
              // onPress={() =>
              //   currentNav === 'PreventiveMaintenance'
              //     ? navigation.navigate('Schedule Preventive Maintenance')
              //     : currentNav === 'Inventory' ? navigation.navigate('Inventory Equipment') : navigation.navigate('Inser tUser')
              // }
              style={{ display: (currentNav === 'PreventiveMaintenance' || currentNav === 'Users' || currentNav === 'Inventory') ? 'flex' : 'none' }} // Multiple conditions for visibility

            >
              <Ionicons name="add-circle" size={60} color="powderblue" />
            </TouchableOpacity>
          </View>
        )}
      </Stack.Screen>
      <Stack.Screen name="AssignTask" component={AssignTask} />
      <Stack.Screen name="Scheduled Preventive Maintenance" component={EditScheduledPreventiveMaintenance} />
      <Stack.Screen name="Schedule Preventive Maintenance" component={InsertPreventiveMaintenance} />
      <Stack.Screen name="Insert User" component={InsertUser} />
      <Stack.Screen name="Edit User" component={EditUser} />
      <Stack.Screen name="Inventory Equipment" component={InsertInventory} />
      <Stack.Screen name="Edit Inventory" component={EditInventory} />
      <Stack.Screen name="Edit Task" component={EditTask} />
    </Stack.Navigator>

  );
}

function FacultyApp() {
  const navigation = useNavigation(); // Get the navigation object
  const { currentNav, setCurrentApp } = useCurrentNavStore();
  useEffect(() => {
    setCurrentApp('Faculty')
  }, [])
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => (
          <View className="flex-1">
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Services') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: 'teal',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: 'bg-gray-200 h-16 p-3 shadow-lg',
                tabBarLabelStyle: 'text-sm font-semibold',
              })}
            >
              <Tab.Screen name="Services" component={FacultyScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>

            {/* Floating Add Button using NativeWind */}
            <TouchableOpacity
              className="absolute bottom-5 self-center bg-white rounded-full z-10"
              onPress={() => navigation.navigate('Request Services')}
              style={{ display: (currentNav === 'Faculty Screen') ? 'flex' : 'none' }} // Multiple conditions for visibility
            >
              <Ionicons name="add-circle" size={60} color="powderblue" />
            </TouchableOpacity>
          </View>
        )}
      </Stack.Screen>
      <Stack.Screen name="Request Services" component={RequestServices} />
      <Stack.Screen name="Edit Requested Services" component={EditRequestedServices} />
    </Stack.Navigator>
  );
}

function WorkerApp() {
  const navigation = useNavigation(); // Get the navigation object
  const { setCurrentApp } = useCurrentNavStore();
  useEffect(() => {
    setCurrentApp('Worker')
  }, [])
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {() => (
          <View className="flex-1">
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'AvailableTask') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  } else if (route.name === 'PreventiveTask') {
                    iconName = focused ? 'newspaper' : 'newspaper-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: 'teal',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: 'bg-gray-200 h-16 p-3 shadow-lg',
                tabBarLabelStyle: 'text-sm font-semibold',
              })}
            >
              <Tab.Screen name="AvailableTask" component={WorkerScreen} />
              <Tab.Screen name="PreventiveTask" component={PreventiveMaintenanceTask} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>


          </View>
        )}
      </Stack.Screen>
      <Stack.Screen name="Request Services" title="wew" component={RequestServices} />
    </Stack.Navigator>
  );
}

// async function sendPushNotification(expoPushToken) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };

//   await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

