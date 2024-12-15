import { Router } from "express";
import { Firestore } from "@google-cloud/firestore";
import { SOURCES } from "../constants.js";

const rentalRouter = Router();
const db = new Firestore();

rentalRouter.get("/:source", async (req, res) => {
  try {
    const { source } = req.params;
    const snapshot = await db
      .collection("rental_listings")
      .where("source", "==", source)
      .get();

    res.json(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rentalRouter.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("rental_listings").get();

    const allListings = {
      [SOURCES.CRAIGSLIST]: [],
      [SOURCES.VANPEOPLE]: [],
      [SOURCES.KIJIJI]: [],
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const source = data.source;

      if (source in allListings) {
        allListings[source].push({
          id: doc.id,
          ...data,
        });
      }
    });

    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default rentalRouter;
