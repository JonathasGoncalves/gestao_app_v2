import * as SQLite from "expo-sqlite"
import * as OpcaoPerguntaDAO from './opcao_perguntaDAO';

const gestao_db = SQLite.openDatabase('db_gestao.db')

export const createTableOpcoes = async () => {
  return new Promise((resolve, reject) => {
    var sql_array = [
      `DROP TABLE IF EXISTS opcoes;`,
      `CREATE TABLE IF NOT EXISTS opcoes (
          id          INTEGER PRIMARY KEY,
          nome_opcao  TEXT
        );`,
    ];
    gestao_db.transaction(tx => {
      for (var i = 0; i < sql_array.length; i++) {
        tx.executeSql(
          sql_array[i],
          [],
          (_, { rows: { _array } }) => { resolve(_array) },
          (_, error) => {
            reject(error)
          }
        )
      }
    })
  })
}

export const insertOpcao_init = async (opcoes) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      for (var i = 0; i < opcoes.length; i++) {
        tx.executeSql(
          `INSERT INTO opcoes(id, nome_opcao)
        VALUES(?, ?)`,
          [
            opcoes[i].id,
            opcoes[i].nome_opcao
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

export const opcaoByPergunta = async (id_pergunta) => {
  return new Promise((resolve, reject) => {
    gestao_db.transaction(tx => {
      tx.executeSql(
        `SELECT opcoes.id, opcoes.nome_opcao, opcoes_perguntas.positiva, opcoes_perguntas.id as id_OP FROM opcoes_perguntas
        JOIN opcoes ON opcoes.id = opcoes_perguntas.opcao_id
        WHERE opcoes_perguntas.pergunta_id = ?`,
        [id_pergunta],
        async (_, { rows: { _array } }) => {
          resolve(_array)
        },
        (_, error) => { reject(error) }
      )
    })
  })
}


