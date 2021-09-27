import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect } from 'react';
import IndexRouter from '../src/routes/index';
import { Provider } from 'react-redux';
import store from './data/data';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';


import {
  faCheckSquare,
  faBars,
  faArrowLeft,
  faTrash,
  faSignOutAlt,
  faCalendar,
  faShareAlt,
  faPlus,
  faFileContract,
  faPencilRuler,
  faClipboardList,
  faCamera,
  faSave,
  faCircle,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

export default function App() {

  useEffect(() => {

    //adicionando icones globalmente
    try {
      library.add(
        fab,
        faCheckSquare,
        faBars,
        faArrowLeft,
        faTrash,
        faSignOutAlt,
        faCalendar,
        faShareAlt,
        faPlus,
        faFileContract,
        faPencilRuler,
        faClipboardList,
        faCamera,
        faCircle,
        faSave,
        faTrashAlt
      );
    } catch (error) {
      console.log(error);
    }

  }, [])

  const MyTheme = {
    colors: {
      primary: 'white',
      background: 'white'
    },
  };
  //theme={MyTheme}
  return (
    <Provider store={store}>
      <NavigationContainer >
        <IndexRouter />
        <StatusBar style="auto" />
      </NavigationContainer >
    </Provider>

  );
}


