import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableRespostaObservacao = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS resposta_observacao;`,
      `CREATE TABLE IF NOT EXISTS resposta_observacao (
          id                  INTEGER PRIMARY KEY,
          texto_observacao    TEXT,
          tema_id             INTEGER,
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

export const insertRespostaObsersavacao_init = async (resposta_observacao) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < resposta_observacao.length; i++) {
        tx.executeSql(
          `INSERT INTO resposta_observacao(id, texto_observacao, tema_id, submissao_id)
        VALUES(?, ?, ?, ?)`,
          [
            resposta_observacao[i].id,
            resposta_observacao[i].texto_observacao,
            resposta_observacao[i].tema_id,
            resposta_observacao[i].submissao_id
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