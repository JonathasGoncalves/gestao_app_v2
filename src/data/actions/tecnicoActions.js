//ACTION UTILIZADA PARA SALVAR O USUÁRIO QUE SE AUTENTICOU
//MARCA IDENTIFICADO COMO TRUE
export function save_tecnico(nome, email, id) {
  return {
    type: 'SAVE_TECNICO',
    nome,
    email,
    id,
    identificado: false
  };
}

export function aprova_login() {
  return {
    type: 'APROVA_LOGIN',
    identificado: true
  };
}

//REMOVE USUÁRIO NÃO AUTENTICADO
export function clear_tecnico() {
  return {
    type: 'CLEAR_TECNICO',
    nome: '',
    email: '',
    id: '',
    identificado: false
  };
}