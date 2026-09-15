import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

export const collections = ['users', 'categories', 'banners', 'storybooks', 'videos', 'elearnings', 'quizzes', 'quizResults', 'storybookQuizResults', 'flashcards', 'resetTokens', 'verificationTokens', 'storyQuizSessions', 'quizAttempts', 'classes', 'memberships', 'assignments', 'classAttempts', 'classResults', 'classActivity', 'storybookDrafts', 'lessonDrafts'];
export function createStore(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const sql = new DatabaseSync(path.join(directory, 'library.sqlite'));
  sql.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS records (collection TEXT NOT NULL, id TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(collection,id)); CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT);');
  const put = sql.prepare('INSERT INTO records VALUES(?,?,?) ON CONFLICT(collection,id) DO UPDATE SET payload=excluded.payload');
  const get = sql.prepare('SELECT payload FROM records WHERE collection=? AND id=?');
  const remove = sql.prepare('DELETE FROM records WHERE collection=? AND id=?');
  const snapshots = new WeakMap();
  const keyOf = row => row._id || row.token;
  function readDb() {
    const db = Object.fromEntries(collections.map(key => [key, []]));
    for (const row of sql.prepare('SELECT * FROM records ORDER BY rowid').all()) {
      if (db[row.collection]) db[row.collection].push(JSON.parse(row.payload));
    }
    snapshots.set(db, structuredClone(db));
    return db;
  }
  function writeDb(db) {
    const base = snapshots.get(db) || Object.fromEntries(collections.map(key => [key, []]));
    sql.exec('BEGIN IMMEDIATE');
    try {
      for (const collection of collections) {
        const old = new Map(base[collection].map(row => [keyOf(row), JSON.stringify(row)]));
        const next = new Map(db[collection].map(row => [keyOf(row), JSON.stringify(row)]));
        for (const key of new Set([...old.keys(), ...next.keys()])) {
          if (old.get(key) === next.get(key)) continue;
          // Detect stale updates instead of silently overwriting changes made during await.
          if (get.get(collection, key)?.payload !== old.get(key)) {
            throw Object.assign(new Error('Dữ liệu vừa được thay đổi. Vui lòng tải lại và thử lại.'), { status: 409 });
          }
          if (next.has(key)) {
            if (collection === 'users') {
              const user = JSON.parse(next.get(key));
              const conflict = sql.prepare("SELECT id FROM records WHERE collection='users' AND id<>? AND (lower(json_extract(payload,'$.username'))=lower(?) OR (?<>'' AND lower(json_extract(payload,'$.email'))=lower(?)))").get(key, user.username, user.email || '', user.email || '');
              if (conflict) throw Object.assign(new Error('Tên đăng nhập hoặc email đã được sử dụng.'), { status: 409 });
            }
            put.run(collection, key, next.get(key));
          }
          else remove.run(collection, key);
        }
      }
      sql.exec('COMMIT');
      snapshots.set(db, structuredClone(db));
    } catch (error) { sql.exec('ROLLBACK'); throw error; }
  }
  if (!sql.prepare("SELECT value FROM metadata WHERE key='json-imported'").get()) {
    const legacy = path.join(directory, 'db.json');
    if (fs.existsSync(legacy)) {
      const data = JSON.parse(fs.readFileSync(legacy, 'utf8').replace(/^\uFEFF/, ''));
      const db = readDb();
      for (const collection of collections) db[collection] = data[collection] || [];
      // Legacy password reset tokens are intentionally not migrated.
      db.resetTokens = [];
      writeDb(db);
    }
    sql.exec("INSERT INTO metadata VALUES('json-imported','1')");
  }
  return { readDb, writeDb, close: () => sql.close() };
}
