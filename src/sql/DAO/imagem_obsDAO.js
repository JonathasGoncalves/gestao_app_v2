import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableImagenOBS = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS imagem_obs;`,
      `CREATE TABLE IF NOT EXISTS imagem_obs (
          id                        INTEGER PRIMARY KEY,
          uri                       TEXT,
          resposta_observacao_id    INTEGER
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

export const insertImagenOBS_init = async (imagem_obs_data) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < imagem_obs_data.length; i++) {
        tx.executeSql(
          `INSERT INTO imagem_obs(id, uri, resposta_observacao_id)
        VALUES(?, ?, ?)`,
          [
            imagem_obs_data[i].id,
            imagem_obs_data[i].uri,
            imagem_obs_data[i].resposta_observacao_id
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