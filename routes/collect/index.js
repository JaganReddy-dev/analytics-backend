import express from "express";
import eventRoutes from "./event.js";
import visitorRoutes from "./visitor.js";
import pageviewRoutes from "./pageview.js";

const router = express.Router();

router.get("/", (req, res) =>
  res.status(200).json({ message: "This route works!" })
);

// Mount sub-routes
router.use("/event", eventRoutes);
router.use("/visitor", visitorRoutes);
router.use("/pageview", pageviewRoutes);

export default router;
