import { Request, Response } from 'express';
import pool from '../config/database';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, county, show_real_name, is_admin, created_at FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Utilizator negăsit.' });
            return;
        }

        const user = result.rows[0];

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            county: user.county,
            showRealName: user.show_real_name,
            isAdmin: user.is_admin,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Eroare la obținerea profilului.' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, county, showRealName } = req.body;

        const result = await pool.query(
            `UPDATE users 
       SET name = COALESCE($1, name),
           county = COALESCE($2, county),
           show_real_name = COALESCE($3, show_real_name)
       WHERE id = $4
       RETURNING id, email, name, county, show_real_name, is_admin, created_at`,
            [name, county, showRealName, req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Utilizator negăsit.' });
            return;
        }

        const user = result.rows[0];

        res.json({
            message: 'Profil actualizat cu succes.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                county: user.county,
                showRealName: user.show_real_name,
                isAdmin: user.is_admin,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Eroare la actualizarea profilului.' });
    }
};
