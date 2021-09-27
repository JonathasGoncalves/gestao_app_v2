import { Dimensions, StyleSheet, PixelRatio } from 'react-native';
var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var MARGIN_PADRAO_LATERAL = 10;
var MARGIN_MAIOR_LATERAL = 20;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;
var MARGIN_TOP = 30;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  MARGIN_PADRAO_LATERAL = 5;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
  MARGIN_TOP = 20;
  MARGIN_MAIOR_LATERAL = 18;
}

const styles = StyleSheet.create({
  viewCalendar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: INPUT_HEIGHT,
    alignSelf: 'flex-start',
    marginLeft: MARGIN_MAIOR_LATERAL
  },
  textDate: {
    marginLeft: MARGIN_PADRAO_LATERAL,
    alignSelf: 'center',
    fontSize: FONT_SIZE_TEXT
  },
  containerButtonPadraoDisable: {
    backgroundColor: '#00BFFF',
    width: BUTTON_WIDTH,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: MARGIN_TOP,
    borderWidth: 0,
    opacity: 0.5
  },
  containerButtonPadrao: {
    backgroundColor: '#00BFFF',
    width: BUTTON_WIDTH,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: MARGIN_TOP,
    borderWidth: 0,
  },
  containerButtonPadraoTemp: {
    borderWidth: 0,
    backgroundColor: '#00BFFF',
    width: 60,
    height: 60,
    borderRadius: 60,
    alignSelf: 'flex-end',
    position: 'absolute',
    alignItems: 'center',
    marginTop: Dimensions.get("window").height * 0.75,
    justifyContent: 'center',
    right: 40
  },
  containerButtonCheck: {
    backgroundColor: 'white',
    borderWidth: 0,
    width: '40%',
    alignSelf: 'flex-start',
  },
  textButtonPadrao: {
    fontSize: FONT_SIZE_TEXT,
    fontWeight: 'bold',
    color: 'white',
  },
  textLabel: {
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: MARGIN_PADRAO_LATERAL
  },
  textValue: {
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: MARGIN_PADRAO_LATERAL
  },
  viewList: {
    marginTop: MARGIN_PADRAO_LATERAL,
    borderBottomWidth: 0.8,
    borderBottomColor: 'black',
    marginLeft: MARGIN_PADRAO_LATERAL,
    marginRight: MARGIN_PADRAO_LATERAL,
    padding: MARGIN_PADRAO_LATERAL
  },
  shareButton: {
    position: 'absolute',
    flex: 1,
    //borderWidth: 0,
    //backgroundColor: '#00BFFF',
    //borderRadius: 60,
    width: 100,
    height: 100,
    //alignSelf: 'center',
    //marginTop: Dimensions.get("window").height * 0.7,
  },
  textErro: {
    color: "red",
    textAlign: 'center',
    marginTop: '50%',
    fontSize: 18,
    padding: 5
  }
});

export default styles;



