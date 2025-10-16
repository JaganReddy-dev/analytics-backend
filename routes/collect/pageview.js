import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import PageViewSchema from "../../schemas/pageViewSchema.js";
import { ZodError } from "zod";
import sessionLocation from "../../middleware/sessionLocation.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", sessionLocation, async (req, res) => {
  try {
    const ValidPageView = PageViewSchema.parse(req.body);
    let locationData = req.location || { lat: null, lon: null, location: null };
    const savedPageView = await prisma.pageView.create({
      data: {
        sessionId: ValidPageView.sessionId,
        userId: ValidPageView.userId,
        url: ValidPageView.url,
        lat: locationData.lat,
        lon: locationData.lon,
        location: locationData.location,
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
    console.error("Unexpected error in /pageview:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
