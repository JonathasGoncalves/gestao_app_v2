import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableRespostaPergunta = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS resposta_pergunta;`,
      `CREATE TABLE IF NOT EXISTS resposta_pergunta (
          id                    INTEGER PRIMARY KEY,
          resposta_escrita_id   INTEGER,
          pergunta_id           INTEGER
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

export const insertRespostaPergunta_init = async (resposta_pergunta) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < resposta_pergunta.length; i++) {
        tx.executeSql(
          `INSERT INTO resposta_pergunta(id, resposta_escrita_id, pergunta_id)
        VALUES(?, ?, ?)`,
          [
            resposta_pergunta[i].id,
            resposta_pergunta[i].resposta_escrita_id,
            resposta_pergunta[i].pergunta_id
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