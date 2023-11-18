import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Express = express();

app.use(express.json());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.static("public"));

export default app;
