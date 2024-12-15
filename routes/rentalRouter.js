import { Router } from "express";
import { Firestore } from "@google-cloud/firestore";
import { SOURCES } from "../constants.js";

const rentalRouter = Router();
const db = new Firestore();

const formatPrice = (price) => {
  if (!price) return null;
  return parseInt(price.replace(/[$,]/g, ""), 10) || 0;
};

rentalRouter.get("/:source", async (req, res) => {
  try {
    const { source } = req.params;
    const snapshot = await db
      .collection("rental_listings")
      .doc(source)
      .collection("listings")
      .get();

    const listings = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      listings.push({
        id: doc.id,
        ...data,
        price: formatPrice(data.price),
      });
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rentalRouter.get("/", async (req, res) => {
  try {
    const sourcesSnapshot = await db
      .collection("rental_listings")
      .listDocuments();
    const allListings = {};

    await Promise.all(
      sourcesSnapshot.map(async (sourceDoc) => {
        const source = sourceDoc.id;
        const listingsSnapshot = await sourceDoc.collection("listings").get();

        allListings[source] = [];

        listingsSnapshot.forEach((doc) => {
          const data = doc.data();
          allListings[source].push({
            id: doc.id,
            ...data,
            price: formatPrice(data.price),
          });
        });
      })
    );

    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default rentalRouter;
