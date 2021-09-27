import React, { useState, useEffect } from 'react';
import LoginStack from './login';
import MainDrawer from './main';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as tecnicoActions from './../data/actions/tecnicoActions';
import api from '../services/api';
import { ActivityIndicator } from 'react-native';

import * as parametroDAO from '../sql/DAO/parametrosDAO';

function IndexRouter({
  identificado,
  save_tecnico,
  clear_tecnico,
  aprova_login
}) {

  const [verificar, setVerificar] = useState(true);

  useEffect(() => {

    async function verificarUsuario() {
      //VERIFICANDO SE O O USUÁRIO ESTÁ LOGADO
      //SE LANÇAR EXCEPTION É PQ O DB LOCAL NÃO FOI CRIADO AINDA, ENTÃO DEVE-SE CRIAR
      //E INICIA-LO COM OS PARAMETROS INICIAIS
      var access_token;
      try {
        access_token = await parametroDAO.parametrosByChave('access_token');
      } catch (erro) {
        await parametroDAO.createTableParametros();
        //CRIA ARRAY COM OS VALORES DAS CHAVES E SEUS ESTADOS INICIAIS
        var parametros = [];
        //CREDENCIAIS DO CLIENT NA API
        parametros.push({ chave: 'client_secret', valor: 'FoHGIE8cTNGNJez3uYQdV8gbJdtYvyDBoV4cwjmQ' });
        parametros.push({ chave: 'client_id', valor: '5' });
        //INFORMAÇÕES DE ACESSO
        parametros.push({ chave: 'access_token', valor: '' });
        parametros.push({ chave: 'refresh_token', valor: '' });
        parametros.push({ chave: 'expires_in', valor: '' });
        //QUANDO TRUE SINCRONIZA AS NOVAS SUBMISSOES DO USUÁRIO
        parametros.push({ chave: 'sinc_db', valor: 'false' });
        //QUANDO TRUE ATUALIZA TODA A BASE LOCAL
        parametros.push({ chave: 'update_db', valor: 'true' });
        parametros.push({ chave: 'atualizar', valor: '0' });
        await parametroDAO.insertParametros_init(parametros);

        access_token = await parametroDAO.parametrosByChave('access_token');
      }

      try {
        if (access_token) {
          //RECUPERANDO USUÁRIO LOGADO E SALVANDO DO REDUX
          const responseTecnico = await api.get('api/tecnico/logged_tecnico');
          save_tecnico(responseTecnico.data.name, responseTecnico.data.email, responseTecnico.data.id);
          aprova_login();
        }
      } catch (error) {
        //TOKEN INVÁLIDO
        //LIMPAR CREDENCIAIS
        await parametroDAO.updateParametrosByChave('access_token', '');
        clear_tecnico();
      }
      setVerificar(false);
    }

    verificarUsuario();
  }, [])

  if (verificar) {
    return <ActivityIndicator size='large' color='#00BFFF' style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }} />
  } else if (identificado) {
    return <MainDrawer />;
  } else {
    return <LoginStack />;
  }

}

const mapStateToProps = state => ({
  identificado: state.Tecnico.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...tecnicoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IndexRouter);