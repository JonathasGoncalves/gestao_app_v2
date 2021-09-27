import { Dimensions, StyleSheet, PixelRatio } from 'react-native';

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
  containerButtonPadraoTemp: {
    borderWidth: 0,
    backgroundColor: '#00BFFF',
    width: 60,
    height: 60,
    borderRadius: 60,
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    marginTop: Dimensions.get("window").height * 0.75,
    justifyContent: 'center',
    right: 40
  },
  renderItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 40,
    borderWidth: 0,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  textLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: MARGIN_LABEL,
    fontSize: FONT_SIZE_CARD
  },
  textValue: {
    color: 'black',
    marginRight: MARGIN_LABEL,
    fontSize: FONT_SIZE_CARD
  }
});
export default styles;

