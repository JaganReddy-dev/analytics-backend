import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PageViewSchema from "../../schemas/pageViewSchema.js";
import { ZodError } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const ValidPageView = PageViewSchema.parse(req.body);
    let location;
    let lat, lon;
    if (ValidPageView.location?.lat && ValidPageView.location?.lon) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ValidPageView.location.lat},${ValidPageView.location.lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const geoResponse = await fetch(url);
      const data = await geoResponse.json();
      if (data.status === "OK" && data.results.length > 0) {
        location = data.results[0].formatted_address;
        lat = ValidPageView.location?.lat;
        lon = ValidPageView.location?.lon;
      } else {
        location = null;
        lat = null;
        lon = null;
      }
    }

    const savedPageView = await prisma.pageView.create({
      data: {
        sessionId: ValidPageView.sessionId,
        userId: ValidPageView.userId,
        url: ValidPageView.url,
        lat: lat,
        lon: lon,
        location: location,
      },
    });
    res
      .status(201)
      .json({ message: "Page view saved!", pageViewId: savedPageView.id });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Database operation failed",
        code: err.code,
      });
    }
  }
});

export default router;
