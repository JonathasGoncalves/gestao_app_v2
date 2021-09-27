import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableTecnico = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS tecnicos;`,
      `CREATE TABLE IF NOT EXISTS tecnicos (
          id      INTEGER PRIMARY KEY,
          nome    TEXT,
          email   TEXT
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

export const insertTecnico_init = async (tecnicos) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < tecnicos.length; i++) {
        tx.executeSql(
          `INSERT INTO tecnicos(id, nome, email) 
        VALUES(?, ?, ?)`,
          [
            tecnicos[i].id,
            tecnicos[i].nome,
            tecnicos[i].email
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

export const tecnicoByID = async (id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM tecnicos WHERE ID = ?`,
        [id],
        (_, { rows: { _array } }) => { resolve(_array[0]) },
        (_, error) => { reject(error) }
      )
    })
  })
}

