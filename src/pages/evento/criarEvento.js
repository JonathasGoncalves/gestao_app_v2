import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button } from 'react-native-elements';
import api from '../../services/api';
import { SearchBar } from 'react-native-elements';
import styles from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { date, timeParam, timeParam_curto, inicio_mes } from '../../functions/tempo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { CommonActions } from '@react-navigation/native';

//ACESSO AO BANCO LOCAL
import * as projetoDAO from '../../sql/DAO/projetoDAO';
import * as cooperadoDAO from '../../sql/DAO/cooperadosDAO';
import * as formularioDAO from '../../sql/DAO/formularioDAO';
import * as evento_agendaDAO from '../../sql/DAO/evento_agendaDAO';
import * as submissaoDAO from '../../sql/DAO/submissaoDAO';
import * as parametroDAO from '../../sql/DAO/parametrosDAO';

const CriarEvento = ({ navigation, id_tecnico }) => {

  const [cooperados, setCooperados] = useState([]);
  const [cooperadosTodos, setCooperadosTodos] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const [formulario, setFormulario] = useState({ label: '', value: '' });
  const [projetos, setProjetos] = useState([]);
  const [projeto, setProjeto] = useState({ label: '', value: '' });
  const [cooperadoImput, setCooperadoImput] = useState('');
  const [loading, setLoading] = useState(true);
  const [aplicando, setAplicando] = useState(false);
  const [loadingNovoProjeto, setLoadingNovoProjeto] = useState(false);
  const [listAtivo, setListAtivo] = useState(false);
  const [data_select, setData] = useState(new Date());
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [coopSelect, setCoopSelect] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  useEffect(() => {
    //ADICIONANDO BOTÃO DE VOLTAR
    navigation.setOptions({
      headerLeft: () => (
        <Button
          buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', marginLeft: 10 }}
          icon={<FontAwesomeIcon icon="arrow-left" color="white" size={25} />}
          onPress={() => navigation.goBack()}
        />
      ),
    });

    async function carregar_dados() {
      try {
        //TRAZER PROJETOS EM ABERTO
        const responseProjetos = await projetoDAO.projetosAll();
        const responseCooperados = await cooperadoDAO.cooperadosAll(inicio_mes());
        const responseFormularios = await formularioDAO.formulariosAll();
        //ARMAZENANDO COOPERADOS NO STATE
        setCooperados(responseCooperados);
        //COPIA DE COOPERADOS PARA AUXILIO NO FILTRO
        setCooperadosTodos(responseCooperados);
        //TRATANDO OS TITULOS DOS FORMULARIOS E SALVANDO NO STATE
        temp = [];
        responseFormularios.map((formulario) => {
          temp.push({ label: formulario.titulo, value: formulario.id });
        })
        setFormularios(temp);
        //TRATANDO OS TITULOS DOS PROJETOS E SALVANDO NO STATE
        temp2 = [];
        responseProjetos.map((projeto) => {
          temp2.push({ label: projeto.nome, value: projeto.id });
        })
        setProjetos(temp2);
        setLoading(false);
        setListAtivo(true);
      } catch (erro) {
        console.log(erro);
        setLoading(false);
        setAlertProps(erro);
        setAplicando(false);
        setShowAlert(true);
      }
    }
    carregar_dados();
  }, [])

  //Validar valor de entrada para a busca do cooperado
  function setCoopAction(text) {
    setCooperadoImput(text);
    filtrarCooperado(text);
  }

  async function filtrarCooperado(inputCooperado) {
    var find = {};
    if (cooperadoImput.length <= inputCooperado.length && cooperados) {
      find = cooperados.filter(function (cooperadoItem) {
        return cooperadoItem.nome.toLowerCase().startsWith(inputCooperado.toLowerCase());
      });
    } else {
      find = cooperadosTodos.filter(function (cooperadoItem) {
        return cooperadoItem.nome.toLowerCase().startsWith(inputCooperado.toLowerCase());
      });
    }
    setCooperados(find);
  }

  //ADICIONA A NOVA DATA 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data_select;
    setData(currentDate);
    setMode('time')
  };

  //ADICIONA A NOVA HORA 
  const onChangeTime = (_, selectedTime) => {
    const currentTime = selectedTime || time;
    setShow(false);
    setTime(currentTime);
  };

  //ADICIONA O FORMULARIO 
  const onChangeFormulario = (selectedForm) => {
    setFormulario({ label: selectedForm, value: selectedForm });
  };

  //ADICIONA O PROJETO 
  const onChangeProjeto = (selectedProj) => {
    setProjeto({ label: selectedProj, value: selectedProj });
  };

  //Registra evento 
  const actionAplica = async () => {

    sub_id = await submissaoDAO.novo_id_submissao();
    evento_id = await evento_agendaDAO.novo_id_evento();

    setAplicando(true);
    try {
      nova_submissao = await submissaoDAO.insertSubmissao({
        id: sub_id[0].id + 1,
        DataSubmissao: date(data_select),
        qualidade_id: coopSelect.qualidade_id,
        realizada: 0,
        aproveitamento: 0
      })

      await evento_agendaDAO.insertEventoAgenda({
        id: evento_id[0].id + 1,
        data: date(data_select),
        hora: timeParam(time),
        tecnico_id: id_tecnico,
        formulario_id: formulario.value,
        tanque_id: coopSelect.tanque_id,
        projeto_id: projeto.value,
        submissao_id: sub_id[0].id + 1
      })
      errorMsg = {
        title: 'Criar evento',
        msg: 'Evento agendado com sucesso!',
        confirm: 'Continuar',
        cancel: ''
      }
      console.log('Aqui');
      //MARCANDO QUE EXISTEM DADOS NA BASE LOCAL A SEREM ATUALIZADOS
      await parametroDAO.updateParametrosByChave('atualizar', '1');

      setAlertProps(errorMsg);
      setAplicando(false);
      setShowAlert(true);
    } catch (erro) {
      console.log(erro);
      setAlertProps(erro);
      setAplicando(false);
      setShowAlert(true);
    }
  };

  function renderCooperado(item) {

    return (
      <View style={styles.viewCard}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => selectCoop(item)}>
          <View style={styles.viewColunn}>
            <View style={styles.viewRow}>
              <Text allowFontScaling={false} allowFontScaling={false} style={styles.textLabel}>Nome</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{item.nome}</Text>
            </View>
            <View style={styles.viewRow}>
              <Text allowFontScaling={false} style={styles.textLabel}>Municipio</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{item.municipio}</Text>
            </View>
          </View>
          <View style={styles.viewRow}>
            <Text allowFontScaling={false} style={styles.textLabel}>Código:</Text>
            <Text allowFontScaling={false} style={styles.textInput}>{item.codigo_cacal}</Text>
            <Text allowFontScaling={false} style={styles.textLabel}>Tanque:</Text>
            <Text allowFontScaling={false} style={styles.textInput}>{item.tanque}</Text>
            <Text allowFontScaling={false} style={styles.textLabel}>Latão:</Text>
            <Text allowFontScaling={false} style={styles.textInput}>{item.latao}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  function selectCoop(item) {
    setListAtivo(false);
    setCoopSelect(item);
  }

  function voltar() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Agenda' },
        ],
      })
    );
  }

  return (
    <View>
      {loading ? (
        <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
      ) : listAtivo ? (
        <View>
          <SearchBar
            placeholder="Buscar Cooperado"
            onChangeText={text => setCoopAction(text)}
            value={cooperadoImput}
            inputContainerStyle={styles.searchBarCont}
            inputStyle={{ backgroundColor: 'white', borderWidth: 0 }}
            containerStyle={styles.searchBar}
          />
          <FlatList
            data={cooperados}
            keyExtractor={item => item.matricula + item.qualidade_id + item.tanque}
            renderItem={({ item }) => renderCooperado(item)}
          />
        </View>
      ) : (
        <View style={aplicando ? { opacity: 0.5 } : { opacity: 1 }}>
          <View style={styles.viewCard}>
            <View style={styles.viewColunn}>
              <View style={styles.viewRow}>
                <Text allowFontScaling={false} style={styles.textLabel}>Nome</Text>
                <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.nome}</Text>
              </View>
              <View style={styles.viewRow}>
                <Text allowFontScaling={false} style={styles.textLabel}>Municipio</Text>
                <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.municipio}</Text>
              </View>
            </View>
            <View style={styles.viewRow}>
              <Text allowFontScaling={false} style={styles.textLabel}>Código:</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.codigo_cacal}</Text>
              <Text allowFontScaling={false} style={styles.textLabel}>Tanque:</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.tanque}</Text>
              <Text allowFontScaling={false} style={styles.textLabel}>Latão:</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.latao}</Text>
            </View>
            <View style={styles.viewRow}>
              <Text allowFontScaling={false} style={styles.textLabel}>CBT:</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.cbt}</Text>
              <Text allowFontScaling={false} style={styles.textLabel}>CCS:</Text>
              <Text allowFontScaling={false} style={styles.textInput}>{coopSelect.ccs}</Text>
            </View>
          </View>

          <View style={styles.viewSelect}>
            <RNPickerSelect
              placeholder={{
                label: 'Selecione o tipo de visita',
                value: 0,
              }}
              items={formularios}
              onValueChange={(value) => onChangeFormulario(value)}
              style={{
                inputAndroid: styles.inputAndroid,
                inputAndroidContainer: styles.containerDrop,
                iconContainer: styles.containerIcon,
              }}
              value={formulario.value}
              useNativeAndroidPickerStyle={false}
              textInputProps={{ underlineColor: '#00BFFF' }}
              Icon={() => {
                return <FontAwesomeIcon icon="clipboard-list" color='#00BFFF' size={25} />;
              }}
            />
          </View>

          <View style={styles.viewSelect}>
            <RNPickerSelect
              placeholder={{
                label: 'Selecione um projeto',
                value: 0,
              }}
              items={projetos}
              onValueChange={(value) => onChangeProjeto(value)}
              style={{
                inputAndroid: styles.inputAndroid,
                inputAndroidContainer: styles.containerDrop,
                iconContainer: styles.containerIcon,
              }}
              value={projeto.value}
              useNativeAndroidPickerStyle={false}
              textInputProps={{ underlineColor: '#00BFFF' }}
              Icon={() => {
                return <FontAwesomeIcon icon="pencil-ruler" color='#00BFFF' size={25} />;
              }}
            />
          </View>

          <TouchableOpacity disabled={loading} onPress={() => setShow(true)}>
            <View style={styles.viewCalendar}>
              <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="calendar" color='#00BFFF' size={25} />
              <Text allowFontScaling={false} allowFontScaling={false} style={styles.textDate}>{date(data_select) + ' ' + timeParam_curto(time)}</Text>
            </View>
          </TouchableOpacity>
          {show &&
            <DateTimePicker
              value={data_select}
              mode={mode}
              display={'spinner'}
              is24Hour={true}
              display="default"
              onChange={mode == 'time' ? onChangeTime : onChange}
            />
          }
          <Button
            title="Aplicar"
            type="outline"
            onPress={actionAplica}
            containerStyle={loadingNovoProjeto || formulario.label == '' ? styles.containerButtonPadraoDisable : styles.containerButtonPadrao}
            titleStyle={styles.textButtonPadrao}
            disabled={loadingNovoProjeto || formulario.label == ''}
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
              voltar();
            }}
            onConfirmPressed={() => {
              voltar();
            }}
          />

          {aplicando &&
            <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
          }
        </View>
      )
      }
    </View>
  )
}

const mapStateToProps = state => ({
  id_tecnico: state.Tecnico.id
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CriarEvento);