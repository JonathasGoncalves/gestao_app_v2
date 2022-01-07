import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import * as eventoDAO from '../../sql/DAO/evento_agendaDAO'
import RadioGroup from 'react-native-radio-buttons-group';
import styles from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { cortar_nome } from '../../functions/texto';
import { Camera } from 'expo-camera';
import { useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import Moment from 'moment';
import * as parametroDAO from '../../sql/DAO/parametrosDAO';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

const Formulario = ({ route, navigation, id_tecnico }) => {
  var cont_pergunta = 1;
  const cameraRef = useRef(null);
  const [evento, setEvento] = useState({});
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ratio, setRatio] = useState("16:9");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [diretorio, setDiretorio] = useState("");
  const [tema_index, setTema] = useState('');
  const [temaId, setTemaId] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({});

  useEffect(() => {
    //ATUALIZANDO TITULO DA TELA
    navigation.setOptions({ title: route.params.evento.titulo })
    cont_pergunta = 1;
    //utilizar o id do evento e buscar a versão populada
    async function buscar_perguntas() {
      const evento_completo = await eventoDAO.eventoById(route.params.evento.id);
      evento_completo.formulario.temas.map((tema) => {
        tema.perguntas.map((pergunta) => {
          if (pergunta.opcoes.length > 0) {
            pergunta.valor_inicial = pergunta.opcoes[0].id
          }
          pergunta.opcoes.map((opcao) => {
            opcao.label = opcao.nome_opcao
            opcao.labelStyle = styles.opcoes
            opcao.containerStyle = styles.container_opcao
            opcao.size = 22
          })
        })
        tema.observacao = {
          texto_observacao: null,
          imagens: []
        }
      })

      setEvento(evento_completo);
      setLoading(false);
    }

    async function iniciar_diretorio() {
      /*TRATAR ORGANIZAÇÃO DAS FOTOS TIRADAS
            0- O DIRETORIO DE IMAGENS DEVE SER RESETADO SEMPRE QUE UM RELATÓRIO COMECA
                0.1- VERIFICAR SE NÃO EXISTEM RELATÓRIOS PENDENTES DE UPLOAD
                  CASO TENHA, NÃO PODE RESETAR
            1- VERIFICAR A EXISTENCIA DO DIRETORIO RAIZ (DIR + eventos + evento_(id_evento)), CASO NÃO EXISTA CRIAR
              exemplo: file:///...eventos/evento_420/1(um diretorio para cada tema)/obs_teste.jpg
          */
      // ==1 SE EXISTEM UPDATES PENDENTES
      const update_pendente = await parametroDAO.parametrosByChave('atualizar');
      if (update_pendente != '1') {
        await FileSystem.deleteAsync(FileSystem.documentDirectory + 'eventos');
      }
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'eventos/evento_' + route.params.evento.id + '/');
      if (!fileInfo.exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'eventos/evento_' + route.params.evento.id + '/', { intermediates: true })
        setDiretorio(FileSystem.documentDirectory + 'eventos/evento_' + route.params.evento.id + '/');
      } else {
        setDiretorio(FileSystem.documentDirectory + 'eventos/evento_' + route.params.evento.id + '/');
      }
    }
    buscar_perguntas();
    iniciar_diretorio();
  }, [])

  async function ratioConfig() {
    //ADICIONANDO O ULTIMO RATIO DO DISPOSITIVO
    if (cameraRef.current) {
      ratios = await cameraRef.current.getSupportedRatiosAsync();
      setRatio(ratios[ratios.length - 1])
    }
  }

  function selecionar_tema(tema, index, temas) {
    return tema.perguntas.findIndex(selecionar_pergunta, this);
  }

  function selecionar_pergunta(pergunta, index, perguntas) {
    pergunta.opcoes.map((opcao) => {
      if (opcao.id_OP == this.id_OP) {
        pergunta.valor_inicial = this.id_OP
        return true
      }
    })
  }

  async function action_radio(opcao) {
    evento_copia = evento;
    opcao.map((item) => {
      if (item.selected) {
        evento_copia.formulario.temas.findIndex(selecionar_tema, item);
      }
    })
    setEvento(evento_copia)
  }

  async function action_text_observacao(tema, text) {
    index_tema = evento.formulario.temas.indexOf(tema);
    evento_copia = evento;
    evento_copia.formulario.temas[index_tema]
      .observacao.texto_observacao = text;
    setEvento(evento_copia)
  }

  async function abrirCamera(tema) {
    //CADA TEMA TM NO MÁXIMO 8 FOTOS
    //NÃO ABRIR CAMERA CASO JÁ TENHAM 8 FOTOS NO TEMA
    if (evento.formulario.temas[evento.formulario.temas.indexOf(tema)]
      .observacao.imagens.length == 2) {
      setAlertProps({
        title: 'Limite de Imagens',
        msg: 'Cada tema deve ter no máximo 8 imagens!',
        cancel: '',
        confirm: 'continuar'
      })
      setShowAlert(true);
    } else {
      //REGISTRANDO QUAL O TEMA ESTA SENDO EDITADO(INDEX
      setTema(evento.formulario.temas.indexOf(tema));
      //REGISTRANDO QUAL O ID DO TEMA SENDO EDITADO
      setTemaId(evento.formulario.temas[evento.formulario.temas.indexOf(tema)].id)
      //ALTERANDO STATE PARA EXIBIR CAMERA
      setCamera(true)
      //ALTERANDO RATIO
      ratioConfig();
    }

  }

  async function takePic() {
    if (cameraRef.current) {
      foto = await cameraRef.current.takePictureAsync({ skipProcessing: true });
      setPreviewVisible(true);
      setCamera(false);
      setCapturedImage({ uri: foto.uri, imagem_indice: -1, indice_tema: -1 });
    }
  }

  async function savePic() {
    //se for difeente de -1 é o retorno do save de uma imagem
    //que já foi salva, logo não precisa fazer ação alguma
    if (capturedImage.indice_tema == -1) {
      const fileInfo = await FileSystem.getInfoAsync(diretorio + temaId + '/');
      if (!fileInfo.exists) {
        await FileSystem.makeDirectoryAsync(diretorio + temaId + '/', { intermediates: true })
      }
      await FileSystem.moveAsync({
        from: capturedImage.uri,
        to: diretorio + temaId + '/' + 'obs_' + Moment().format('hmms') + '.jpg'
      })
      //SALVANDO O CAMINHO DA IMAGEM NO ARRAY DO TEMA EM USO
      evento_copia = evento;
      id_imagem = evento_copia.formulario
        .temas[tema_index].observacao.imagens.length;
      evento_copia.formulario
        .temas[tema_index].observacao.imagens
        .push({
          id: id_imagem,
          path: diretorio + temaId + '/' + 'obs_' + Moment().format('hmms') + '.jpg'
        }
        );

      setEvento(evento_copia);
    }
    //VOLTANDO PARA A TELA DE QUESTÕES
    setCapturedImage(null);
    setPreviewVisible(false);
  }

  async function reTakePic() {
    evento_copia = evento
    if (capturedImage.indice_tema != -1) {
      evento_copia.formulario.temas[capturedImage.indice_tema].
        observacao.imagens.splice(indice_imagem, 1)
      setEvento(evento_copia);
      setCapturedImage(null);
      setPreviewVisible(false);
    } else {
      setPreviewVisible(false);
      setCapturedImage(null);
      abrirCamera(evento.formulario.temas[tema_index]);
    }
  }

  async function abrir_imagem(imagem, tema) {
    indice_tema = evento.formulario.temas.indexOf(tema)
    indice_imagem = evento.formulario.temas[indice_tema].observacao.imagens.indexOf(imagem)
    setPreviewVisible(true);
    setCapturedImage({ uri: imagem.path, imagem_indice: indice_imagem, indice_tema: indice_tema });
  }

  async function submeter() {
    //OBJETO DE COM AS IMAGENS PARA UPLOAD
    const imagens_upload = new FormData();
    evento.formulario.temas.map((tema) => {
      id_imagem = 0;
      tema.observacao.imagens.map((imagem) => {
        id_imagem++;
        nome_aray = imagem.path.split('/')
        nome_novo = nome_aray[nome_aray.length - 2] + '_' + nome_aray[nome_aray.length - 1] //id do tema + nome da foto
        imagens_upload.append('foto' + '_' + nome_aray[nome_aray.length - 2] + '_' + id_imagem, {
          name: nome_novo,
          type: 'image/jpg',
          uri: imagem.path,
        });
      })
    })


    if (imagens_upload._parts.length > 0) {
      access_token = await parametroDAO.parametrosByChave('access_token');

      axios({
        url: 'http://apigestaocooperados.selita.coop.br/' + 'api/evento/submeter_evento',
        method: 'POST',
        data: imagens_upload,
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      })
        .then(function (response) {
          console.log('*****handle success******');
          console.log(response.data);

        })
        .catch(function (response) {
          console.log('*****handle failure******');
          console.log(response);
        });
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {
        loading ? (
          <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
        ) : camera ? (
          <View style={{ flex: 1 }}>
            <Camera
              onCameraReady={ratioConfig}
              ref={cameraRef}
              style={{ flex: 1 }}
              type={type}
              ratio={ratio}
            >
              <View style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                margin: 20
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignSelf: 'flex-end',
                    alignItems: 'center'
                  }}
                  onPress={() => takePic()}>
                  <FontAwesomeIcon
                    icon="circle"
                    color="white"
                    size={75}
                    style={{ borderColor: 'black', borderWidth: 5, borderRadius: 100 }}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        ) : previewVisible && capturedImage ? (
          <View
            style={styles.image_prev}>
            <ImageBackground
              source={{ uri: capturedImage && capturedImage.uri }}
              style={{ flex: 1 }}
            />
            <View style={{
              flex: 1,
              flexDirection: 'row',
              position: 'absolute',
              height: '7%',
              width: '100%',
              top: '93%',
              backgroundColor: '#f2F1f6',
              alignContent: 'flex-end'
            }}>
              <TouchableOpacity
                onPress={() => savePic()}
                style={{ position: 'absolute', top: '20%', right: '19%' }}
              >
                <FontAwesomeIcon
                  icon="save"
                  color="black"
                  size={30}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{ position: 'absolute', top: '20%', left: '19%' }}
                onPress={() => reTakePic()}
              >
                <FontAwesomeIcon
                  icon="trash-alt"
                  color="black"
                  size={30}
                />
              </TouchableOpacity>

            </View>
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            <View style={{ padding: 20 }}>
              {
                evento.formulario.temas.map((tema) => {
                  return (
                    <View key={tema.id}>
                      <Text allowFontScaling={false} style={styles.titulo_tema}>{tema.nome}</Text>
                      {
                        tema.perguntas.map((pergunta) => {
                          return (
                            <View key={pergunta.id}>
                              <View style={styles.view_titulo}>
                                <Text allowFontScaling={false} style={styles.enunciado}>{cont_pergunta++ + " - "}</Text>
                                <Text allowFontScaling={false} style={styles.enunciado}>{pergunta.enunciado}</Text>
                              </View>
                              <RadioGroup
                                key={pergunta.id}
                                radioButtons={
                                  pergunta.opcoes
                                }
                                onPress={(opcao) => action_radio(opcao)}
                                layout='row'
                              />
                            </View>
                          )
                        })
                      }
                      <View style={styles.view_titulo}>
                        <Text allowFontScaling={false} style={styles.enunciado}>{cont_pergunta++ + " - "}</Text>
                        <Text allowFontScaling={false} style={styles.enunciado}>Observações</Text>
                      </View>
                      {
                        tema.observacao.imagens.length > 0 &&
                        <View style={styles.view_image_obs}>
                          {tema.observacao.imagens.map((imagem) => {
                            return (
                              <TouchableOpacity
                                key={imagem.id}
                                onPress={() => abrir_imagem(imagem, tema)}
                              >
                                <ImageBackground

                                  source={{ uri: imagem.path }}
                                  imageStyle={{ borderRadius: 3 }}
                                  style={styles.image_obs}
                                />
                              </TouchableOpacity>
                            )
                          })
                          }
                        </View>
                      }
                      <View style={styles.view_observacao}>
                        <TextInput
                          multiline
                          autoCorrect={false}
                          style={styles.observacoes_input}
                          onChangeText={(text) => action_text_observacao(tema, text)}
                          value={tema.observacao.texto_observacao}
                          placeholder="Observações"
                        />
                        <View style={styles.icon_view}>
                          <FontAwesomeIcon
                            icon="camera"
                            color="white"
                            size={25}
                            onPress={() => abrirCamera(tema)}
                          />
                        </View>
                      </View>

                    </View>
                  )
                })

              }
              < Button
                title="Enviar Relatório"
                type="outline"
                onPress={submeter}
                titleStyle={styles.textButtonPadrao}
                containerStyle={styles.containerButtonPadrao}
              />
            </View>
          </ScrollView>
        )
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
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  )
}

const mapStateToProps = state => ({
  id_tecnico: state.Tecnico.id
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Formulario);


/*
title="Logar"
                        type="outline"
                        onPress={loginUser}
                        containerStyle={userName.length == 0 || password.length == 0 ? styles.containerButtonPadraoDisable : styles.containerButtonPadrao}
                        titleStyle={styles.textButtonPadrao}
                        disabled={userName.length == 0 || password.length == 0}
              */