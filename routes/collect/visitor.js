import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import visitorSchema from "../../schemas/visitor.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const visitor = visitorSchema.strip().parse(req.body);
    const getDeviceType = (ua) => {
      return /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
    };
    const getBrowser = (ua) => {
      return ua.match(/(Firefox|Chrome|Safari|Edg)/)?.[0] || "Other";
    };

    const getOS = (ua) => {
      return ua.match(/(Windows|MacOS|Linux|Android|iOS)/)?.[0] || "Other";
    };

    const normalizedVisitor = {
      url: visitor.url.trim().toLowerCase(),
      browser: getBrowser(visitor.userAgent),
      os: getOS(visitor.userAgent),
      device: getDeviceType(visitor.userAgent),
      referrer: visitor.referrer || "direct",
      screenWidth: visitor.screenWidth,
      screenHeight: visitor.screenHeight,
      referrer: visitor?.referrer || "direct",
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
