import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req: any, res: any) => {
    const restaurants = await prisma.restaurant.findMany({
        where: { claimed: true },
        select: {
            id: true,
            slug: true,
            name: true,
            city: true,
            state: true,
            _count: { select: { menuItems: true } },
        },
        orderBy: { name: "asc" }
    });

    res.json(restaurants);
});

router.get("/:restaurantId", async (req: any, res: any) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: req.params.restaurantId },
        select: {
            id: true,
            name: true,
            description: true,
            city: true,
            state: true,
            menuItems: {
                where: { active: true },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    priceCents: true,
                },
                orderBy: { name: "asc" }
            },
        },
    });

    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
});

export default router;