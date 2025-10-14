import * as z from "zod";

const EventSchema = z
  .object({
    sessionId: z.uuid().meta({
      description: "sessionId",
      example: "09f85c76-3118-41dc-8ab7-bba81b31d8b8",
    }),
    userId: z.uuid().meta({
      description: "userId",
      example: "04350e85-8a82-42a3-a089-6045bf981e0c",
    }),
    type: z.string().meta({
      description: "The type of the event",
      example: "click",
      id: "eventType",
    }),
    action: z
      .string()
      .meta({ description: "Action performed", example: "submit" }),
    website: z
      .string()
      .meta({ description: "Website URL", example: "example.com" }),
    metadata: z
      .record(z.unknown(), z.unknown())
      .meta({ description: "Additional metadata" })
      .optional(),
  })
  .meta({
    id: "Event",
    description: "An event object",
  });
export default EventSchema;
