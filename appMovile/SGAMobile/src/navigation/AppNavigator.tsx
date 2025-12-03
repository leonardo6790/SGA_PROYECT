import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { 
  LoginScreen, 
  HomeScreen, 
  ProfileScreen,
  InventoryScreen,
  ClientsScreen,
  OrdersScreen,
  NewRentScreen,
  NewClientScreen,
  NewOrderScreen,
  AddArticleScreen,
} from '../screens';
import { COLORS } from '../utils/constants';
import { ActivityIndicator, View, Text } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs para ADMIN/Vendedor
const SellerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: 'Inventario',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>📋</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Órdenes',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>📄</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>👥</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>👤</Text>
          ),
          headerTitle: 'Mi Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

// Tabs para Cliente (vista simplificada)
const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>🏪</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>👤</Text>
          ),
          headerTitle: 'Mi Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack principal con modales
const MainStack = () => {
  const { user } = useAuth();
  const isAdminOrSeller = user?.rol === 'ADMIN' || user?.rol === 'vendedor';

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={isAdminOrSeller ? SellerTabNavigator : CustomerTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewRent"
        component={NewRentScreen}
        options={{
          title: 'Nuevo Alquiler',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="NewClient"
        component={NewClientScreen}
        options={{
          title: 'Registrar Cliente',
        }}
      />
      <Stack.Screen
        name="NewOrder"
        component={NewOrderScreen}
        options={{
          title: 'Nueva Orden',
        }}
      />
      <Stack.Screen
        name="AddArticle"
        component={AddArticleScreen}
        options={{
          title: 'Agregar Artículo',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStack} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
