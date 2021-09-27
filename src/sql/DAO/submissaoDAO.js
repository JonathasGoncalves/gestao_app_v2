import * as SQLite from "expo-sqlite"
import * as qualidadeDAO from '../DAO/qualidadesDAO';

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableSubmissao = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS submissao;`,
      `CREATE TABLE IF NOT EXISTS submissao (
          id              INTEGER PRIMARY KEY,
          DataSubmissao   TEXT,
          qualidade_id    INTEGER,
          realizada       INTEGER,
          aproveitamento  REAL,
          atualizado      INTEGER
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

export const insertSubmissao_init = async (submissoes) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < submissoes.length; i++) {
        tx.executeSql(
          `INSERT INTO submissao(id, DataSubmissao, qualidade_id, realizada, aproveitamento, atualizado )
        VALUES(?, ?, ?, ?, ?, ?)`,
          [
            submissoes[i].id,
            submissoes[i].DataSubmissao,
            submissoes[i].qualidade_id,
            submissoes[i].realizada,
            submissoes[i].aproveitamento,
            1
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

export const insertSubmissao = async (submissao) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO submissao(id, DataSubmissao, qualidade_id,  realizada, aproveitamento, atualizado)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [
          submissao.id,
          submissao.DataSubmissao,
          submissao.qualidade_id,
          submissao.realizada,
          submissao.aproveitamento,
          0
        ],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}


export const novo_id_submissao = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT MAX(id) as id FROM submissao`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const submissaoAll = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM submissao`,
        [],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const submissoes_pendentes = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT *
        FROM submissao where atualizado = ?`,
        [0],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const submissaoByID = async (id) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM submissao WHERE ID = ?`,
        [id],
        async (_, { rows: { _array } }) => {
          _array[0].qualidade = await qualidadeDAO.qualidadeByID(_array[0].qualidade_id)
          resolve(_array[0])
        },
        (_, error) => { reject(error) }
      )
    })
  })
}