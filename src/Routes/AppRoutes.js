import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import UserLogin from '../screens/UserScreens/Login';
import UserRegister from '../screens/UserScreens/UserRegister';
import ForgotPasswordUser from '../screens/UserScreens/ForgotPasswordUser';
import VerifyTokenUser from '../screens/UserScreens/VerifyTokenUser';
import ResetPasswordUser from '../screens/UserScreens/ResetPasswordUser';

import SellerLogin from '../screens/SellerScreens/SellerLogin';
import SellerRegister from '../screens/SellerScreens/SellerRegister/index';
import AddressInfo from '../screens/SellerScreens/SellerRegister/AddressInfo';
import EmailInfo from '../screens/SellerScreens/SellerRegister/EmailInfo';
import ForgotPasswordSeller from '../screens/SellerScreens/ForgotPasswordSeller';
import VerifyTokenSeller from '../screens/SellerScreens/VerifyTokenSeller';
import ResetPasswordSeller from '../screens/SellerScreens/ResetPasswordSeller';

const Stack = createStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
    }}>
      <Stack.Screen name="Login" component={UserLogin} />
      <Stack.Screen name="UserRegister" component={UserRegister} />
      <Stack.Screen name="addressInfo" component={AddressInfo} />
      <Stack.Screen name="EmailInfo" component={EmailInfo} />
      <Stack.Screen name="SellerLogin" component={SellerLogin} />
      <Stack.Screen name="SellerRegister" component={SellerRegister} />
      <Stack.Screen name="ForgotPasswordUser" component={ForgotPasswordUser} />
      <Stack.Screen name="VerifyTokenUser" component={VerifyTokenUser} />
      <Stack.Screen name="ResetPasswordUser" component={ResetPasswordUser} />
      <Stack.Screen name="ForgotPasswordSeller" component={ForgotPasswordSeller} />
      <Stack.Screen name="VerifyTokenSeller" component={VerifyTokenSeller} />
      <Stack.Screen name="ResetPasswordSeller" component={ResetPasswordSeller} />
    </Stack.Navigator>
  );
}
