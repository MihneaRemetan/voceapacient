import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: number;
    email: string;
    isAdmin: boolean;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Acces neautorizat. Token lipsă.' });
            return;
        }

        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.isAdmin = decoded.isAdmin;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalid sau expirat.' });
        return;
    }
};
