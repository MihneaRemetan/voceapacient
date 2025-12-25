import { Request, Response } from 'express';
import pool from '../config/database';

export const createReply = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: postId } = req.params;
        const { body, useRealName } = req.body;

        // Validation
        if (!body || body.trim().length === 0) {
            res.status(400).json({ error: 'Comentariul nu poate fi gol.' });
            return;
        }

        if (body.length > 500) {
            res.status(400).json({ error: 'Comentariul nu poate depăși 500 de caractere.' });
            return;
        }

        // Check if post exists and is approved
        const postResult = await pool.query(
            'SELECT id, status FROM posts WHERE id = $1',
            [postId]
        );

        if (postResult.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită.' });
            return;
        }

        if (postResult.rows[0].status !== 'approved') {
            res.status(400).json({ error: 'Nu poți comenta la o postare neaprobată.' });
            return;
        }

        // Get user info for display name
        const userResult = await pool.query(
            'SELECT name, show_real_name FROM users WHERE id = $1',
            [req.userId]
        );

        const user = userResult.rows[0];
        let displayName = 'Anonim';

        if (useRealName && user.show_real_name && user.name) {
            displayName = user.name;
        }

        // Create reply
        const result = await pool.query(
            `INSERT INTO replies (post_id, author_id, body, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, post_id, body, display_name, created_at`,
            [postId, req.userId, body, displayName]
        );

        const reply = result.rows[0];

        res.status(201).json({
            message: 'Comentariu adăugat cu succes.',
            reply: {
                id: reply.id,
                postId: reply.post_id,
                body: reply.body,
                displayName: reply.display_name,
                createdAt: reply.created_at
            }
        });
    } catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({ error: 'Eroare la adăugarea comentariului.' });
    }
};

export const getReplies = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: postId } = req.params;

        const result = await pool.query(
            `SELECT id, body, display_name, created_at
       FROM replies
       WHERE post_id = $1
       ORDER BY created_at ASC`,
            [postId]
        );

        res.json({ replies: result.rows });
    } catch (error) {
        console.error('Get replies error:', error);
        res.status(500).json({ error: 'Eroare la obținerea comentariilor.' });
    }
};
