import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import httpStatus from "http-status";
import { env } from "#config";

const app = express();

app.use(env.NODE_ENV === "production" ? morgan("combined") : morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  return res.status(httpStatus.OK).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

export default app;
