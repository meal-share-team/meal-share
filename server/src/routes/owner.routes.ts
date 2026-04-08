import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.use(requireAuth, requireRole(["OWNER", "ADMIN"]));

router.get("/dashboard", async (req: any, res: any) => {
    const user = (req as any).user;
    const restaurants = await prisma.restaurant.findMany({
        where: user.role === "ADMIN" ? undefined : { ownerUserId: user.id },
        select: {
            id: true,
            name: true,
            claimed: true,
            _count: { select: { menuItems: true, combos: true } },
        }
    });
    res.json(restaurants);
});

router.get("/reviews", async (req: any, res: any) => {
    const user = req.user;
    const displayName = user.displayName?.trim();

    const reviews = await prisma.itemReview.findMany({
        where: user.role === "ADMIN"
            ? undefined
            : {
                OR: [
                    {
                        menuItem: {
                            restaurant: {
                                ownerUserId: user.id,
                            }
                        }
                    },
                    ...(displayName ? [{
                        menuItem: {
                            restaurant: {
                                name: {
                                    equals: displayName,
                                    mode: "insensitive" as const,
                                }
                            }
                        }
                    }] : []),
                ],
            },
        include: {
            user: {
                select: {
                    displayName: true,
                    email: true,
                }
            },
            menuItem: {
                select: {
                    name: true,
                    restaurant: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    res.json(reviews.map((review: any) => ({
        id: review.id,
        dishName: review.menuItem.name,
        restaurantName: review.menuItem.restaurant.name,
        customerName: review.user.displayName ?? review.user.email ?? "Anonymous",
        rating: Number(review.rating),
        caption: review.caption,
        createdAt: review.createdAt,
    })));
});

router.post("/restaurants/:restaurantId/menu-items", async (req: any, res: any) => {
    const { restaurantId } = req.params;
    const { name, description, priceCents } = req.body;

    const item = await prisma.menuItem.create({
        data: {
            restaurantId,
            name,
            description,
            priceCents,
        }
    });

    res.status(201).json(item);
});

export default router;
