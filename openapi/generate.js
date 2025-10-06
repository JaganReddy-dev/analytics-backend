import * as z from "zod";
import { createDocument } from "zod-openapi";
import EventSchema from "../schemas/event.js";
import VisitorSchema from "../schemas/visitor.js";
import VisitorResponse from "../schemas/visitorRes.js";

const openApiSpec = createDocument({
  openapi: "3.1.0",
  info: { title: "My Analytics API", version: "1.0.0" },
  paths: {
    "/collect/event": {
      post: {
        requestParams: {},
        requestBody: {
          content: { "application/json": { schema: EventSchema } },
        },
        responses: {
          200: {
            description: "Event saved successfully!",
            content: {
              "application/json": {
                schema: VisitorResponse,
              },
            },
          },
          400: {
            description: "Validation failed",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/collect/visitor": {
      post: {
        requestBody: {
          content: { "application/json": { schema: VisitorSchema } },
        },
        responses: {
          200: {
            description: "Visitor saved successfully!",
            content: { "application/json": { schema: VisitorResponse } },
          },
          400: {
            description: "Validation failed",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
});

export default openApiSpec;
