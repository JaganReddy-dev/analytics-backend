import * as z from "zod";

const url = z.url().meta({
  description: "Visited URL",
  example: "https://example.com",
  id: "url",
});
const device = z
  .string()
  .meta({ description: "device", example: "Mobile", id: "device" });
const os = z
  .string()
  .meta({ description: "OS", example: "iOS 16.5", id: "os" });
const browser = z.string().meta({
  description: "Browser",
  example: "Mozilla/5.0",
  id: "browser",
});
const referrer = z
  .string()
  .meta({ description: "Referrer URL", id: "referrer" })
  .optional();
const screenWidth = z
  .number()
  .meta({ description: "Screen Width", example: 1920, id: "screenWidth" });
const screenHeight = z
  .number()
  .meta({ description: "Screen Height", example: 1080, id: "screenHeight" });

const VisitorResponse = z.object({
  url,
  device,
  os,
  browser,
  referrer,
  screenWidth,
  screenHeight,
});

export default VisitorResponse;
