import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableOpcaoPergunta = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS opcoes_perguntas;`,
      `CREATE TABLE IF NOT EXISTS opcoes_perguntas (
          id            INTEGER PRIMARY KEY,
          opcao_id      INTEGER,
          pergunta_id   INTEGER,
          positiva      INTEGER
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

export const insertOpcaoPergunta_init = async (opcoes_perguntas) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < opcoes_perguntas.length; i++) {
        tx.executeSql(
          `INSERT INTO opcoes_perguntas(id, opcao_id, pergunta_id, positiva)
        VALUES(?, ?, ?, ?)`,
          [
            opcoes_perguntas[i].id,
            opcoes_perguntas[i].opcao_id,
            opcoes_perguntas[i].pergunta_id,
            opcoes_perguntas[i].positiva
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


export const opcaoByPergunta2 = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM opcoes_perguntas`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}
