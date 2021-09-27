import * as evento_agendaDAO from '../../sql/DAO/evento_agendaDAO';
import * as submissaoDAO from '../../sql/DAO/submissaoDAO';
import * as parametroDAO from '../../sql/DAO/parametrosDAO';
import api from '../../services/api';
import { timeToString } from '../../functions/tempo';
import NetInfo from "@react-native-community/netinfo";


export default async function atualizar_base_local() {

  //CRIANDO EVENTOS PARA VERIFICAR SE O APARELHO ESTA CONECTADO A INTERNET
  NetInfo.addEventListener(async state => {
    if (state.isConnected) {

      //RECUPERANDO ITENS PENDENTES
      const eventos_pendentes = await evento_agendaDAO.eventos_pendentes();
      const submissoes_pendentes = await submissaoDAO.submissoes_pendentes();

      //SINCRONIZANDO OS ITENS PENDENTES COM A BASE REMOTA
      for (i = 0; i < submissoes_pendentes.length; i++) {
        await api.post('api/evento/agendar_evento', {
          data: eventos_pendentes[i].data,
          hora: eventos_pendentes[i].hora,
          projeto_id: eventos_pendentes[i].projeto_id,
          tanque_id: eventos_pendentes[i].tanque_id,
          tecnico_id: eventos_pendentes[i].tecnico_id,
          formulario_id: eventos_pendentes[i].formulario_id,
          realizada: submissoes_pendentes[i].realizada,
          aproveitamento: submissoes_pendentes[i].aproveitamento,
          qualidade_id: submissoes_pendentes[i].qualidade_id
        });
      }

      //ATUALIZANDO BASE LOCAL - DROP TABLE E CREATE TABLE
      await evento_agendaDAO.createTableEventoAgenda();
      await submissaoDAO.createTableSubmissao();

      //INSERTS
      data_temp = new Date();
      timestamp = data_temp.getTime();
      data_nova = timeToString(timestamp - 10 * 24 * 60 * 60 * 1000);
      const { data: { submissoes } } = await api.post('api/evento/submissoes_por_data', {
        data_base: data_nova
      });
      const { data: { evento_agenda } } = await api.post('api/evento/eventos_data', {
        data_base: data_nova
      });
      await new Promise.all(
        await evento_agendaDAO.insertEventoAgenda_init(evento_agenda)
      );
      await new Promise.all(
        await submissaoDAO.insertSubmissao_init(submissoes)
      );
      await parametroDAO.updateParametrosByChave('atualizar', '0');
    }
  });
}