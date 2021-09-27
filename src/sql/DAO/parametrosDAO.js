import * as SQLite from "expo-sqlite"

const gestao_db = SQLite.openDatabase('db_gestao.db')


export const createTableParametros = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS parametros;`,
      `CREATE TABLE IF NOT EXISTS parametros (
          chave         TEXT PRIMARY KEY,
          valor         TEXT
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

export const insertParametros_init = async (parametros) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < parametros.length; i++) {
        tx.executeSql(
          `INSERT INTO parametros(chave, valor)
        VALUES(?, ?)`,
          [
            parametros[i].chave,
            parametros[i].valor
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

export const parametrosByChave = async (chave) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(async tx => {
      //BUSCAR OPCAO_PERGUNTA DESSA PERGUNTA
      tx.executeSql(
        `SELECT * FROM parametros WHERE chave = ?`,
        [chave],
        async (_, { rows: { _array } }) => {
          resolve(_array[0].valor)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const insertParametro = async (parametro) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO parametros(chave, valor)
        VALUES(?, ?)`,
        [
          parametro.chave,
          parametro.valor
        ],
        (_, { rows: { _array } }) => { resolve(_array) },
        (_, error) => { reject(error) }
      )
    })
  })
}

export const updateParametrosByChave = async (chave, valor) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(async tx => {
      //BUSCAR OPCAO_PERGUNTA DESSA PERGUNTA
      tx.executeSql(
        `UPDATE parametros SET valor = ?
        WHERE chave = ?`,
        [valor, chave],
        async (_, { rows: { _array } }) => {
          resolve(_array[0])
        },
        (_, error) => { reject(error) }
      )
    })
  })
}


export const parametros_delete_all = async () => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(async tx => {
      //BUSCAR OPCAO_PERGUNTA DESSA PERGUNTA
      tx.executeSql(
        `DELETE * FROM parametros`,
        [],
        async (_, { rows: { _array } }) => {
          resolve(_array[0])
        },
        (_, error) => { reject(error) }
      )
    })
  })
}