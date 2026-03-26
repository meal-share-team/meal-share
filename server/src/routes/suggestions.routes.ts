import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req: any, res: any) => {
    const suggestions = await prisma.restaurantSuggestion.findMany({
        where: { status: "OPEN" },
        select: {
            id: true,
            name: true,
            city: true,
            state: true,
            _count: { select: { votes: true } },
        },
        orderBy: { votes: { _count: "desc" } }
    });

    res.json(
        suggestions.map((s: any) => ({
            id: s.id,
            name: s.name,
            city: s.city,
            state: s.state,
            voteCount: s._count.votes,
        }))
    );
});

router.post("/", async (req: any, res: any) => {
    const { name, city, state, websiteUrl } = req.body;

    const created = await prisma.restaurantSuggestion.create({
        data: { name, city, state, websiteUrl }
    });

    res.status(201).json(created);
});

export default router;