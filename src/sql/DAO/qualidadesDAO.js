import * as SQLite from "expo-sqlite";

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableQualidade = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS qualidades;`,
      `CREATE TABLE IF NOT EXISTS qualidades (
          id          INTEGER PRIMARY KEY,
          mes_ano     TEXT,
          matricula   TEXT,
          tanque      TEXT,
          cbt         REAL,
          ccs         REAL,
          est         REAL,
          gordura     REAL,
          volume      REAL,
          faixa       TEXT
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

export const insertQualidade_init = async (qualidades) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < qualidades.length; i++) {
        tx.executeSql(
          `INSERT INTO qualidades(id, mes_ano, matricula, tanque, cbt, ccs, est, gordura, volume, faixa)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            qualidades[i].id,
            qualidades[i].mes_ano,
            qualidades[i].matricula,
            qualidades[i].tanque,
            qualidades[i].cbt,
            qualidades[i].ccs,
            qualidades[i].est,
            qualidades[i].gordura,
            qualidades[i].volume,
            qualidades[i].faixa
          ],
          (_, { rows: { _array } }) => { resolve(_array) },
          (_, error) => { reject(error) }
        )
      }
    }),
      null,
      resolve("ok")
  })
}


export const qualidade_por_tanque = async (tanque) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM qualidades`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const qualidadeByID = async (id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM qualidades WHERE id = ?`,
        [id],
        (_, { rows: { _array } }) => { resolve(_array[0]) },
        (_, error) => { reject(error) }
      )
    })
  })
}


