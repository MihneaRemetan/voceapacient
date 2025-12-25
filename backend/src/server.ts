import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postsRoutes from './routes/posts.routes';
import repliesRoutes from './routes/replies.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",          // frontend local (AL TĂU)
    "https://NUME-PROIECT.vercel.app" // frontend prod (Vercel)
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
