require("dotenv").config();
const express = require("express");

const app = express();
const collectRouter = require("./routes/collect");
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static("public"));

app.use("/collect", collectRouter);

app.get("/", (req, res) => res.status(200).send("It is alive!"));

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`));
