import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { errorMiddleware } from "@saas2024-23/common";
import { viewOpenProblemRouter } from "./routes/view";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/problems", viewOpenProblemRouter);

app.use(errorMiddleware);

export default app;
