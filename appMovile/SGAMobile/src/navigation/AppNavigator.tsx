import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { 
  PublicHomeScreen,
  PublicCatalogScreen,
  PrivateLoginScreen,
  HomeScreen, 
  ProfileScreen,
  InventoryScreen,
  ClientsScreen,
  OrdersScreen,
  NewRentScreen,
  NewClientScreen,
  NewOrderScreen,
  AddArticleScreen,
  CatalogScreen,
  MyOrdersScreen,
  AdminReportsScreen,
} from '../screens';
import { COLORS } from '../utils/constants';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { PublicHeader } from '../components/PublicHeader';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ===== NAVEGACIÓN PÚBLICA (sin login) =====
const PublicStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#9b59b6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PublicHome"
        component={PublicHomeScreen}
        options={({ navigation }) => ({
          title: 'SGA',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PrivateLogin')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>👤 Login</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="PublicCatalog"
        component={PublicCatalogScreen}
        options={({ navigation }) => ({
          title: 'Catálogo',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PrivateLogin')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>👤 Login</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="PrivateLogin"
        component={PrivateLoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// ===== NAVEGACIÓN DE VENDEDOR/ADMIN (con login) =====
// Tabs para ADMIN/Vendedor
const SellerTabNavigator = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';

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
      {/* Solo mostrar Reportes para ADMIN */}
      {isAdmin && (
        <Tab.Screen
          name="Reports"
          component={AdminReportsScreen}
          options={{
            tabBarLabel: 'Reportes',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>📊</Text>
            ),
            headerShown: false,
          }}
        />
      )}
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
  const isAdminOrSeller = user?.rol === 'ADMIN' || user?.rol === 'VENDEDOR';

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={isAdminOrSeller ? SellerTabNavigator : ProfileScreen}
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
  const { isAuthenticated, isLoading, user, token } = useAuth();

  console.log('🚀 AppNavigator - isLoading:', isLoading);
  console.log('🚀 AppNavigator - isAuthenticated:', isAuthenticated);
  console.log('🚀 AppNavigator - user:', user);
  console.log('🚀 AppNavigator - token:', token ? 'sí existe' : 'no existe');

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
          <Stack.Screen 
            name="Main" 
            component={MainStack}
            options={{ animationEnabled: false }}
          />
        ) : (
          <Stack.Screen 
            name="Public" 
            component={PublicStack}
            options={{ animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
