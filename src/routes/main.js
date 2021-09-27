import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AgendaScreen from './../pages/agenda/index';
import Relatorio from './../pages/relatorios/index';
import { PixelRatio } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CriarEvento from '../pages/evento/criarEvento';
import Formulario from '../pages/formulario/index';

var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var MARGIN_PADRAO_LATERAL = 10;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;
var MARGIN_TOP = 50;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  MARGIN_PADRAO_LATERAL = 5;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
  MARGIN_TOP = 40;
}

const CreateMainStack = createStackNavigator();
function AgendaIndex() {
  return (
    <CreateMainStack.Navigator>
      <CreateMainStack.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          title: 'Agenda',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          unmountOnBlur: true,
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: FONT_SIZE_TEXT,
          },
        }}
      />

      <CreateMainStack.Screen
        name="Criar Evento"
        component={CriarEvento}
        options={{
          title: 'Criar Evento',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: FONT_SIZE_TEXT
          },
        }}
      />

      <CreateMainStack.Screen
        name="Formulario"
        component={Formulario}
        options={{
          title: 'Formulário',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: FONT_SIZE_TEXT
          },
        }}
      />
    </CreateMainStack.Navigator>
  );
}

function RelatorioIndex() {
  return (
    <CreateMainStack.Navigator>
      <CreateMainStack.Screen
        name="Relatorio"
        component={Relatorio}
        options={{
          title: 'Relatórios',
          headerStyle: {
            backgroundColor: '#00BFFF',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: FONT_SIZE_TEXT
          },
        }}
      />
    </CreateMainStack.Navigator>
  );
}

const CreateMainDrawer = createDrawerNavigator();
function MainDrawer() {
  return (
    <CreateMainDrawer.Navigator
      initialRouteName="Index"
      drawerStyle={{
        backgroundColor: 'white',
        width: '50%'
      }}
      drawerContentOptions={{
        activeTintColor: '#00BFFF',
        labelStyle: { fontSize: FONT_SIZE_TEXT }
      }}
    >
      <CreateMainDrawer.Screen
        name="Index"
        component={AgendaIndex}
        options={{ unmountOnBlur: true }}
      />
      <CreateMainDrawer.Screen
        name="Relatorio"
        component={RelatorioIndex}
        options={{ unmountOnBlur: true }}
      />
    </CreateMainDrawer.Navigator>
  );
}

export default MainDrawer;
