import React from 'react';

import { getAppFirstLaunched, storeFistLaunched } from '../utils/storage';

import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {useLogin} from '../context/LoginProvider';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

import OnboardingScreen from '../screens/OnBoardingScreen'

//SCREENS FOR USER
import Main from '../screens/UserScreens/Main';
import Search from '../screens/UserScreens/Search';
import Favorites from '../screens/UserScreens/Favorites';
import ResultSearch from '../screens/UserScreens/ResultSearch';

//SCREENS FOR SELLER
import EditProduct from '../screens/SellerScreens/EditProduct';
import NewProduct from '../screens/SellerScreens/NewProduct';
import MainSeller from '../screens/SellerScreens/MainSeller';

//SCREENS DEFAULT
import CustomDrawer from '../components/CustomDrawer';
import Profile from '../screens/Profile';
import ProductItem from '../screens/ProductItem';
import CommentScreen from '../screens/CommentScreen';
import Settings from '../screens/Settings';
import SellerStore from '../screens/SellerStore';

import Colors from '../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const SellerDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {fontSize: 15},
        drawerActiveTintColor: Colors.primary,
        drawerActiveBackgroundColor: Colors.secondary,
        drawerItemStyle: {
          height: 55,
          width: '100%',
          justifyContent: 'center',
          marginLeft: 0,
          borderRadius: 0,
          paddingLeft: 10,
          marginTop: 0,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="storage" size={20} color={Colors.primary} />
          ),
        }}
        name="Meus produtos"
        component={MainSeller}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="settings" size={20} color={Colors.primary} />
          ),
        }}
        name="Configurações"
        component={Settings}
      />
    </Drawer.Navigator>
  );
};

const UserDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {fontSize: 15},
        drawerActiveTintColor: Colors.primary,
        drawerActiveBackgroundColor: Colors.secondary,
        drawerItemStyle: {
          height: 55,
          width: '100%',
          justifyContent: 'center',
          marginLeft: 0,
          borderRadius: 0,
          paddingLeft: 10,
          marginTop: 0,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="home" size={20} color={Colors.primary} />
          ),
        }}
        name="Início"
        component={Main}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="search" size={20} color={Colors.primary} />
          ),
        }}
        name="Buscar"
        component={Search}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="favorite" size={20} color={Colors.primary} />
          ),
        }}
        name="Favoritos"
        component={Favorites}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <Icon name="settings" size={20} color={Colors.primary} />
          ),
        }}
        name="Configurações"
        component={Settings}
      />
    </Drawer.Navigator>
  );
};

const AuthRoutes = () => {
  const {profile} = useLogin();
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null)

  React.useEffect(() => {
    AsyncStorage.getItem('first_launched').then(value => {
      if(value == null) {
        setIsFirstLaunch(true)
        AsyncStorage.setItem('first_launched', 'false')
      } else {
        setIsFirstLaunch(false)
      }
    })
  }, [])

  console.log(profile, 'retorno do launch')


  return (
    isFirstLaunch != null && (
      <Stack.Navigator screenOptions={{headerShown: false}}>
            {isFirstLaunch && (
              <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            )}
            <Stack.Screen
              name="Main"
              component={profile.seller ? SellerDrawer : UserDrawer}
            />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="NewProduct" component={NewProduct} />
            <Stack.Screen name="ProductItem" component={ProductItem} />
            <Stack.Screen name="CommentScreen" component={CommentScreen} />
            <Stack.Screen name="SellerStore" component={SellerStore} />
            <Stack.Screen name="ResultSearch" component={ResultSearch} />
            <Stack.Screen name="MyAccount" component={Profile} />
      </Stack.Navigator>
    )
  );
};

export default AuthRoutes;
