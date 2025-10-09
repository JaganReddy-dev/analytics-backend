import * as z from "zod";
import { createDocument } from "zod-openapi";
import EventSchema from "../schemas/eventSchema.js";
import VisitorSchema from "../schemas/visitorSchema.js";
import VisitorResponse from "../schemas/visitorResSchema.js";
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
                schema: "",
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
    "/collect/pageview": {
      post: {
        requestBody: {
          content: { "application/json": { schema: PageViewSchema } },
        },
        responses: {
          200: {
            description: "Page view saved successfully!",
            content: { "application/json": { schema: "" } },
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
