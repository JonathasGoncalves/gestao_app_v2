import axios from 'axios';
import * as parametroDAO from '../sql/DAO/parametrosDAO';

const api = axios.create({
  //baseURL: 'http://192.168.1.31:8000/',
  baseURL: 'http://apigestaocooperados.selita.coop.br/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

//ADICIONANDO TOKEN AS REQUISIÇÕES
api.interceptors.request.use(
  async function (config) {
    const access_token = await parametroDAO.parametrosByChave('access_token');
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//INTERCEPTANDO OS RESPONSES E TRATANDO OS ERROS
api.interceptors.response.use(async function (response) {
  const refresh_token = await parametroDAO.parametrosByChave('refresh_token');
  const expires_in = await parametroDAO.parametrosByChave('expires_in');
  //REFRESH DO TOKEN SE FALTA 1H PARA O REVOKE
  if (response.config.url != 'oauth/token' && refresh_token && expires_in <= 3600) {
    const client_secret = await parametroDAO.parametrosByChave('client_secret');
    const client_id = await parametroDAO.parametrosByChave('client_id');

    const responseToken = await api.post('oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: client_id,
      client_secret: client_secret,
      scope: ''
    })
    await parametroDAO.updateParametrosByChave('access_token', responseToken.data.access_token);
    await parametroDAO.updateParametrosByChave('refresh_token', responseToken.data.refresh_token);
    await parametroDAO.updateParametrosByChave('expires_in', responseToken.data.expires_in);
  }
  return response;
}, async function (error) {
  console.log(error)
  //OBJ COM A RESPORTA PERSONALIZADA
  errorMsg = {};
  errorJson = error.toJSON();
  if (errorJson.message == 'Request failed with status code 401' && errorJson.config.url != 'oauth/token') {
    const refresh_token = await parametroDAO.parametrosByChave('refresh_token');
    const client_secret = await parametroDAO.parametrosByChave('client_secret');
    const client_id = await parametroDAO.parametrosByChave('client_id');

    const responseToken = await api.post('oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: client_id,
      client_secret: client_secret,
      scope: ''
    })
    await parametroDAO.updateParametrosByChave('access_token', responseToken.data.access_token);
    await parametroDAO.updateParametrosByChave('refresh_token', responseToken.data.refresh_token);
    await parametroDAO.updateParametrosByChave('expires_in', responseToken.data.expires_in);
  } else if (errorJson.message == 'Request failed with status code 400' || errorJson.message == 'Request failed with status code 401') {
    errorMsg = {
      title: 'Não autorizada!',
      msg: 'Credenciais inválidas!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.message == 'Request failed with status code 404') {
    errorMsg = {
      title: 'Não encontrado!',
      msg: 'O item requisitado não foi encontrado!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.code == 'ECONNABORTED') {
    errorMsg = {
      title: 'Sem conexão!',
      msg: 'Não foi possivel estabelecer conexão com a API!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.message == 'Request failed with status code 500') {
    errorMsg = {
      title: 'Erro interno!',
      msg: 'Erro desconhecido na API. Por favor contatar a TI!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.message == 'Network Error') {
    errorMsg = {
      title: 'Erro de rede!',
      msg: 'Sem conexão com a internet!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else if (errorJson.message == 'Request failed with status code 400') {
    errorMsg = {
      title: 'Erro na requisição!',
      msg: 'As informações passadas estão em formato incorreto!',
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  } else {
    errorMsg = {
      title: 'Erro desconhecido!',
      msg: JSON.stringify(errorJson),
      confirm: 'Continuar',
      cancel: '',
      identificado: true
    }
  }
  return Promise.reject(errorMsg);
});

export default api;