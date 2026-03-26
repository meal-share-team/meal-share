import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const role = req.header("x-user-role");
    const userId = req.header("x-user-id");

    if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).user = { id: userId, role };
    next();
}