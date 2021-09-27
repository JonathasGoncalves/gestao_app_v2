export default function erroMessage(error) {

  messageErro = '';
  const { errors } = error;
  errorArray = Object.values(errors);
  //Cada atributo é um array e é referente a um input da request
  for (atributo of errorArray) {
    //cada item é uma string com os erros daquele input
    for (atributoItem of atributo) {
      arrayErro = atributoItem.split(',');
      //cada item é um erro
      for (msgErro of arrayErro) {
        messageErro += msgErro + '\n';
      }
    }
  }
  return messageErro;
}