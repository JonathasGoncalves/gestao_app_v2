import * as SQLite from "expo-sqlite";
import * as perguntaDAO from '../DAO/perguntaDAO';
import * as opcaoDAO from '../DAO/opcaoDAO';

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableTema = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS temas;`,
      `CREATE TABLE IF NOT EXISTS temas (
          id              INTEGER PRIMARY KEY,
          nome            TEXT,
          formulario_id   INTEGER
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

export const insertTema_init = async (temas) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < temas.length; i++) {
        tx.executeSql(
          `INSERT INTO temas(id, nome, formulario_id)
        VALUES(?, ?, ?)`,
          [
            temas[i].id,
            temas[i].nome,
            temas[i].formulario_id
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

export const temasAll = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM temas`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const temasByFormulario = async (formulario_id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM temas WHERE formulario_id = ?`,
        [formulario_id],
        async (_, { rows: { _array } }) => {
          temas = []
          for (i = 0; i < _array.length; i++) {
            tema = {}
            tema.id = _array[i].id
            tema.nome = _array[i].nome
            tema.perguntas = await perguntaDAO.perguntasByTema(_array[i].id)
            temas.push(tema);
          }
          resolve(temas)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}




