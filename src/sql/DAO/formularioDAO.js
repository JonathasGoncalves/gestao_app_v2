import * as SQLite from "expo-sqlite";
import * as temaDAO from "../DAO/temaDAO";

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableFormulario = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS formularios;`,
      `CREATE TABLE IF NOT EXISTS formularios (
          id      INTEGER PRIMARY KEY,
          titulo  TEXT
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

export const insertFormulario_init = async (formularios) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < formularios.length; i++) {
        tx.executeSql(
          `INSERT INTO formularios(id, titulo)
        VALUES(?, ?)`,
          [
            formularios[i].id,
            formularios[i].titulo
          ],
          (_, { rows: { _array } }) => { resolve(_array) },
          (_, error) => { reject(error) }
        )
      }
    }),
      null,
      resolve("ok")
  })
}

export const formularioByID = async (id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM formularios WHERE id = ?`,
        [id],
        async (_, { rows: { _array } }) => {
          _array[0].temas = await temaDAO.temasByFormulario(_array[0].id)
          resolve(_array[0])
        },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const formulariosAll = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM formularios`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}
