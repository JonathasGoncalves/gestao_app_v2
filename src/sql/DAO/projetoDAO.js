import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableProjeto = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS projetos;`,
      `CREATE TABLE IF NOT EXISTS projetos (
          id        INTEGER PRIMARY KEY,
          nome      TEXT,
          aberto    INTEGER
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

export const insertProjeto_init = async (projetos) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < projetos.length; i++) {
        tx.executeSql(
          `INSERT INTO projetos(id, nome, aberto) 
        VALUES(?, ?, ?)`,
          [
            projetos[i].id,
            projetos[i].nome,
            projetos[i].aberto
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

export const projetoByID = async (id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM projetos WHERE ID = ?`,
        [id],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const projetosAll = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM projetos WHERE aberto = 1`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}
