import { Dimensions, StyleSheet, PixelRatio } from 'react-native';


const styles = StyleSheet.create({
  containerButtonPadrao: {
    backgroundColor: '#00BFFF',
    width: 200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 0
  },
  containerButtonPadraoDisable: {
    backgroundColor: '#00BFFF',
    width: 200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 0,
    opacity: 0.5
  },
  textUpdate: {
    //width: 200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 25,
    marginTop: '50%',
    position: "absolute",
    alignSelf: "center",
    color: 'black'
  },
  textUpdateFase: {
    //width: 200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 15,
    marginTop: '60%',
    position: "absolute",
    alignSelf: "center",
    color: 'black'
  },
  textButtonPadrao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inputlogin: {
    minHeight: 40,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },
  labelLogin: {
    marginLeft: 10,
    fontSize: 18,
  }
});

export default styles;