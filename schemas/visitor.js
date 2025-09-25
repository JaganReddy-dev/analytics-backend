const { z } = require("zod");

const visitor = z.object({
  url: z.url(),
  device: z.string(),
  userAgent: z.string(),
  referrer: z.string(),
  screenWidth: z.number(),
  screenHeight: z.number(),
});

module.exports = visitor;
