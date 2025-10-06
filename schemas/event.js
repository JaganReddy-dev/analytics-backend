import * as z from "zod";

const EventSchema = z
  .object({
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
    id: "Event", // <-- Add this ID to register the schema
    description: "An event object",
  });
export default EventSchema;
