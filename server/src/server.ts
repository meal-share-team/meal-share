import "dotenv/config";
import express from "express";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants.routes.js";
import suggestionRoutes from "./routes/suggestions.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import itemRoutes from "./routes/items.routes.js";

const app = express();

const allowedOrigins = new Set([process.env.CLIENT_URL].filter(Boolean));

function isAllowedLocalOrigin(origin: string) {
    return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin) || isAllowedLocalOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
     res.json({ ok: true });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/menu-items", itemRoutes);

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
