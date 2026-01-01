import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import pool from './config/database';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postsRoutes from './routes/posts.routes';
import repliesRoutes from './routes/replies.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Run migrations on startup
async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');
        
        const sql = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    county VARCHAR(100),
    show_real_name BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    body TEXT NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    county VARCHAR(100) NOT NULL,
    incident_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body VARCHAR(500) NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_county ON posts(county);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_post ON replies(post_id);
CREATE INDEX IF NOT EXISTS idx_attachments_post ON attachments(post_id);
        `;
        
        await pool.query(sql);
        console.log('✅ Migrations completed successfully');
    } catch (error: any) {
        if (error.message?.includes('already exists')) {
            console.log('ℹ️ Tables already exist, skipping migrations');
        } else {
            console.error('❌ Migration failed:', error);
        }
    }
}

runMigrations();

// Seed database on startup
async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...');

        const adminPassword = await bcrypt.hash('Mihnea193728', 10);
        await pool.query(
            `INSERT INTO users (email, password_hash, name, county, show_real_name, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash, 
           name = EXCLUDED.name,
           is_admin = EXCLUDED.is_admin`,
            ['mihnearemetan@gmail.com', adminPassword, 'Mihnea Remetan', 'Arad', true, true]
        );

        console.log('✅ Database seeded successfully');
    } catch (error: any) {
        console.error('⚠️ Seeding error:', error);
    }
}

seedDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts', repliesRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (err.message.includes('Tipul fișierului')) {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err.message.includes('File too large')) {
        res.status(400).json({ error: 'Fișierul este prea mare. Mărimea maximă este 5MB.' });
        return;
    }

    res.status(500).json({ error: 'Eroare internă a serverului.' });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta nu a fost găsită.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
