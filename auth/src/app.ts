import cors from "cors";
import "dotenv/config";
import express from "express";
import { errorMiddleware } from "@saas2024-23/common";
import { authRouter } from "./routes/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use(errorMiddleware);

export default app;
