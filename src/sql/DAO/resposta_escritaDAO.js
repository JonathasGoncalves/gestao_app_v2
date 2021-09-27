import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableRespostaEscrita = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS resposta_escrita;`,
      `CREATE TABLE IF NOT EXISTS resposta_escrita (
          id          INTEGER PRIMARY KEY,
          valor       TEXT
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

export const insertRespostaEscrita_init = async (resposta_escrita) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < resposta_escrita.length; i++) {
        tx.executeSql(
          `INSERT INTO resposta_escrita(id, valor)
        VALUES(?, ?)`,
          [
            resposta_escrita[i].id,
            resposta_escrita[i].valor
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