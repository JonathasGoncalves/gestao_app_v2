import * as SQLite from "expo-sqlite";

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableTanques = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS tanques;`,
      `CREATE TABLE IF NOT EXISTS tanques (
          id        INTEGER PRIMARY KEY,
          codigo    TEXT,
          matricula TEXT,
          tanque    TEXT,
          latao     TEXT
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

export const insertTanque_init = async (tanques) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < tanques.length; i++) {
        tx.executeSql(
          `INSERT INTO tanques(id, codigo, matricula, tanque, latao)
        VALUES(?, ?, ?, ?, ?)`,
          [
            tanques[i].id,
            tanques[i].codigo,
            tanques[i].matricula,
            tanques[i].tanque,
            tanques[i].latao
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

export const tanques_por_id = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM tanques where id = ?`,
        [6801],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}
