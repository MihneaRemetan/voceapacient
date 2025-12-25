import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAdmin) {
        res.status(403).json({ error: 'Acces interzis. Necesită drepturi de administrator.' });
        return;
    }
    next();
};
