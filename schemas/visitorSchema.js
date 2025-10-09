import * as z from "zod";

const VisitorSchema = z
  .object({
    url: z
      .url()
      .meta({ description: "Visited URL", example: "https://example.com" }),
    userAgent: z.string().meta({
      description: "UserAgent",
      example:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    }),
    referrer: z.string().meta({ description: "Referrer URL" }).optional(),
    screenWidth: z
      .number()
      .meta({ description: "Screen Width", example: 1920 }),
    screenHeight: z
      .number()
      .meta({ description: "Screen Height", example: 1080 }),
    isBrave: z.boolean().meta({
      description: "is Brave",
      example: "yes",
    }),
  })
  .meta({
    id: "Visitor",
    description: "Visitor object",
  });

export default VisitorSchema;
