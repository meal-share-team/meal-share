import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "restaurant";
}

async function resolveMenuItem(options: {
    itemId?: string;
    itemName?: string;
    restaurantName?: string;
    description?: string | null;
    priceCents?: number | null;
    createIfMissing?: boolean;
}) {
    const { itemId, itemName, restaurantName, description, priceCents, createIfMissing } = options;

    if (itemId) {
        const directItem = await prisma.menuItem.findUnique({
            where: { id: itemId },
        });

        if (directItem) {
            return directItem;
        }
    }

    if (!itemName || !restaurantName) {
        return null;
    }

    let restaurant = await prisma.restaurant.findFirst({
        where: {
            name: {
                equals: restaurantName,
                mode: "insensitive",
            }
        }
    });

    if (!restaurant && createIfMissing) {
        restaurant = await prisma.restaurant.create({
            data: {
                name: restaurantName,
                slug: `${slugify(restaurantName)}-${Date.now()}`,
                claimed: false,
            }
        });
    }

    if (!restaurant) {
        return null;
    }

    const existingItem = await prisma.menuItem.findFirst({
        where: {
            restaurantId: restaurant.id,
            name: {
                equals: itemName,
                mode: "insensitive",
            }
        }
    });

    if (existingItem || !createIfMissing) {
        return existingItem;
    }

    return prisma.menuItem.create({
        data: {
            restaurantId: restaurant.id,
            name: itemName,
            description: description || null,
            priceCents: priceCents ?? null,
            active: true,
        }
    });
}

router.get("/:itemId", async (req: any, res: any) => {
    const { itemId } = req.params;

    const item = await prisma.menuItem.findUnique({
        where: { id: itemId },
        select: {
            id: true,
            name: true,
            description: true,
            priceCents: true,
            restaurantId: true,
            restaurant: {
                select: {
                    id: true,
                    name: true,
                }
            },
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
        _avg: { rating: true }
    });

    res.json({
        ...item,
        averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating) : null,
        reviewCount: item._count.itemReviews,
    });
});

router.get("/:itemId/reviews", async (req: any, res: any) => {
    const { itemId } = req.params;
    const menuItem = await resolveMenuItem({
        itemId,
        itemName: typeof req.query.itemName === "string" ? req.query.itemName : undefined,
        restaurantName: typeof req.query.restaurantName === "string" ? req.query.restaurantName : undefined,
    });

    if (!menuItem) {
        return res.json([]);
    }

    const reviews = await prisma.itemReview.findMany({
        where: { menuItemId: menuItem.id },
        include: {
            user: {
                select: {
                    id: true,
                    displayName: true,
                    email: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    res.json(reviews.map((review: any) => ({
        id: review.id,
        menuItemId: review.menuItemId,
        userId: review.userId,
        rating: Number(review.rating),
        caption: review.caption,
        createdAt: review.createdAt,
        user: review.user,
    })));
});

router.post("/:itemId/reviews", requireAuth, async (req: any, res: any) => {
    try {
        const { itemId } = req.params;
        const { rating, caption, itemName, restaurantName, description, priceCents } = req.body;
        const user = req.user;
        const normalizedCaption = typeof caption === "string" ? caption.trim() : "";
        const numericRating = Number(rating);

        console.log(`Creating review for item ${itemId} by user ${user.id}`);

        if (!rating) {
            return res.status(400).json({ message: "Please choose a rating before submitting." });
        }

        if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        if (normalizedCaption.length > 280) {
            return res.status(400).json({ message: "Comment cannot exceed 280 characters." });
        }

        const menuItem = await resolveMenuItem({
            itemId,
            itemName,
            restaurantName,
            description,
            priceCents: typeof priceCents === "number" ? priceCents : null,
            createIfMissing: true,
        });

        if (!menuItem) {
            console.error("MenuItem resolution failed for:", { itemId, itemName, restaurantName });
            return res.status(404).json({ message: "Menu item not found." });
        }

        const existingReview = await prisma.itemReview.findFirst({
            where: {
                menuItemId: menuItem.id,
                userId: user.id,
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this menu item." });
        }

        const review = await prisma.itemReview.create({
            data: {
                menuItemId: menuItem.id,
                userId: user.id,
                rating: numericRating,
                caption: normalizedCaption || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                    }
                }
            }
        });

        res.status(201).json({
            id: review.id,
            menuItemId: review.menuItemId,
            userId: review.userId,
            rating: Number(review.rating),
            caption: review.caption,
            createdAt: review.createdAt,
            user: review.user,
        });
    } catch (error) {
        console.error("Critical error creating review:", error);
        res.status(500).json({ message: "An internal server error occurred while saving your review." });
    }
});

export default router;
