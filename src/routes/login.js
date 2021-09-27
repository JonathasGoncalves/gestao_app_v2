import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './../pages/login/index';
import Database from './../sql/database/database_init';

const CreateStackLogin = createStackNavigator();

function LoginStack() {
  return (
    <CreateStackLogin.Navigator initialRouteName="Index">
      <CreateStackLogin.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <CreateStackLogin.Screen
        name="UpdateDB"
        component={Database}
        options={{
          title: 'Atualizando dados',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'normal',
          },
        }}
      />
    </CreateStackLogin.Navigator>
  );
}

export default LoginStack;