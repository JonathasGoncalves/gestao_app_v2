import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { CommonActions } from '@react-navigation/native';
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './styles';
import AwesomeAlert from 'react-native-awesome-alerts';
import NetInfo from "@react-native-community/netinfo";
import api from '../../services/api';
import { timeToString } from '../../functions/tempo';
import * as tecnicoDAO from '../../sql/DAO/tecnicoDAO';
import * as temaDAO from '../../sql/DAO/temaDAO';
import * as formularioDAO from '../../sql/DAO/formularioDAO';
import * as projetoDAO from '../../sql/DAO/projetoDAO';
import * as perguntaDAO from '../../sql/DAO/perguntaDAO';
import * as opcaoDAO from '../../sql/DAO/opcaoDAO';
import * as opcao_perguntaDAO from '../../sql/DAO/opcao_perguntaDAO';
import * as cooperadoDAO from '../../sql/DAO/cooperadosDAO';
import * as qualidadeDAO from '../../sql/DAO/qualidadesDAO';
import * as tanqueDAO from '../../sql/DAO/tanquesDAO';
import * as submissaoDAO from '../../sql/DAO/submissaoDAO';
import * as opsDAO from '../../sql/DAO/opsDAO';
import * as resposta_observacaoDAO from '../../sql/DAO/resposta_observacaoDAO';
import * as imagen_obsDAO from '../../sql/DAO/imagem_obsDAO';
import * as evento_agendaDAO from '../../sql/DAO/evento_agendaDAO';
import * as resposta_escritaDAO from '../../sql/DAO/resposta_escritaDAO';
import * as resposta_perguntaDAO from '../../sql/DAO/resposta_perguntaDAO';
import * as rpsDAO from '../../sql/DAO/rpsDAO';
import * as parametroDAO from '../../sql/DAO/parametrosDAO';

