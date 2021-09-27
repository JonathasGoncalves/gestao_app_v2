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
  viewRow: {
    marginBottom: MARGIN_TOP_ITEN,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textLabel: {
    marginLeft: MARGIN_PADRAO_LATERAL,
    fontSize: FONT_SIZE_CARD,
    fontWeight: 'bold',
    color: 'black'
  },
  textInput: {
    marginLeft: MARGIN_LABEL,
    fontSize: FONT_SIZE_CARD,
    color: 'black'
  },
  viewColunn: {

  },
  viewCard: {
    marginTop: MARGIN_TOP_CARD,
    borderBottomWidth: 0.5
  },
  searchBarCont: {
    backgroundColor: 'white',
    borderWidth: 0,
    height: INPUT_HEIGHT - 15
  },
  searchBar: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    height: INPUT_HEIGHT,
    marginLeft: MARGIN_PADRAO_LATERAL,
    marginRight: MARGIN_PADRAO_LATERAL
  },
  viewCalendar: {
    flexDirection: 'row',
    flexDirection: 'row',
    marginTop: MARGIN_TOP,
    marginLeft: MARGIN_MAIOR_LATERAL,
  },
  textDate: {
    marginLeft: MARGIN_MAIOR_LATERAL,
    alignSelf: 'center',
    fontSize: FONT_SIZE_TEXT,
    color: 'black'
  },
  containerDrop: {
    marginLeft: MARGIN_PADRAO_LATERAL,
    fontSize: FONT_SIZE_TEXT
  },
  containerIcon: {
    top: 10,
    right: '100%',
    left: MARGIN_PADRAO_LATERAL
  },
  inputAndroid: {
    marginLeft: MARGIN_PADRAO_LATERAL,
    fontSize: FONT_SIZE_CARD,
    paddingHorizontal: MARGIN_PADRAO_LATERAL,
    paddingVertical: MARGIN_PADRAO_LATERAL,
    borderWidth: 0,
    marginLeft: MARGIN_ICON,
    color: 'black',
    paddingRight: MARGIN_ICON,
  },
  viewSelect: {
    flexDirection: 'row',
    marginTop: MARGIN_TOP
  },
  containerButtonPadraoDisable: {
    backgroundColor: '#00BFFF',
    width: BUTTON_WIDTH,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: MARGIN_TOP_MAIOR,
    borderWidth: 0,
    opacity: 0.5
  },
  containerButtonPadrao: {
    backgroundColor: '#00BFFF',
    width: BUTTON_WIDTH,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: MARGIN_TOP_MAIOR,
    borderWidth: 0,
  },
});

export default styles;