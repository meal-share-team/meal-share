import "dotenv/config";
import express from "express";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants.routes.js";
import suggestionRoutes from "./routes/suggestions.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import itemRoutes from "./routes/items.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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