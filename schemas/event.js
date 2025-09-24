const { z } = require("zod");

const event = z.object({
  type: z.string(),
});

module.exports = event;
