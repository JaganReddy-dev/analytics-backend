import * as z from "zod";

const VisitorSchema = z
  .object({
    sessionId: z.uuid().meta({
      description: "sessionId",
      example: "09f85c76-3118-41dc-8ab7-bba81b31d8b8",
    }),
    userId: z.uuid().meta({
      description: "userId",
      example: "04350e85-8a82-42a3-a089-6045bf981e0c",
    }),
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
    location: z
      .object({
        lat: z.coerce.string(),
        lon: z.coerce.string(),
        accuracy: z.number().optional(),
      })
      .nullable()
      .meta({
        description: "Geolocation coordinates",
        example: { lat: 42.123456, lon: -93.123456, accuracy: 10 },
      })
      .optional(),
    isBrave: z.boolean().meta({
      description: "is Brave",
      example: true,
    }),
  })
  .meta({
    id: "Visitor",
    description: "Visitor object",
  });

export default VisitorSchema;
