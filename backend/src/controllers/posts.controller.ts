import { Request, Response } from 'express';
import pool from '../config/database';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();

    try {
        const { title, body, unitName, locality, county, incidentDate, useRealName } = req.body;

        // Validation
        if (!body || body.trim().length < 30) {
            res.status(400).json({ error: 'Descrierea trebuie să aibă minimum 30 de caractere.' });
            return;
        }

        if (!unitName || !locality || !county) {
            res.status(400).json({ error: 'Spitalul, localitatea și județul sunt obligatorii.' });
            return;
        }

        await client.query('BEGIN');

        // Get user info for display name
        const userResult = await client.query(
            'SELECT name, show_real_name FROM users WHERE id = $1',
            [req.userId]
        );

        const user = userResult.rows[0];
        let displayName = 'Anonim';

        // Determine display name based on post preference and user settings
        if (useRealName && user.show_real_name && user.name) {
            displayName = user.name;
        }

        // Insert post
        const postResult = await client.query(
            `INSERT INTO posts (author_id, title, body, unit_name, locality, county, incident_date, status, display_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, author_id, title, body, unit_name, locality, county, incident_date, status, display_name, created_at`,
            [req.userId, title || null, body, unitName, locality, county, incidentDate || null, 'pending', displayName]
        );

        const post = postResult.rows[0];

        // Handle file uploads
        const files = req.files as Express.Multer.File[];
        const attachments = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const attachmentResult = await client.query(
                    'INSERT INTO attachments (post_id, file_path) VALUES ($1, $2) RETURNING id, file_path, created_at',
                    [post.id, file.path]
                );
                attachments.push(attachmentResult.rows[0]);
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Postare trimisă cu succes. Așteaptă aprobarea administratorului.',
            post: {
                id: post.id,
                authorId: post.author_id,
                title: post.title,
                body: post.body,
                unitName: post.unit_name,
                locality: post.locality,
                county: post.county,
                incidentDate: post.incident_date,
                status: post.status,
                displayName: post.display_name,
                createdAt: post.created_at,
                attachments
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Eroare la crearea postării.' });
    } finally {
        client.release();
    }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { county, unitName, limit = '20', offset = '0' } = req.query;

        let query = `
      SELECT 
        p.id, p.title, p.body, p.unit_name, p.locality, p.county, 
        p.incident_date, p.display_name, p.created_at,
        COUNT(DISTINCT r.id) as reply_count,
        COUNT(DISTINCT a.id) as attachment_count
      FROM posts p
      LEFT JOIN replies r ON r.post_id = p.id
      LEFT JOIN attachments a ON a.post_id = p.id
      WHERE p.status = 'approved'
    `;

        const params: any[] = [];
        let paramIndex = 1;

        if (county) {
            query += ` AND p.county = $${paramIndex}`;
            params.push(county);
            paramIndex++;
        }

        if (unitName) {
            query += ` AND p.unit_name ILIKE $${paramIndex}`;
            params.push(`%${unitName}%`);
            paramIndex++;
        }

        query += `
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

        params.push(parseInt(limit as string), parseInt(offset as string));

        const result = await pool.query(query, params);

        const posts = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            body: row.body.substring(0, 200) + (row.body.length > 200 ? '...' : ''),
            unitName: row.unit_name,
            locality: row.locality,
            county: row.county,
            incidentDate: row.incident_date,
            displayName: row.display_name,
            createdAt: row.created_at,
            replyCount: parseInt(row.reply_count),
            attachmentCount: parseInt(row.attachment_count)
        }));

        res.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Eroare la obținerea postărilor.' });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Get post
        const postResult = await pool.query(
            `SELECT id, title, body, unit_name, locality, county, incident_date, status, display_name, created_at
       FROM posts
       WHERE id = $1 AND status = 'approved'`,
            [id]
        );

        if (postResult.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită sau neaprobată.' });
            return;
        }

        const post = postResult.rows[0];

        // Get attachments
        const attachmentsResult = await pool.query(
            'SELECT id, file_path, created_at FROM attachments WHERE post_id = $1',
            [id]
        );

        // Get replies
        const repliesResult = await pool.query(
            'SELECT id, body, display_name, created_at FROM replies WHERE post_id = $1 ORDER BY created_at ASC',
            [id]
        );

        res.json({
            id: post.id,
            title: post.title,
            body: post.body,
            unitName: post.unit_name,
            locality: post.locality,
            county: post.county,
            incidentDate: post.incident_date,
            displayName: post.display_name,
            createdAt: post.created_at,
            attachments: attachmentsResult.rows,
            replies: repliesResult.rows
        });
    } catch (error) {
        console.error('Get post by id error:', error);
        res.status(500).json({ error: 'Eroare la obținerea postării.' });
    }
};
