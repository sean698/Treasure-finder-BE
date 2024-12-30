import express from "express";
import cors from "cors";
import rentRouter from "./routes/rentalRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/rentalListings", rentRouter);
app.use("/feedback", feedbackRouter);

export default app;
