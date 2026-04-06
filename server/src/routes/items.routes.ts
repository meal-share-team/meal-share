import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/menu-items/:itemId
router.get("/:itemId", async (req: any, res: any) => {
    const { itemId } = req.params;

    const item = await prisma.menuItem.findUnique({
        where: { id: itemId },
        include: {
            _count: {
                select: { itemReviews: true }
            }
        }
    });

    if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
    }

    const aggregate = await prisma.itemReview.aggregate({
        where: { menuItemId: itemId },
        _avg: {
            rating: true
        }
    });

    res.json({
        ...item,
        averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating) : null,
        reviewCount: item._count.itemReviews
    });
});

// GET /api/menu-items/:itemId/reviews
router.get("/:itemId/reviews", async (req: any, res: any) => {
    const { itemId } = req.params;

    const reviews = await prisma.itemReview.findMany({
        where: { menuItemId: itemId },
        include: {
            user: {
                select: {
                    id: true,
                    displayName: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    res.json(reviews.map((r: any) => ({
        ...r,
        rating: Number(r.rating)
    })));
});

// POST /api/menu-items/:itemId/reviews
router.post("/:itemId/reviews", requireAuth, async (req: any, res: any) => {
    const { itemId } = req.params;
    const { rating, caption } = req.body;
    const user = (req as any).user;

    if (rating === undefined || rating === null) {
        return res.status(400).json({ message: "Rating is required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (caption && caption.length > 280) {
        return res.status(400).json({ message: "Comment cannot exceed 280 characters" });
    }

    try {
        // Check if user already reviewed this item
        const existing = await prisma.itemReview.findFirst({
            where: {
                userId: user.id,
                menuItemId: itemId,
            }
        });

        if (existing) {
            return res.status(400).json({ message: "You have already reviewed this item" });
        }

        const review = await prisma.itemReview.create({
            data: {
                userId: user.id,
                menuItemId: itemId,
                rating,
                caption,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                    }
                }
            }
        });

        res.status(201).json({
            ...review,
            rating: Number(review.rating)
        });
    } catch (error: any) {
        res.status(500).json({ message: "Failed to create review", error: error.message });
    }
});

export default router;
