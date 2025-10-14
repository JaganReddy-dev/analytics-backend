import * as z from "zod";

const PageViewSchema = z.object({
  sessionId: z.uuid().meta({
    description: "sessionId",
    example: "09f85c76-3118-41dc-8ab7-bba81b31d8b8",
  }),
  userId: z.uuid().meta({
    description: "userId",
    example: "04350e85-8a82-42a3-a089-6045bf981e0c",
  }),
  location: z
    .object({
      lat: z.coerce.string(),
      lon: z.coerce.string(),
      accuracy: z.number().optional(),
    })
    .meta({
      description: "User Location",
      example: {
        lat: "40.683398975018505",
        lon: "-73.8857775071778",
        accuracy: "20",
      }.nullable,
    }),
  url: z.url().meta({
    description: "URL",
    example: "https://example.com/home",
  }),
});

export default PageViewSchema;
