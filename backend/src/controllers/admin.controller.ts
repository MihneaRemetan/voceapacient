import { Request, Response } from 'express';
import pool from '../config/database';

export const getPendingPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT 
        p.id, p.title, p.body, p.unit_name, p.locality, p.county, 
        p.incident_date, p.display_name, p.created_at,
        COUNT(DISTINCT a.id) as attachment_count
       FROM posts p
       LEFT JOIN attachments a ON a.post_id = p.id
       WHERE p.status = 'pending'
       GROUP BY p.id
       ORDER BY p.created_at ASC`
        );

        const posts = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            body: row.body,
            unitName: row.unit_name,
            locality: row.locality,
            county: row.county,
            incidentDate: row.incident_date,
            displayName: row.display_name,
            createdAt: row.created_at,
            attachmentCount: parseInt(row.attachment_count)
        }));

        res.json({ posts });
    } catch (error) {
        console.error('Get pending posts error:', error);
        res.status(500).json({ error: 'Eroare la obținerea postărilor în așteptare.' });
    }
};

export const approvePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE posts
       SET status = 'approved'
       WHERE id = $1 AND status = 'pending'
       RETURNING id, status`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită sau deja procesată.' });
            return;
        }

        res.json({
            message: 'Postare aprobată cu succes.',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Approve post error:', error);
        res.status(500).json({ error: 'Eroare la aprobarea postării.' });
    }
};

export const rejectPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE posts
       SET status = 'rejected'
       WHERE id = $1 AND status = 'pending'
       RETURNING id, status`,
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită sau deja procesată.' });
            return;
        }

        res.json({
            message: 'Postare respinsă.',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Reject post error:', error);
        res.status(500).json({ error: 'Eroare la respingerea postării.' });
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, body, unitName, locality, county, incidentDate } = req.body;

        // Validation
        if (!body || body.trim().length === 0) {
            res.status(400).json({ error: 'Textul mărturiei nu poate fi gol.' });
            return;
        }

        if (body.length < 30) {
            res.status(400).json({ error: 'Textul trebuie să aibă cel puțin 30 de caractere.' });
            return;
        }

        if (!unitName || !locality || !county) {
            res.status(400).json({ error: 'Spital, localitate și județ sunt obligatorii.' });
            return;
        }

        // Update post
        const result = await pool.query(
            `UPDATE posts
       SET title = $1, body = $2, unit_name = $3, locality = $4, 
           county = $5, incident_date = $6
       WHERE id = $7
       RETURNING id, title, body, unit_name, locality, county, incident_date, status`,
            [title || null, body, unitName, locality, county, incidentDate || null, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită.' });
            return;
        }

        const post = result.rows[0];
        res.json({
            message: 'Postare actualizată cu succes.',
            post: {
                id: post.id,
                title: post.title,
                body: post.body,
                unitName: post.unit_name,
                locality: post.locality,
                county: post.county,
                incidentDate: post.incident_date,
                status: post.status
            }
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: 'Eroare la actualizarea postării.' });
    }
};

export const addAttachment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: postId } = req.params;

        // Check if post exists
        const postResult = await pool.query(
            'SELECT id FROM posts WHERE id = $1',
            [postId]
        );

        if (postResult.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită.' });
            return;
        }

        // Check if file was uploaded
        if (!req.file) {
            res.status(400).json({ error: 'Niciun fișier încărcat.' });
            return;
        }

        // Save attachment to database
        const result = await pool.query(
            `INSERT INTO attachments (post_id, file_path)
       VALUES ($1, $2)
       RETURNING id, file_path, created_at`,
            [postId, req.file.path]
        );

        const attachment = result.rows[0];
        res.status(201).json({
            message: 'Imagine adăugată cu succes.',
            attachment: {
                id: attachment.id,
                file_path: attachment.file_path,
                created_at: attachment.created_at
            }
        });
    } catch (error) {
        console.error('Add attachment error:', error);
        res.status(500).json({ error: 'Eroare la adăugarea imaginii.' });
    }
};

export const deleteAttachment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: postId, attachmentId } = req.params;

        // Verify the attachment belongs to the post
        const result = await pool.query(
            `DELETE FROM attachments
       WHERE id = $1 AND post_id = $2
       RETURNING id, file_path`,
            [attachmentId, postId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Imagine negăsită.' });
            return;
        }

        // Optionally delete the file from filesystem
        // For now we just remove from DB
        // const fs = require('fs');
        // fs.unlinkSync(result.rows[0].file_path);

        res.json({ message: 'Imagine ștearsă cu succes.' });
    } catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({ error: 'Eroare la ștergerea imaginii.' });
    }
};

export const getPostForEdit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Get post without status filter (admin can edit any post)
        const postResult = await pool.query(
            `SELECT id, title, body, unit_name, locality, county, incident_date, status, display_name, created_at
       FROM posts
       WHERE id = $1`,
            [id]
        );

        if (postResult.rows.length === 0) {
            res.status(404).json({ error: 'Postare negăsită.' });
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
            status: post.status,
            displayName: post.display_name,
            createdAt: post.created_at,
            attachments: attachmentsResult.rows,
            replies: repliesResult.rows
        });
    } catch (error) {
        console.error('Get post for edit error:', error);
        res.status(500).json({ error: 'Eroare la obținerea postării.' });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Check if post exists
        const postResult = await client.query(
            'SELECT id FROM posts WHERE id = $1',
            [id]
        );

        if (postResult.rows.length === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({ error: 'Postare negăsită.' });
            return;
        }

        // Delete replies
        await client.query('DELETE FROM replies WHERE post_id = $1', [id]);

        // Delete attachments
        await client.query('DELETE FROM attachments WHERE post_id = $1', [id]);

        // Delete post
        await client.query('DELETE FROM posts WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({ message: 'Postare ștearsă cu succes.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Eroare la ștergerea postării.' });
    } finally {
        client.release();
    }
};

