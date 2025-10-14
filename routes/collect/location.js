import resolveLocation from "../../services/locationService.js";
import redisClient from "../../utils/redisClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { lat, lon, sessionId, ip } = req.body;

    const locationData = await resolveLocation({ lat, lon, ip });
    res.status(200).json({ location: locationData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to resolve location" });
  }
});

export default router;
