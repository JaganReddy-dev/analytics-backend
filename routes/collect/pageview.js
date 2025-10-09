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
    if (ValidPageView.lat && ValidPageView.lon) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ValidPageView.lat},${ValidPageView.lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        location = data.results[0].formatted_address;
      } else {
        location = null;
      }
    }

    const savedPageView = await prisma.pageView.create({
      data: {
        sessionId: ValidPageView.sessionId,
        userId: ValidPageView.userId,
        url: ValidPageView.url,
        lat: ValidPageView?.lat,
        lon: ValidPageView?.lon,
        location: location,
      },
    });
    res
      .status(200)
      .json({ message: "Page view saved!", pageView: savedPageView.id });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
