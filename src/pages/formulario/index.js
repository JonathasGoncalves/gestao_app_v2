import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../../data/actions/tecnicoActions';
import { View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import * as eventoDAO from '../../sql/DAO/evento_agendaDAO'
import RadioGroup from 'react-native-radio-buttons-group';
import styles from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { cortar_nome } from '../../functions/texto';
import { Camera } from 'expo-camera';
import { useRef } from 'react';

var cont_pergunta = 1;

const Formulario = ({ route, navigation, id_tecnico }) => {

  const cameraRef = useRef(null);
  const [evento, setEvento] = useState({});
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [ratio, setRatio] = useState("16:9");
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  useEffect(() => {
    //ATUALIZANDO TITULO DA TELA
    navigation.setOptions({ title: route.params.evento.titulo })

    cont_pergunta = 1;
    //utilizar o id do evento e buscar a versão populada
    async function buscar_perguntas() {
      const evento_completo = await eventoDAO.eventoById(route.params.evento.id);
      evento_completo.formulario.temas.map((tema) => {
        tema.perguntas.map((pergunta) => {
          pergunta.valor_inicial = pergunta.opcoes[0].id
          pergunta.opcoes.map((opcao) => {
            opcao.label = opcao.nome_opcao
            opcao.labelStyle = styles.opcoes
            opcao.containerStyle = styles.container_opcao
            opcao.size = 22
          })
        })
        tema.observacao = {
          texto_observacao: '',
          imagens: []
        }
      })

      setEvento(evento_completo);
      setLoading(false);
    }
    buscar_perguntas();
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
    evento_copia = evento;
    evento_copia.formulario.temas[evento_copia.formulario.temas.indexOf(tema)]
      .observacao.texto_observacao = text;
    setEvento(evento_copia)
  }

  async function abrirCamera() {
    //ALTERANDO STATE PARA EXIBIR CAMERA
    setCamera(true)
    //ALTERANDO RATIO
    ratioConfig();
  }

  async function takePic() {
    if (cameraRef.current) {
      foto = await cameraRef.current.takePictureAsync({ skipProcessing: true });
      console.log(foto)
      setPreviewVisible(true);
      setCamera(false);
      setCapturedImage(foto)
    }
  }

  async function savePic() {

  }

  async function reTakePic() {
    setPreviewVisible(false);
    setCapturedImage(null);
    abrirCamera();
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
              <FontAwesomeIcon
                icon="save"
                color="black"
                size={30}
                style={{ position: 'absolute', top: '20%', right: '19%' }}
                onPress={() => savePic()}
              />
              <FontAwesomeIcon
                icon="trash-alt"
                color="black"
                size={30}
                style={{ position: 'absolute', top: '20%', left: '19%' }}
                onPress={() => reTakePic()}
              />
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
                      <View style={styles.view_observacao}>
                        <TextInput
                          style={styles.observacoes_input}
                          multiline={true}
                          scrollEnabled={true}
                          placeholder={"Observações sobre " + tema.nome}
                          onChangeText={(text) => action_text_observacao(tema, text)}
                          autoCorrect={true}
                        />
                        <View style={styles.icon_view}>
                          <FontAwesomeIcon
                            icon="camera"
                            color="white"
                            size={25}
                            onPress={() => abrirCamera()}
                          />
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Formulario);


/*
<View style={styles.renderItem}>
                <View style={{ flexDirection: 'row' }}>
                   <Text allowFontScaling={false} style={styles.textLabel}>Cooperado:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{cortar_nome(route.params.evento.cooperado_nome)}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={styles.textLabel}>Municipio:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.municipio}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={styles.textLabel}>Tanque:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.tanque}</Text>
                  <Text allowFontScaling={false} style={styles.textLabel2}>Latao:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.latao}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={styles.textLabel}>Técnico:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.tecnico_nome}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={styles.textLabel}>Data:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.data}</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{route.params.evento.hora}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text allowFontScaling={false} style={styles.textLabel}>CBT:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{evento.submissao.qualidade.cbt}</Text>
                  <Text allowFontScaling={false} style={styles.textLabel2}>CCS:</Text>
                  <Text allowFontScaling={false} style={styles.textValue}>{evento.submissao.qualidade.ccs}</Text>
                </View>
              </View>
              */