const Database = ({ navigation, aprova_login, clear_tecnico }) => {

  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const [updateBase, setUpdateBase] = useState(false);
  const [sqlite_etapa, setSqlite_etapa] = useState('');


  useEffect(() => {

    //ADICIONANDO BOTÃO DE TOGGLE
    navigation.setOptions({
      headerLeft: () => (
        <View />
      ),
    });

    //ADICIONANDO BOTÃO DE TOGGLE
    navigation.setOptions({
      headerRight: () => (
        <View />
      ),
    });

    //CRIANDO EVENTOS PARA VERIFICAR SE O APARELHO ESTA CONECTADO A INTERNET
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setUpdateBase(true);
        database_init();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [])


  async function database_init() {

    try {
      //CREATE TABLE
      await tecnicoDAO.createTableTecnico();
      await temaDAO.createTableTema();
      await formularioDAO.createTableFormulario();
      await projetoDAO.createTableProjeto();
      await projetoDAO.createTableProjeto();
      await perguntaDAO.createTablePerguntas();
      await opcaoDAO.createTableOpcoes();
      await opcao_perguntaDAO.createTableOpcaoPergunta();
      await cooperadoDAO.createTableCooperado();
      await qualidadeDAO.createTableQualidade();
      await tanqueDAO.createTableTanques();
      await submissaoDAO.createTableSubmissao();
      await opsDAO.createTableOPS();
      await resposta_observacaoDAO.createTableRespostaObservacao();
      await imagen_obsDAO.createTableImagenOBS();
      await evento_agendaDAO.createTableEventoAgenda();
      await resposta_escritaDAO.createTableRespostaEscrita();
      await resposta_perguntaDAO.createTableRespostaPergunta();
      await rpsDAO.createTableRPS();

      //INSERT
      //RECUPERANDO AS INFORMAÇÕES DA BASE
      //TECNICOS
      setSqlite_etapa('Configurando informações dos técnicos');
      const { data: { tecnicos } } = await api.get('api/tecnico/tecnicos_all');
      await new Promise.all(
        await tecnicoDAO.insertTecnico_init(tecnicos)
      );

      //FORMULARIOS
      setSqlite_etapa('Configurando informações dos formulários');
      const { data: { formularios } } = await api.get('api/evento/formularios_all');
      await new Promise.all(
        await formularioDAO.insertFormulario_init(formularios)
      );

      //TEMA
      setSqlite_etapa('Configurando informações dos relatórios - temas');
      const { data: { temas } } = await api.get('api/evento/temas_all');
      await new Promise.all(
        await temaDAO.insertTema_init(temas)
      );

      //PROJETO
      setSqlite_etapa('Configurando informações dos relatórios - projetos');
      const { data: { projetos } } = await api.get('api/evento/projetos_all');
      await new Promise.all(
        await projetoDAO.insertProjeto_init(projetos)
      );

      //PERGUNTAS
      setSqlite_etapa('Configurando informações dos relatórios - perguntas');
      const { data: { perguntas } } = await api.get('api/evento/perguntas_all');
      await new Promise.all(
        await perguntaDAO.insertPergunta_init(perguntas)
      );

      //OPCOES
      setSqlite_etapa('Configurando informações dos relatórios - opções');
      const { data: { opcoes } } = await api.get('api/evento/opcoes_all');
      await new Promise.all(
        await opcaoDAO.insertOpcao_init(opcoes)
      );

      //OPCAO_PERGUNTA
      const { data: { opcoes_perguntas } } = await api.get('api/evento/opcoes_perguntas_all');
      await new Promise.all(
        await opcao_perguntaDAO.insertOpcaoPergunta_init(opcoes_perguntas)
      );

      //COOPERADOS
      setSqlite_etapa('Configurando informações dos cooperados');
      const { data: { cooperados } } = await api.get('api/cooperado/listar_cooperados');
      await new Promise.all(
        await cooperadoDAO.insertCooperado_init(cooperados)
      );

      //QUALIDADES
      setSqlite_etapa('Configurando informações de qualidade');
      const { data: { qualidades } } = await api.get('api/qualidade/ultimas_qualidades');
      await new Promise.all(
        await qualidadeDAO.insertQualidade_init(qualidades)
      );

      //TANQUES
      setSqlite_etapa('Configurando informações dos tanques');
      const { data: { tanques } } = await api.get('api/tanque/tanques_all');
      await new Promise.all(
        await tanqueDAO.insertTanque_init(tanques)
      );

      //SUBMISSOES
      setSqlite_etapa('Configurando informações da agenda');
      //RECUPERANDO A DATA BASE DAS SUBMISSOES A SEREM BUSCADAS (ATÉ 10 DIAS ATRÁS)
      data_temp = new Date();
      timestamp = data_temp.getTime();
      data_nova = timeToString(timestamp - 15 * 24 * 60 * 60 * 1000);
      const { data: { submissoes } } = await api.post('api/evento/submissoes_por_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await submissaoDAO.insertSubmissao_init(submissoes)
      )

      //RECUPERANDO AS RESPOSTAS DAS SUBMISSÕES ACIMA
      const { data: { ops } } = await api.post('api/evento/ops_por_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await opsDAO.insertOPS_init(ops)
      );


      //RECUPERANDO AS RESPOSTAS DE OBS DAS SUBMISSOES ACIMA
      const { data: { resposta_observacao } } = await api.post('api/evento/resposta_observacao_por_data', {
        data_base: data_nova
      });

      await new Promise.all(
        await resposta_observacaoDAO.insertRespostaObsersavacao_init(resposta_observacao)
      );

      //RECUPERANDO AS IMAGENS DAS SUBMISSOES ACIMA
      const { data: { imagem_obs_data } } = await api.post('api/evento/imagem_obs_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await imagen_obsDAO.insertImagenOBS_init(imagem_obs_data)
      );

      //RECUPERANDO OS EVENTOS DAS SUBMISSOES ACIMA
      const { data: { evento_agenda } } = await api.post('api/evento/eventos_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await evento_agendaDAO.insertEventoAgenda_init(evento_agenda)
      );

      //RECUPERANDO OS RESPOSTAS ESCRITAS DAS SUBMISSOES ACIMA
      const { data: { resposta_escrita } } = await api.post('api/evento/resposta_escrita_por_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await resposta_escritaDAO.insertRespostaEscrita_init(resposta_escrita)
      );

      //RECUPERANDO OS RESPOSTAS PERGUNTAS DAS SUBMISSOES ACIMA
      const { data: { resposta_pergunta } } = await api.post('api/evento/resposta_pergunta_por_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await resposta_perguntaDAO.insertRespostaPergunta_init(resposta_pergunta)
      );

      //RECUPERANDO OS RESPOSTAS PERGUNTAS DAS SUBMISSOES ACIMA
      const { data: { rps } } = await api.post('api/evento/rps_por_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await rpsDAO.insertRPS_init(rps)
      );
      setUpdateBase(false);
      aprova_login();
    } catch (error) {
      errorMsg = {
        title: 'Erro na atualização da base local',
        msg: String(error),
        confirm: 'Continuar',
        cancel: '',
        identificado: true
      }
      setAlertProps(errorMsg);
      setShowAlert(true);
    }
  }

  async function sair() {
    setShowAlert(false)
    await parametroDAO.updateParametrosByChave('access_token', '');
    clear_tecnico();
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Login',
        params: {},
      })
    );
  }

  return (
    <View style={{ flex: 1 }}>

      {
        updateBase &&
        <>
          <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
          <View>
            <Text style={styles.textUpdate}>Atualizando base local</Text>
            <Text style={styles.textUpdateFase}>{sqlite_etapa}</Text>
          </View>
        </>
      }
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
          sair();
        }}
        onConfirmPressed={() => {
          sair();
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

export default connect(mapStateToProps, mapDispatchToProps)(Database);

