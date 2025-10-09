import * as z from "zod";

const PageViewSchema = z.object({
  sessionId: z.string().meta({
    description: "Session ID",
    example: "abc123",
  }),
  userId: z.string().meta({
    description: "User ID",
    example: "123",
  }),
  url: z.url().meta({
    description: "URL",
    example: "https://example.com/home",
  }),
  userLocation: z.record(z.string(), z.string()).meta({
    description: "User Location",
    example: {
      lat: "40.683398975018505",
      lon: "-73.8857775071778",
    },
  }),
});

export default PageViewSchema;
