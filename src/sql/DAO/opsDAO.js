import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableOPS = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS opcao_pergunta_submissao;`,
      `CREATE TABLE IF NOT EXISTS opcao_pergunta_submissao (
          id                  INTEGER PRIMARY KEY,
          opcao_pergunta_id   INTEGER,
          submissao_id        INTEGER
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

export const insertOPS_init = async (ops) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < ops.length; i++) {
        tx.executeSql(
          `INSERT INTO opcao_pergunta_submissao(id, opcao_pergunta_id, submissao_id)
        VALUES(?, ?, ?)`,
          [
            ops[i].id,
            ops[i].opcao_pergunta_id,
            ops[i].submissao_id
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
