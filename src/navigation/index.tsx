import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 导入屏幕组件
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CallScreen from '../screens/CallScreen';
import CalendarScreen from '../screens/CalendarScreen';
import DocumentScreen from '../screens/DocumentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CallActiveScreen from '../screens/CallActiveScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import DocumentDetailScreen from '../screens/DocumentDetailScreen';
import PaymentScreen from '../screens/PaymentScreen';
import InterpreterListScreen from '../screens/InterpreterListScreen';

import { RootStackParamList, MainTabParamList } from '../types';
import { useUserStore } from '../store';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 主标签导航
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Call':
              iconName = 'call';
              break;
            case 'Calendar':
              iconName = 'event';
              break;
            case 'Document':
              iconName = 'description';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Call" 
        component={CallScreen} 
        options={{ tabBarLabel: '通话' }} 
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ tabBarLabel: '日历' }} 
      />
      <Tab.Screen 
        name="Document" 
        component={DocumentScreen} 
        options={{ tabBarLabel: '文档' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: '我的' }} 
      />
    </Tab.Navigator>
  );
}

// 根导航
export default function Navigation() {
  const { isAuthenticated } = useUserStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // 未登录时的屏幕
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // 已登录时的屏幕
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="CallScreen" 
              component={CallActiveScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="AppointmentDetail" 
              component={AppointmentDetailScreen}
              options={{ 
                headerShown: true,
                title: '预约详情',
                headerBackTitle: '返回'
              }}
            />
            <Stack.Screen 
              name="DocumentDetail" 
              component={DocumentDetailScreen}
              options={{ 
                headerShown: true,
                title: '文档详情',
                headerBackTitle: '返回'
              }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen}
              options={{ 
                headerShown: true,
                title: '充值',
                headerBackTitle: '返回'
              }}
            />
            <Stack.Screen 
              name="InterpreterList" 
              component={InterpreterListScreen}
              options={{ 
                headerShown: true,
                title: '选择翻译员',
                headerBackTitle: '返回'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 