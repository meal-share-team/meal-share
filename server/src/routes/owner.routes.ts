import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.use(requireAuth, requireRole(["OWNER", "ADMIN"]));

router.get("/dashboard", async (req: any, res: any) => {
    const user = (req as any).user;
    const restaurants = await prisma.restaurant.findMany({
        where: { ownerUserId: user.id },
        select: {
            id: true,
            name: true,
            claimed: true,
            _count: { select: { menuItems: true, combos: true } },
        }
    });
    res.json(restaurants);
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

