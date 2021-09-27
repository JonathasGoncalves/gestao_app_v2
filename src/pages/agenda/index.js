import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Agenda, LocaleConfig } from 'react-native-calendars';
import styles from './styles';
import api from './../../services/api';
import { timeToString } from '../../functions/tempo';
import { cortar_nome } from '../../functions/texto';
import atualizar_base_local from './update';
import NetInfo from "@react-native-community/netinfo";

import * as evento_agendaDAO from '../../sql/DAO/evento_agendaDAO';
import * as tanquesDAO from '../../sql/DAO/tanquesDAO';
import * as parametroDAO from '../../sql/DAO/parametrosDAO';

LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembrp', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar', 'Abril', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov.', 'Dec'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
};
LocaleConfig.defaultLocale = 'br';

const AgendaScreen = ({ clear_tecnico, navigation }) => {

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [showCancel, setShowCancel] = useState(true);
  const [items, setItems] = useState({});
  const [data, setData] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    //LISTENER PARA VERIFICAR CONEXÃO E SINCRONIZAR OS DADOS
    //CRIANDO EVENTOS PARA VERIFICAR SE O APARELHO ESTA CONECTADO A INTERNET
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        verificar_base_local();
      }
    });

    //ADICIONANDO BOTÃO DE TOGGLE
    navigation.setOptions({
      headerLeft: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginLeft: 10 }}
          icon={<FontAwesomeIcon icon="bars" color="white" size={25} />}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    });

    //ADICIONANDO BOTÃO DE LOGOUT
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginRight: 10 }}
          icon={<FontAwesomeIcon icon="sign-out-alt" color="white" size={25} />}
          onPress={() => logout()}
        />
      ),
    });

    return () => {
      unsubscribe();
    };
  }, [])

  async function verificar_base_local() {
    const atualizar = await parametroDAO.parametrosByChave('atualizar');
    if (atualizar == '1') {
      await atualizar_base_local();
    }
  }

  async function logout() {
    //LIMPAR CREDENCIAIS
    await parametroDAO.updateParametrosByChave('access_token', '');
    clear_tecnico();
  }

  //ACTION CLIQUE DO ITEM DA AGENDA
  async function item_agenda_clique(item) {

    errorMsg = {};
    //verificar se o item já foi submetido
    if (item.realizada == 1) {
      errorMsg = {
        title: 'Evento finalizado!',
        msg: 'Este evento já foi finalizado"',
        confirm: 'Continuar',
        cancel: ''
      }
      setShowCancel(false);
      setAlertProps(errorMsg);
      setShowAlert(true);
    } else if (item.data < new Date()) {
      //verificar se o item esta vencido
      errorMsg = {
        title: 'Data inválida',
        msg: 'Este evento não é mais válido"',
        confirm: 'Continuar',
        cancel: ''
      }
      setShowCancel(false);
      setAlertProps(errorMsg);
      setShowAlert(true);
    } else {
      //navegar para realizar submissao mandando o id do evento selecionado
      navigation.navigate('Formulario', {
        evento: item,
      });
    }
  }

  function renderItem(item) {
    return (
      <TouchableOpacity onPress={() => item_agenda_clique(item)}>
        <View style={styles.renderItem}>
          <Text allowFontScaling={false} style={styles.textLabel}>{item.titulo}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.textLabel}>Cooperado:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{cortar_nome(item.cooperado_nome)}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.textLabel}>Municipio:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.municipio}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.textLabel}>Tanque:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.tanque}</Text>
            <Text allowFontScaling={false} style={styles.textLabel}>Latao:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.latao}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.textLabel}>Técnico:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.tecnico_nome}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={styles.textLabel}>Data:</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.data}</Text>
            <Text allowFontScaling={false} style={styles.textValue}>{item.hora}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderEmptyDate() {
    return (
      <View style={styles.renderItem}>
        <Text allowFontScaling={false} style={styles.textValue}>Sem eventos agendados</Text>
      </View>
    );
  }

  function rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  async function buscar_eventos(day) {
    //load inicial
    data_nova = "";
    timestamp = "";

    if (day == "") {
      data_temp = new Date();
      timestamp = data_temp.getTime();
      data_nova = timeToString(timestamp - 10 * 24 * 60 * 60 * 1000);
    } else {
      timestamp = day.timestamp;
      data_nova = timeToString(day.timestamp - 10 * 24 * 60 * 60 * 1000);
    }
    try {

      const eventos = await evento_agendaDAO.evento_exibir_All();

      //copia do state com os itens
      itensCop = [];
      for (let i = -6; i < 84; i++) {
        data_nova = timeToString(timestamp + i * 24 * 60 * 60 * 1000);
        itensCop[data_nova] = [];
        eventos.map((evento) => {
          if (evento.data == data_nova) {
            //adiciona o evento na sua respectiva chave de data
            itensCop[data_nova].push(evento);
          }
        })
      }
      const newItems = {};
      Object.keys(itensCop).forEach(key => { newItems[key] = itensCop[key]; });
      setItems(newItems);
    } catch (erro) {
      erro.msg = "Não foi possivel carregar os itens da agenda!"
      setAlertProps(erro);
      setShowAlert(true);
    }
  }

  const adicionarEvento = async () => {
    navigation.navigate('Criar Evento');
  }

  function rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        renderItem={(item) => renderItem(item)}
        renderEmptyDate={() => renderEmptyDate()}
        loadItemsForMonth={(day) => buscar_eventos(day)}
        onDayChange={(day) => buscar_eventos(day)}
        onDayPress={(day) => buscar_eventos(day)}
        rowHasChanged={(r1, r2) => rowHasChanged(r1, r2)}
      />

      <Button
        type="outline"
        onPress={adicionarEvento}
        buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF' }}
        containerStyle={styles.containerButtonPadraoTemp}
        icon={
          <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="plus" color="white" size={25} />
        }
      />

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertProps.title}
        message={alertProps.msg}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText={alertProps.cancel}
        confirmText={alertProps.confirm}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);