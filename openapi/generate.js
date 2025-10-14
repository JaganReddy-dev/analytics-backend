import * as z from "zod";
import { createDocument } from "zod-openapi";
import EventSchema from "../schemas/eventSchema.js";
import VisitorSchema from "../schemas/visitorSchema.js";
import PageViewSchema from "../schemas/pageViewSchema.js";

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
                schema: z.object({
                  message: z.string().meta({
                    description: "message",
                    example: "Event saved",
                  }),
                  pageViewId: z.string().meta({
                    description: "eventid",
                    example: "12345",
                  }),
                }),
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
            content: {
              "application/json": {
                schema: z.object({
                  message: z.string().meta({
                    description: "message",
                    example: "Visitor saved successfully!",
                  }),
                  pageViewId: z.string().meta({
                    description: "visitorId",
                    example: "12345",
                  }),
                }),
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
    "/collect/pageview": {
      post: {
        requestBody: {
          content: { "application/json": { schema: PageViewSchema } },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: z.object({
                  message: z.string().meta({
                    description: "message",
                    example: "Page view saved!",
                  }),
                  pageViewId: z.string().meta({
                    description: "pageViewId",
                    example: "12345",
                  }),
                }),
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
  },
});

export default openApiSpec;
