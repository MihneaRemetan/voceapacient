import bcrypt from 'bcryptjs';
import pool from '../config/database';

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
            `INSERT INTO users (email, password_hash, name, county, show_real_name, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
            ['admin@civic-platform.ro', adminPassword, 'Administrator', 'Arad', true, true]
        );

        console.log('✅ Admin user created: admin@civic-platform.ro / admin123');

        // Create demo users
        const demoUsers = [
            { email: 'maria.popescu@example.com', name: 'Maria Popescu', county: 'Arad' },
            { email: 'ion.ionescu@example.com', name: 'Ion Ionescu', county: 'București' },
            { email: 'ana.vasilescu@example.com', name: 'Ana Vasilescu', county: 'Cluj' }
        ];

        const userPassword = await bcrypt.hash('demo123', 10);

        for (const user of demoUsers) {
            await pool.query(
                `INSERT INTO users (email, password_hash, name, county, show_real_name, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING`,
                [user.email, userPassword, user.name, user.county, true, false]
            );
        }

        console.log('✅ Demo users created with password: demo123');

        // Get user IDs for creating posts
        const usersResult = await pool.query(
            'SELECT id, name FROM users WHERE is_admin = false ORDER BY id LIMIT 3'
        );

        if (usersResult.rows.length > 0) {
            // Create sample posts
            const samplePosts = [
                {
                    authorId: usersResult.rows[0].id,
                    title: 'Experiență negativă la UPU',
                    body: 'Am așteptat 6 ore la urgențe fără să primesc nici măcar o consultație preliminară. Personalul părea overwhelmed și nimeni nu ne-a dat informații clare despre timpul de așteptare. Atmosfera era tensionată și facilități minime pentru pacienți.',
                    unitName: 'Spitalul Județean Arad',
                    locality: 'Arad',
                    county: 'Arad',
                    incidentDate: '2025-11-15',
                    displayName: usersResult.rows[0].name
                },
                {
                    authorId: usersResult.rows[1].id,
                    title: 'Lipsă de igienă în salon',
                    body: 'Am fost internată pentru o intervenție chirurgicală planificată. Salonul era murdar, pătura veche și pătată, iar toaleta nu funcționa corespunzător. Am cerut să fie făcută curățenie dar mi s-a spus că vine "mai târziu". Condiții inacceptabile pentru un spital.',
                    unitName: 'Spitalul Universitar de Urgență București',
                    locality: 'București',
                    county: 'București',
                    incidentDate: '2025-10-28',
                    displayName: 'Anonim'
                },
                {
                    authorId: usersResult.rows[2].id,
                    title: 'Personal nepoliticos și lipsă de empatie',
                    body: 'Mama mea în vârstă de 75 de ani a fost tratată foarte urât de către asistentele medicale. I-au vorbit ridicol și au ignorat-o când cerea ajutor să meargă la toaletă. Este inadmisibil cum sunt tratați pacienții vârstnici în spitale. Acest comportament trebuie sancționat.',
                    unitName: 'Spitalul Clinic Județean de Urgență Cluj',
                    locality: 'Cluj-Napoca',
                    county: 'Cluj',
                    incidentDate: '2025-12-01',
                    displayName: usersResult.rows[2].name
                }
            ];

            for (const post of samplePosts) {
                await pool.query(
                    `INSERT INTO posts (author_id, title, body, unit_name, locality, county, incident_date, status, display_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [post.authorId, post.title, post.body, post.unitName, post.locality, post.county,
                    post.incidentDate, 'approved', post.displayName]
                );
            }

            console.log('✅ Sample posts created');

            // Create a pending post
            await pool.query(
                `INSERT INTO posts (author_id, title, body, unit_name, locality, county, status, display_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    usersResult.rows[0].id,
                    'Medicație indisponibilă',
                    'Am fost internat pentru tratament, dar mi s-a spus că medicația prescrisă nu este disponibilă în spital și trebuie să o cumpăr eu din afară. Este incredibil că un spital nu are medicamente de bază disponibile pentru pacienți.',
                    'Spitalul Municipal Arad',
                    'Arad',
                    'Arad',
                    'pending',
                    usersResult.rows[0].name
                ]
            );

            console.log('✅ Pending post created (for admin approval demo)');
        }

        console.log('\n📋 Summary:');
        console.log('   Admin: admin@civic-platform.ro / admin123');
        console.log('   Users: maria.popescu@example.com, ion.ionescu@example.com, ana.vasilescu@example.com');
        console.log('   Password for all demo users: demo123');
        console.log('   Sample posts: 3 approved + 1 pending');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
