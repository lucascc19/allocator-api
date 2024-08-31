import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS demands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      hours INTEGER,
      "order" INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS developers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      hoursAvailable INTEGER
    )
  `);
});

export default db;
