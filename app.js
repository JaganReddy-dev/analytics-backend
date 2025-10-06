import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import collectRouter from "./routes/collect/index.js";
import openApiSpec from "./openapi/generate.js";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 3000;
const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/collect", collectRouter);
app.get("/", (req, res) => res.status(200).send("It is alive!"));

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));
