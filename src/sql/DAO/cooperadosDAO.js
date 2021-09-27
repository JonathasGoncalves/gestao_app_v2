import * as SQLite from "expo-sqlite";

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableCooperado = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS cooperados;`,
      `CREATE TABLE IF NOT EXISTS cooperados (
          matricula     TEXT PRIMARY KEY,
          codigo_cacal  TEXT ,
          nome          TEXT,
          municipio     TEXT
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

export const insertCooperado_init = async (cooperados) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < cooperados.length; i++) {
        tx.executeSql(
          `INSERT INTO cooperados(matricula, codigo_cacal,nome, municipio)
        VALUES(?, ?, ?, ?)`,
          [
            cooperados[i].matricula,
            cooperados[i].codigo_cacal,
            cooperados[i].nome,
            cooperados[i].municipio
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


export const cooperadosAll = async (mes_ano) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT
          qualidades.id as qualidade_id,
          qualidades.cbt,
          qualidades.ccs,
          cooperados.matricula,
          cooperados.codigo_cacal,
          cooperados.nome,
          cooperados.municipio,
          tanques.tanque,
          tanques.latao,
          tanques.id as tanque_id
        FROM cooperados
        LEFT OUTER JOIN qualidades
          ON qualidades.matricula = cooperados.matricula AND qualidades.mes_ano = ?
        JOIN tanques
          ON tanques.matricula = qualidades.matricula AND tanques.tanque = qualidades.tanque`,
        [mes_ano],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}
