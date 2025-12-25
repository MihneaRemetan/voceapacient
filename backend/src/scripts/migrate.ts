import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        const migrationPath = path.join(__dirname, '../migrations/001_init.sql');
        const sql = fs.readFileSync(migrationPath, 'utf-8');

        await pool.query(sql);

        console.log('✅ Migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
