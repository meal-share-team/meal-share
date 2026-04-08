import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authProviderId = req.header("x-user-id");
    const email = req.header("x-user-email");
    const displayName = req.header("x-user-display-name");
    const roleHeader = req.header("x-user-role");

    if (!authProviderId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!email) {
        return res.status(401).json({ message: "User email missing" });
    }

    const normalizedRole =
        roleHeader === "OWNER" || roleHeader === "ADMIN" ? roleHeader : "CUSTOMER";

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { authProviderId },
                { email },
                { id: authProviderId },
            ],
        },
        select: {
            id: true,
            authProviderId: true,
            role: true,
            displayName: true,
            email: true,
        }
    });

    const user = existingUser
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                authProviderId,
                email,
                displayName: displayName || existingUser.displayName,
                role: normalizedRole,
            },
            select: {
                id: true,
                role: true,
                displayName: true,
                email: true,
            }
        })
        : await prisma.user.create({
            data: {
                authProviderId,
                email,
                displayName: displayName || null,
                role: normalizedRole,
            },
            select: {
                id: true,
                role: true,
                displayName: true,
                email: true,
            }
        });

    (req as any).user = user;
    next();
}