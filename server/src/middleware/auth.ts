import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
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

        const neighborhood = req.header("x-user-neighborhood");

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

        let user;
        if (existingUser) {
            user = await prisma.user.update({
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
            });
        } else {
            user = await prisma.user.create({
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
        }

        // Automatically create a restaurant for OWNERs if they don't have one
        if (user.role === "OWNER") {
            const restaurantCount = await prisma.restaurant.count({
                where: { ownerUserId: user.id }
            });
            
            if (restaurantCount === 0) {
                const restaurantName = displayName || "My Restaurant";
                const slug = restaurantName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);

                console.log(`Auto-creating restaurant for owner ${user.id}: ${restaurantName}`);
                await prisma.restaurant.create({
                    data: {
                        name: restaurantName,
                        slug,
                        city: neighborhood || null,
                        ownerUserId: user.id,
                        claimed: true
                    }
                });
            }
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Authentication internal error" });
    }
}