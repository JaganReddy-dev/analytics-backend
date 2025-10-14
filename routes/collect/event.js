import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { ZodError } from "zod";
import EventSchema from "../../schemas/eventSchema.js";

const router = express.Router();
const prisma = new PrismaClient();
router.post("/", async (req, res) => {
  try {
    const validatedEvent = EventSchema.parse(req.body);
    const savedEvent = await prisma.event.create({
      data: {
        sessionId: validatedEvent.sessionId,
        userId: validatedEvent.userId,
        type: validatedEvent.type,
        action: validatedEvent.action,
        website: validatedEvent.website,
        metadata: validatedEvent.metadata || {},
      },
    });

    res.status(201).json({ message: "Event saved!", event: savedEvent.id });
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
    console.error("Unexpected error:", err);
    return res.status(500).json({
      error: "An unexpected error occurred",
      message: err.message || "Unknown error",
    });
  }
});

export default router;
