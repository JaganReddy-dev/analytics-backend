import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import visitorSchema from "../../schemas/visitorSchema.js";
import getSessionLocation from "../../utils/getSessionLocation.js";
import sessionLocation from "../../middleware/sessionLocation.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", sessionLocation, async (req, res) => {
  try {
    const visitor = visitorSchema.strip().parse(req.body);
    const getDeviceType = (ua) => {
      return /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
    };
    const getBrowser = (ua, brave) => {
      const isBrave = !!brave;
      if (isBrave) return "Brave";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Edg")) return "Edge";
      if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Safari")) return "Safari";
      return "Other";
    };

    const getOS = (ua) => {
      return ua.match(/(Windows|Mac OS|Linux|Android|iOS)/)?.[0] || "Other";
    };

    let locationData = req.location || { lat: null, lon: null, location: null };

    const normalizedVisitor = {
      sessionId: visitor.sessionId,
      userId: visitor.userId,
      url: visitor.url.trim().toLowerCase(),
      browser: getBrowser(visitor.userAgent, visitor.isBrave),
      os: getOS(visitor.userAgent),
      device: getDeviceType(visitor.userAgent),
      referrer: visitor.referrer || "direct",
      screenWidth: visitor.screenWidth,
      screenHeight: visitor.screenHeight,
      referrer: visitor?.referrer || "direct",
      lat: locationData.lat || "",
      lon: locationData.lon || "",
    };

    const savedVisitor = await prisma.visitor.create({
      data: normalizedVisitor,
    });

    res.status(201).json({
      message: "Visitor saved successfully",
      visitorId: savedVisitor.id,
    });
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

    console.error("Unexpected error in /visitor:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
