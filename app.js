import express from "express";
import cors from "cors";
import rentRouter from "./routes/rentalRouter.js";
const app = express();

app.use(cors());

app.use("/rentalListings", rentRouter);

export default app;
