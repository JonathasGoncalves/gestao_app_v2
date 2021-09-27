import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Button, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { date } from '../../functions/tempo';
import styles from './styles';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import AwesomeAlert from 'react-native-awesome-alerts';

const Relatorio = ({ navigation }) => {

  const [data, setData] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [padraoCheckBox, setPadraoCbtCheckBox] = useState('No Padrão');
  const [relCheckBox, setCelCheckBox] = useState('CBT');
  const [loading, setLoading] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [filtrando, setFiltrando] = useState(true);
  const [qualidades, setQualidades] = useState([]);
  const [donwloadFile, setDonwloadFile] = useState(0);
  const [qualidadesRender, setQualidadesRender] = useState([]);
  const [qualidadesFim, setQualidadesFim] = useState(false);
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
  })

  //ADICIONA A NOVA DATA 
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDate(false);
    setData(currentDate);
  };

  //ALTERA OS VALORES DOS CHECKBOX
  const checkBoxActionRel = (value) => {
    setCelCheckBox(value);
  }
  const checkBoxActionPadrao = (value) => {
    setPadraoCbtCheckBox(value);
  }

  //APLICA O FILTRO SELECIONADO E REALIZA A SOLICITAÇÃO A API
  const actionAplica = async () => {
    setLoading(true);
    tempData = date(data).split('-');
    dataReq = tempData[0] + tempData[1];
    //REALIZA A REQUISIÇÃO DAS QUALIDADES
    try {
      const qualidadesResponse = await api.post('api/cooperado/relatorio_qualidade', {
        data_referencia: dataReq,
        relatorio: relCheckBox,
        filtro: padraoCheckBox == "No Padrão" ? '<=' : '>',
        padrao: relCheckBox == 'CBT' ? 300 : 500,
      })
      setQualidadesRender(qualidadesResponse.data.qualidades.slice(0, 20));
      setQualidades(qualidadesResponse.data.qualidades);
      navigation.setOptions(
        {
          title: relCheckBox + ' ' + padraoCheckBox + ' - ' + tempData[0] + '-' + tempData[1],
          headerTitleStyle: {
            fontSize: 16
          }
        }
      )
      setLoading(false);
      setFiltrando(false);
    } catch (error) {
      setAlertProps(error);
      setLoading(false);
      setShowAlert(true);
    }
  }


  const updateQualidades = () => {
    //SE NÃO CHEGOU AO FIM DO ARRAY DE QUALIDADES, PODE ATUALIZAR
    if (!qualidadesFim) {
      //MARCAR ATUALIZANDO LIST
      setAtualizando(true);
      //ARRAY PARA O PUSH
      qualidadesRenderCopy = [];
      //COPIA OS REGISTROS Q ESTÃO EM QUALIDADERENDER
      qualidadesRenderCopy = qualidadesRender.slice();
      //VERIFICA SE AINDA EXISTEM 20 REGISTROS NO ARRAY DE QUALIDADES A SEREM ADICIONADOS, SE SIM
      if (qualidades[qualidadesRender.length + 19]) {
        //CORTA OS PRÓXIMOS 20 REGISTROS
        qualidadesRenderCopy = qualidadesRenderCopy.concat(qualidades.slice(qualidadesRender.length, qualidadesRender.length + 20));
      } else {
        //SE NÃO TEM, VERIFICA QUANTOS FALTAM E ADICONA SOMENTE ELES
        valoresRestantes = qualidades.length - qualidadesRender.length;
        //CORTA OS PRÓXIMOS 20 REGISTROS
        qualidadesRenderCopy.push(qualidades.slice(qualidadesRender.length, qualidadesRender.length + valoresRestantes));
        //MARCAR O FIM DE QUALIDADES
        setQualidadesFim(true);
      }
      //SET O ARRAY COM OS NOVOS REGISTROS EM QUALIDADESRENDER 
      setQualidadesRender(qualidadesRenderCopy);
      //FIM DA ATUALIZAÇÃO DO LIST

      setAtualizando(false);
    }
  }

  function renderFooter() {
    if (!atualizando) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  const shareReport = async () => {
    setLoading(true);
    try {
      nome_arquivo = relCheckBox + padraoCheckBox + dataReq + '.xlsx';

      const { exists } = await FileSystem.getInfoAsync(FileSystem.documentDirectory + nome_arquivo)
      if (exists) {
        await FileSystem.deleteAsync(FileSystem.documentDirectory + nome_arquivo);
      }

      await api.post('/api/cooperado/gerar_excel_qualidade', {
        relatorio: relCheckBox,
        filtro: padraoCheckBox == "No Padrão" ? '<=' : '>',
        padrao: relCheckBox == 'CBT' ? 300 : 500,
        data_referencia: dataReq,
      });

      const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDonwloadFile(progress);
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        'http://apigestaocooperados.selita.coop.br/storage/qualidades.xlsx',
        FileSystem.documentDirectory + 'qualidades.xlsx',
        {},
        callback
      );

      const { uri } = await downloadResumable.downloadAsync();
      MailComposer.composeAsync({
        recipient: "",
        subject: "Relatório de Qualidade",
        body: "Segue relatório referênte a " + relCheckBox + " " + padraoCheckBox + " " + dataReq,
        attachments: [uri]
      });
      setLoading(false);

    } catch (error) {
      console.log(error);
      setAlertProps(error);
      setLoading(false);
      setShowAlert(true);
    }

  }

  function renderLinha(qualidade) {
    return (
      <View style={styles.viewList}>
        <View>
          <Text allowFontScaling={false} style={styles.textValue}>
            {qualidade.nome}
          </Text>
          <Text allowFontScaling={false} style={styles.textValue}>
            {qualidade.municipio}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text allowFontScaling={false} style={styles.textLabel}>
            Tanque:
          </Text>
          <Text allowFontScaling={false} style={styles.textValue}>
            {qualidade.tanque}
          </Text>
          <Text allowFontScaling={false} style={styles.textLabel}>
            CBT:
          </Text>
          <Text allowFontScaling={false} style={styles.textValue}>
            {qualidade.cbt}
          </Text>
          <Text allowFontScaling={false} style={styles.textLabel}>
            CCS:
          </Text>
          <Text allowFontScaling={false} style={styles.textValue}>
            {qualidade.ccs}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={!loading ? { flex: 1 } : { flex: 1, opacity: 0.5 }}>
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
      {filtrando ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              disabled={loading}
              checkedColor='#00BFFF'
              title='CBT'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={relCheckBox == 'CBT'}
              containerStyle={styles.containerButtonCheck}
              onPress={() => checkBoxActionRel("CBT")}
            />
            <CheckBox
              disabled={loading}
              checkedColor='#00BFFF'
              title='CCS'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={relCheckBox == 'CCS'}
              containerStyle={styles.containerButtonCheck}
              onPress={() => checkBoxActionRel("CCS")}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              disabled={loading}
              checkedColor='#00BFFF'
              title='No Padrão'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={padraoCheckBox == "No Padrão"}
              containerStyle={styles.containerButtonCheck}
              onPress={() => checkBoxActionPadrao("No Padrão")}
            />
            <CheckBox
              disabled={loading}
              checkedColor='#00BFFF'
              title='Fora Do Padrão'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={padraoCheckBox == "Fora Do Padrão"}
              containerStyle={styles.containerButtonCheck}
              onPress={() => checkBoxActionPadrao("Fora Do Padrão")}
            />
          </View>
          <TouchableOpacity disabled={loading} onPress={() => setShowDate(true)}>
            <View style={styles.viewCalendar}>
              <FontAwesomeIcon style={{ alignSelf: 'center' }} icon="calendar" color='#00BFFF' size={25} />
              <Text allowFontScaling={false} style={styles.textDate}>{date(data)}</Text>
            </View>
          </TouchableOpacity>

          {showDate &&
            <DateTimePicker
              value={data}
              mode={'datetime'}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          }

          <Button
            title="Aplicar"
            type="outline"
            onPress={actionAplica}
            containerStyle={loading ? styles.containerButtonPadraoDisable : styles.containerButtonPadrao}
            titleStyle={styles.textButtonPadrao}
            disabled={loading}
          />
        </View>
      ) : qualidadesRender.length > 0 ? (
        <View>
          <FlatList
            data={qualidadesRender}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderLinha(item)}
            onEndReached={updateQualidades}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
          />

          <Button
            type="outline"
            onPress={shareReport}
            disabled={loading}
            buttonStyle={{ borderWidth: 0, bordercolor: 'white', backgroundColor: '#00BFFF', borderRadius: 60 }}
            containerStyle={styles.containerButtonPadraoTemp}
            icon={
              <FontAwesomeIcon style={{ alignSelf: 'center', backgroundColor: '#00BFFF' }} icon="share-alt" color="white" size={25} />
            }
          />
        </View>
      ) : (
        <View>
          <Text allowFontScaling={false} style={styles.textErro}>Nenhum valor encontrado para os paramêtros selecionados!</Text>
        </View>
      )
      }
    </View>
  );
}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Relatorio);