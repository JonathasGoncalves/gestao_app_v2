import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

export default async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  return SQLite.openDatabase('db_gestao.db');
}
