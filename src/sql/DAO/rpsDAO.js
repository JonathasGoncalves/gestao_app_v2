import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableRPS = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS resposta_perg_submissao;`,
      `CREATE TABLE IF NOT EXISTS resposta_perg_submissao (
          id                      INTEGER PRIMARY KEY,
          resposta_pergunta_id    INTEGER,
          submissao_id            INTEGER
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

export const insertRPS_init = async (rps) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < rps.length; i++) {
        tx.executeSql(
          `INSERT INTO resposta_perg_submissao(id, resposta_pergunta_id, submissao_id)
        VALUES(?, ?, ?)`,
          [
            rps[i].id,
            rps[i].resposta_pergunta_id,
            rps[i].submissao_id
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