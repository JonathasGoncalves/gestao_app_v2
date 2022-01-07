import { Dimensions, StyleSheet, PixelRatio } from 'react-native';
import Constants from 'expo-constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var FONT_SIZE_CARD = 16;
var MARGIN_PADRAO_LATERAL = 10;
var MARGIN_LABEL = 5;
var MARGIN_MAIOR_LATERAL = 20;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;
var MARGIN_TOP = 30;
var MARGIN_TOP_CARD = 20;
var MARGIN_TOP_ITEN = 10;
var MARGIN_ICON = 40;
var MARGIN_TOP_MAIOR = 70;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  FONT_SIZE_CARD = 14;
  MARGIN_PADRAO_LATERAL = 5;
  MARGIN_LABEL = 3;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
  MARGIN_TOP = 20;
  MARGIN_MAIOR_LATERAL = 18;
  MARGIN_TOP_CARD = 15;
  MARGIN_TOP_ITEN = 5;
  MARGIN_ICON = 35;
  MARGIN_TOP_MAIOR = 60;
}

const styles = StyleSheet.create({

  titulo: {
    textAlign: 'center',
    fontSize: FONT_SIZE_TITULOS,
    padding: MARGIN_LABEL,
    color: 'black',
    marginBottom: 20
  },
  titulo_tema: {
    textAlign: 'center',
    fontSize: FONT_SIZE_TITULOS,
    padding: MARGIN_LABEL,
    color: 'black',
    borderWidth: 0.7,
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 10
  },
  enunciado: {
    textAlign: 'left',
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
  },
  opcoes: {
    textAlign: 'left',
    fontSize: 14,
    color: 'black',
  },
  container_opcao: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  pergunta: {
    marginTop: 0
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    marginHorizontal: 10,
  },
  renderItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    padding: 5,
    justifyContent: 'space-between'
  },
  textLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: FONT_SIZE_TEXT,
    marginLeft: 10,
  },
  textLabel2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: FONT_SIZE_TEXT,
    marginLeft: 30
  },
  textValue: {
    color: 'black',
    fontSize: FONT_SIZE_TEXT,
    marginLeft: 10,

  },
  icon_view: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginBottom: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#00BFFF'
  },
  textButtonPadrao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  containerButtonPadrao: {
    backgroundColor: '#00BFFF',
    width: 200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 25,
    borderWidth: 0
  },
  observacoes_input: {
    flex: 1,
    borderWidth: 0.7,
    borderRadius: 20,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxHeight: 150,
    fontSize: 16
  },
  view_observacao: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10
  },
  view_titulo: {
    flexDirection: 'row',
    marginTop: 20
  },
  image_prev: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  image_obs: {
    backgroundColor: 'transparent',
    width: windowWidth * 0.18,
    height: windowWidth * 0.18,
    marginTop: windowWidth * 0.028,
    marginLeft: windowWidth * 0.028,
    borderRadius: 50
  },
  view_image_obs: {
    marginTop: 10,
    width: '100%',
    height: windowWidth * 0.45,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: 'flex-start',
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    backgroundColor: '#f6f2f1',
    borderRadius: 10
  },
  container_deck: {
    flex: 1,
    marginBottom: 1000
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20
  },
  text_deck: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});

export default styles;