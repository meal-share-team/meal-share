import "dotenv/config";
import express from "express";
import cors from "cors";
import restaurantsRouter from "./routes/restaurants.routes.js";
import suggestionsRouter from "./routes/suggestions.routes.js";
import ownerRouter from "./routes/owner.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
// Mount API routers
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/suggestions", suggestionsRouter);
app.use("/api/owner", ownerRouter);

app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});