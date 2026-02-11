import { Platform } from 'react-native';

// Mock DB interface for Web (SQLite doesn't work on web without complex setup)
const mockDb = {
  getAllAsync: async () => [],
  getFirstAsync: async () => null,
  runAsync: async () => { },
  execAsync: async () => { },
};

let db: any = mockDb;

// Only import SQLite on native platforms
if (Platform.OS !== 'web') {
  const SQLite = require('expo-sqlite');
  db = SQLite.openDatabaseSync('tennis_coach.db');
}

export { db };

export const initDb = async () => {
  if (Platform.OS === 'web') return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      level TEXT,
      created_at INTEGER
    );
  `);
};
