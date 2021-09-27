import * as SQLite from "expo-sqlite"
import * as opcaoDAO from '../DAO/opcaoDAO';

const gestao_db = SQLite.openDatabase('db_gestao.db');

export const createTablePerguntas = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS perguntas;`,
      `CREATE TABLE IF NOT EXISTS perguntas (
          id          INTEGER PRIMARY KEY,
          enunciado   TEXT,
          tema_id     INTEGER
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

export const insertPergunta_init = async (perguntas) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < perguntas.length; i++) {
        tx.executeSql(
          `INSERT INTO perguntas(id, enunciado, tema_id)
        VALUES(?, ?, ?)`,
          [
            perguntas[i].id,
            perguntas[i].enunciado,
            perguntas[i].tema_id
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

export const perguntasByTema = async (tema_id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM perguntas WHERE tema_id = ?`,
        [tema_id],
        async (_, { rows: { _array } }) => {
          perguntas = []
          for (var i = 0; i < _array.length; i++) {
            pergunta = {}
            pergunta.id = _array[i].id
            pergunta.enunciado = _array[i].enunciado
            pergunta.opcoes = await opcaoDAO.opcaoByPergunta(_array[i].id)
            perguntas.push(pergunta)
          }
          resolve(perguntas)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const perguntasByTema2 = async (tema_id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM perguntas where tema_id = ?`,
        [tema_id],
        async (_, { rows: { _array } }) => {
          resolve(_array)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}



