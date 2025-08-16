// SQL 模板专用类型
interface SqlTemplate {
  name: string;
  action: () => string;
}

export const sqlTemplates: SqlTemplate[] = [
  {
    name: '创建用户表',
    action: () => `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at TEXT NOT NULL
)`
  },
  {
    name: '创建文章表',
    action: () => `CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`
  },
  {
    name: '插入示例用户',
    action: () => `INSERT INTO users (name, email, age, created_at) 
VALUES ('张三', 'zhangsan@example.com', 25, datetime('now'))`
  },
  {
    name: '插入示例文章',
    action: () => `INSERT INTO posts (user_id, title, content, created_at)
VALUES (1, '我的第一篇文章', '这是文章内容...', datetime('now'))`
  },
  {
    name: '查询所有用户',
    action: () => 'SELECT * FROM users ORDER BY created_at DESC'
  },
  {
    name: '查询用户及文章数',
    action: () => `SELECT u.*, COUNT(p.id) as post_count 
FROM users u 
LEFT JOIN posts p ON u.id = p.user_id 
GROUP BY u.id 
ORDER BY u.created_at DESC`
  },
  {
    name: '查询最新文章',
    action: () => `SELECT p.*, u.name as author_name 
FROM posts p 
JOIN users u ON p.user_id = u.id 
ORDER BY p.created_at DESC 
LIMIT 10`
  }
];