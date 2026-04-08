import "dotenv/config";
import express from "express";
import cors from "cors";
import restaurantRoutes from "./routes/restaurants.routes.js";
import suggestionRoutes from "./routes/suggestions.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import itemRoutes from "./routes/items.routes.js";

const app = express();

// 1. Log EVERYTHING immediately
app.use((req, _res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
     console.log("Health check hit!");
     res.json({ ok: true });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/menu-items", itemRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ message: "Global server error", error: String(err) });
});

const port = Number(process.env.PORT ?? 4000);

const server = app.listen(port, () => {
    console.log(`🚀 API server started on http://localhost:${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
