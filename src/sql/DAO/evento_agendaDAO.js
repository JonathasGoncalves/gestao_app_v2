import * as SQLite from "expo-sqlite";
import * as formularioDAO from '../DAO/formularioDAO';
import * as tecnicoDAO from '../DAO/tecnicoDAO';
import * as submissaoDAO from '../DAO/submissaoDAO';

//ATUALIZADO = 1 SE ESSE ITEM JÁ FOI ENVIADO PARA A BASE REMOTA
const gestao_db = SQLite.openDatabase('db_gestao.db')
export const createTableEventoAgenda = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS evento_agenda;`,
      `CREATE TABLE IF NOT EXISTS evento_agenda (
          id              INTEGER PRIMARY KEY,
          data            TEXT,
          hora            TEXT,
          tecnico_id      INTEGER,
          formulario_id   INTEGER,
          tanque_id       INTEGER,
          projeto_id      INTEGER,
          submissao_id    INTEGER,
          atualizado      INTEGER
        );`,
    ];

    gestao_db.transaction(tx => {
      for (var i = 0; i < sql_array.length; i++) {
        tx.executeSql(
          sql_array[i],
          [],
          (_, result) => { resolve(result) },
          (_, error) => {
            reject(error)
          }
        )
      }
    })
  })
}

export const insertEventoAgenda_init = async (evento_agenda) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < evento_agenda.length; i++) {
        tx.executeSql(
          `INSERT INTO evento_agenda(id, data, hora, tecnico_id, formulario_id, tanque_id, projeto_id, submissao_id, atualizado)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            evento_agenda[i].id,
            evento_agenda[i].data,
            evento_agenda[i].hora,
            evento_agenda[i].tecnico_id,
            evento_agenda[i].formulario_id,
            evento_agenda[i].tanque_id,
            evento_agenda[i].projeto_id,
            evento_agenda[i].submissao_id,
            1
          ],
          (_, result) => { resolve(result) },
          (_, error) => { reject(error) }
        )
      }
    }),
      null,
      resolve("ok")
  })
}

export const insertEventoAgenda = async (evento_agenda) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO evento_agenda(id, data, hora, tecnico_id, formulario_id, tanque_id, projeto_id, submissao_id, atualizado)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          evento_agenda.id,
          evento_agenda.data,
          evento_agenda.hora,
          evento_agenda.tecnico_id,
          evento_agenda.formulario_id,
          evento_agenda.tanque_id,
          evento_agenda.projeto_id,
          evento_agenda.submissao_id,
          0
        ],
        (_, result) => { resolve(result) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const novo_id_evento = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT MAX(id) as id FROM evento_agenda`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const eventoAll = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM evento_agenda`,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const evento_exibir_All = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          evento_agenda.id,
          evento_agenda.data,
          evento_agenda.hora,
          tecnicos.nome as tecnico_nome,
          formularios.titulo,
          cooperados.nome as cooperado_nome,
          tanques.tanque,
          tanques.latao,
          cooperados.municipio
        FROM evento_agenda
        JOIN tecnicos ON (evento_agenda.tecnico_id = tecnicos.id)
        JOIN tanques ON (evento_agenda.tanque_id = tanques.id)
        JOIN cooperados ON (tanques.matricula = cooperados.matricula)
        JOIN formularios ON (evento_agenda.formulario_id = formularios.id)`,
        [],
        (_, { rows: { _array } }) => {
          resolve(_array)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const eventos_pendentes = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM evento_agenda where atualizado = ?`,
        [0],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const eventoById = async (evento_id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM evento_agenda where id = ?`,
        [evento_id],
        async (_, { rows: { _array } }) => {
          evento_populado = {}
          evento_populado.id = _array[0].id
          evento_populado.data = _array[0].data
          evento_populado.hora = _array[0].hora
          evento_populado.tanque = _array[0].tanque_id
          evento_populado.atualizado = _array[0].atualizado
          evento_populado.tecnico = await tecnicoDAO.tecnicoByID(_array[0].tecnico_id)
          evento_populado.submissao = await submissaoDAO.submissaoByID(_array[0].submissao_id)
          evento_populado.formulario = await formularioDAO.formularioByID(_array[0].formulario_id)
          resolve(evento_populado)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}