import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // Create admin user
        const adminPassword = await bcrypt.hash('Mihnea193728', 10);
        await pool.query(
            `INSERT INTO users (email, password_hash, name, county, show_real_name, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
            ['mihnearemetan@gmail.com', adminPassword, 'Mihnea Remetan', 'Arad', true, true]
        );

        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
