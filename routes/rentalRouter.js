import { Router } from "express";
import { Firestore } from "@google-cloud/firestore";
import { SOURCES } from "../constants.js";

const rentalRouter = Router();
const db = new Firestore();

rentalRouter.get("/", async (req, res) => {
  try {
    const {
      locations,
      sources,
      minPrice,
      maxPrice,
      page = 1,
      limit = 40,
    } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    let query = db.collection("rental_listings");

    if (locations) {
      const locationArray = Array.isArray(locations) ? locations : [locations];
      query = query.where("location", "in", locationArray);
    }

    if (sources) {
      const sourceArray = Array.isArray(sources) ? sources : [sources];
      query = query.where("source", "in", sourceArray);
    }

    if (minPrice) {
      query = query.where("price", ">=", parseInt(minPrice));
    }

    if (maxPrice) {
      query = query.where("price", "<=", parseInt(maxPrice));
    }

    query = query.offset(offset).limit(limitNumber).orderBy("price", "asc");

    const snapshot = await query.get();
    const listings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(listings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default rentalRouter;
