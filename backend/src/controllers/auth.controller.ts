import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

/* =========================
   JWT CONFIG (ONE TIME)
========================= */

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/* =========================
   REGISTER
========================= */

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, county } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email și parola sunt obligatorii.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Parola trebuie să aibă minimum 6 caractere.' });
      return;
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: 'Email-ul este deja înregistrat.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, county, show_real_name, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, county, show_real_name, is_admin, created_at`,
      [email.toLowerCase(), passwordHash, name || null, county || null, false, false]
    );

    const user = result.rows[0];

    const isAdmin = user.is_admin;

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Autentificare reușită.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        county: user.county,
        showRealName: user.show_real_name,
        isAdmin: isAdmin,
        createdAt: user.created_at
      }
    });


  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Eroare la crearea contului.' });
  }
};

/* =========================
   LOGIN
========================= */

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email și parola sunt obligatorii.' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Email sau parolă incorectă.' });
      return;
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      res.status(401).json({ error: 'Email sau parolă incorectă.' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Autentificare reușită.',
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Eroare la autentificare.' });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Parola curentă și cea nouă sunt obligatorii.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Parola nouă trebuie să aibă minimum 6 caractere.' });
      return;
    }

    const result = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Utilizator negăsit.' });
      return;
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      res.status(401).json({ error: 'Parola curentă este incorectă.' });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newPasswordHash, req.userId]
    );

    res.json({ message: 'Parola a fost schimbată cu succes.' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Eroare la schimbarea parolei.' });
  }
};

/* =========================
   GET CURRENT USER
========================= */

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
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
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Eroare la obținerea datelor utilizatorului.' });
  }
};
