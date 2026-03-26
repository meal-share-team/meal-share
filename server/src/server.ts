import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
     res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});