import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'myblog-dev-secret';

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

db.on('error', (err) => {
    console.error('❌ MySQL 连接异常:', err.message);
});

const dbPromise = db.promise();

// ==================== 数据库初始化 ====================

(async () => {
    try {
        await dbPromise.query('SELECT 1');
        console.log('✅ 腾讯云 MySQL 连接成功');

        await dbPromise.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await dbPromise.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                content LONGTEXT NOT NULL,
                description TEXT,
                tags JSON,
                sticky INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await dbPromise.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_slug VARCHAR(255) NOT NULL,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_post_slug (post_slug)
            )
        `);

        console.log('✅ 数据表已就绪');

        // 创建默认管理员
        const [users] = await dbPromise.query('SELECT id FROM users WHERE username = ?', ['admin']);
        if (users.length === 0) {
            const hash = await bcrypt.hash('admin123', 10);
            await dbPromise.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash]);
            console.log('✅ 默认管理员已创建 (admin / admin123)');
            console.log('⚠️  请及时修改密码！');
        }
    } catch (err) {
        console.error('❌ 数据库初始化失败:', err.message);
        console.log('⚠️  服务器将继续运行，数据库功能暂不可用');
    }
})();

// ==================== JWT 鉴权中间件 ====================

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: '未登录' });
    }
    try {
        const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ success: false, message: '登录已过期，请重新登录' });
    }
}

function adminMiddleware(req, res, next) {
    if (req.user.username !== 'admin') {
        return res.status(403).json({ success: false, message: '仅管理员可执行此操作' });
    }
    next();
}

// ==================== 根路由 ====================

app.get('/', (req, res) => {
    res.json({
        message: 'MyBlog API',
        database: `腾讯云 MySQL (${process.env.DB_HOST})`,
        endpoints: {
            'POST /api/register': '注册',
            'POST /api/login': '登录',
            'PUT /api/change-password': '修改密码',
            'GET /api/me': '当前登录状态',
            'GET /api/posts': '获取所有文章',
            'GET /api/posts/:slug': '获取单篇文章',
            'POST /api/posts': '创建文章 (需登录)',
            'PUT /api/posts/:slug': '更新文章 (需登录)',
            'DELETE /api/posts/:slug': '删除文章 (需登录)',
            'GET /api/posts/:slug/comments': '获取评论',
            'POST /api/posts/:slug/comments': '发布评论',
            'DELETE /api/comments/:id': '删除评论',
        },
    });
});

// ==================== 登录 API ====================

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    try {
        const [rows] = await dbPromise.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }
        const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: '登录成功', data: { token, username: rows[0].username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '登录失败', error: err.message });
    }
});

// ==================== 注册 API ====================

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    if (username.length < 3) {
        return res.status(400).json({ success: false, message: '用户名至少3个字符' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: '密码至少6个字符' });
    }
    try {
        const [existing] = await dbPromise.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: '用户名已存在' });
        }
        const hash = await bcrypt.hash(password, 10);
        await dbPromise.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
        res.json({ success: true, message: '注册成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '注册失败', error: err.message });
    }
});

// ==================== 修改密码 API ====================

app.put('/api/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: '当前密码和新密码不能为空' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: '新密码至少6个字符' });
    }
    try {
        const [rows] = await dbPromise.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }
        const match = await bcrypt.compare(currentPassword, rows[0].password);
        if (!match) {
            return res.status(401).json({ success: false, message: '当前密码错误' });
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await dbPromise.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
        res.json({ success: true, message: '密码修改成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '修改密码失败', error: err.message });
    }
});

// ==================== 当前登录状态 ====================

app.get('/api/me', authMiddleware, (req, res) => {
    res.json({ success: true, data: { username: req.user.username, role: req.user.username === 'admin' ? 'admin' : 'user' } });
});

// ==================== 文章管理 API ====================

function makeSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100) || 'post';
}

// 获取所有文章
app.get('/api/posts', async (req, res) => {
    try {
        const [rows] = await dbPromise.query(
            'SELECT id, slug, title, description, tags, sticky, created_at, updated_at FROM posts ORDER BY sticky DESC, created_at DESC'
        );
        const posts = rows.map(r => ({
            ...r,
            tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags || []),
        }));
        res.json({ success: true, data: posts, total: posts.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '获取文章失败', error: err.message });
    }
});

// 获取单篇文章（含全文）
app.get('/api/posts/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await dbPromise.query('SELECT * FROM posts WHERE slug = ?', [slug]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        const post = rows[0];
        post.tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []);
        res.json({ success: true, data: post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '获取文章失败', error: err.message });
    }
});

// 创建文章
app.post('/api/posts', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, content, description, tags, sticky } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: '标题和内容不能为空' });
    }
    const slug = makeSlug(title);
    const tagsJson = JSON.stringify(tags || []);
    try {
        const [result] = await dbPromise.query(
            'INSERT INTO posts (slug, title, content, description, tags, sticky) VALUES (?, ?, ?, ?, ?, ?)',
            [slug, title, content, description || null, tagsJson, sticky || 0]
        );
        res.status(201).json({
            success: true,
            message: '文章创建成功',
            data: { id: result.insertId, slug, title },
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: '同名文章已存在，请修改标题' });
        }
        console.error(err);
        res.status(500).json({ success: false, message: '创建文章失败', error: err.message });
    }
});

// 更新文章
app.put('/api/posts/:slug', authMiddleware, adminMiddleware, async (req, res) => {
    const { slug } = req.params;
    const { title, content, description, tags, sticky } = req.body;
    try {
        const tagsJson = tags ? JSON.stringify(tags) : undefined;
        const [result] = await dbPromise.query(
            'UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content), description = COALESCE(?, description), tags = COALESCE(?, tags), sticky = COALESCE(?, sticky) WHERE slug = ?',
            [title || null, content || null, description || null, tagsJson || null, sticky !== undefined ? sticky : null, slug]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        res.json({ success: true, message: '文章更新成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '更新文章失败', error: err.message });
    }
});

// 删除文章
app.delete('/api/posts/:slug', authMiddleware, adminMiddleware, async (req, res) => {
    const { slug } = req.params;
    try {
        const [result] = await dbPromise.query('DELETE FROM posts WHERE slug = ?', [slug]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: '文章不存在' });
        }
        res.json({ success: true, message: '文章删除成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '删除文章失败', error: err.message });
    }
});

// ==================== 评论 API ====================

app.get('/api/posts/:slug/comments', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await dbPromise.query(
            'SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC', [slug]
        );
        res.json({ success: true, data: rows, total: rows.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '获取评论失败', error: err.message });
    }
});

app.post('/api/posts/:slug/comments', async (req, res) => {
    const { slug } = req.params;
    const { username, email, content } = req.body;
    if (!username || !content) {
        return res.status(400).json({ success: false, message: '用户名和评论内容不能为空' });
    }
    if (username.length > 50) return res.status(400).json({ success: false, message: '用户名不能超过50个字符' });
    if (content.length > 1000) return res.status(400).json({ success: false, message: '评论内容不能超过1000个字符' });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: '邮箱格式不正确' });
    try {
        const [result] = await dbPromise.query(
            'INSERT INTO comments (post_slug, username, email, content) VALUES (?, ?, ?, ?)',
            [slug, username, email || null, content]
        );
        res.status(201).json({
            success: true, message: '评论发布成功',
            data: { id: result.insertId, post_slug: slug, username, email: email || null, content, created_at: new Date().toISOString() },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '发布评论失败', error: err.message });
    }
});

app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await dbPromise.query('DELETE FROM comments WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: '评论不存在' });
        res.json({ success: true, message: '评论删除成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '删除评论失败', error: err.message });
    }
});

// ==================== 生产环境：前端静态文件 ====================

if (process.env.NODE_ENV === 'production') {
    app.use('/my-blog', express.static('dist'));
    app.get('/my-blog/:path(.*)', (req, res) => {
        res.sendFile('index.html', { root: 'dist' });
    });
}

// ==================== 404 / 错误处理 ====================

app.use((req, res) => {
    res.status(404).json({ success: false, message: '接口不存在' });
});

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ success: false, message: '服务器内部错误', error: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 MyBlog API 运行在 http://localhost:${PORT}`);
    console.log(`📡 数据库: ${process.env.DB_HOST}`);
});
