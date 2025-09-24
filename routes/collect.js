const express = require("express");
const { PrismaClient } = require("@prisma/client");
const eventSchema = require("../schemas/event");
const visitorSchema = require("../schemas/visitor");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", (req, res) =>
  res.status(200).send({
    message: "This route works!",
  })
);

router.post("/event", async (req, res) => {
  try {
    const event = eventSchema.parse(req.body);

    const saveEvent = await prisma.event.create({
      data: {
        type: event.type,
        website: req.headers.host,
      },
    });

    res.send(saveEvent);
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ error: err.errors });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/visitor", async (req, res) => {
  try {
    const visitor = visitorSchema.parse(req.body);

    const saveVisitor = await prisma.visitor.create({
      data: {
        ...visitor,
      },
    });

    res.send(saveVisitor);
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ error: err.errors });
    }
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

/**
 * {
    "type": "visitor",
    "url":"localhost:4000",
    "device": "Mobile",
    "userAgent": "Brave",
    "referrer": "none",
    "screenWidth": "1080",
    "screenHeight": "1920"
}
 */
