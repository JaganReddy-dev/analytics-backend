import resolveLocation from "../services/locationService.js";
import getSessionLocation from "../utils/getSessionLocation.js";
import getIp from "../utils/getIp.js";

const sessionLocation = async (req, res, next) => {
  try {
    const sessionId = req.body.sessionId;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const cachedLocation = await getSessionLocation(sessionId);

    if (cachedLocation) {
      req.location = cachedLocation;
      return next();
    }

    let clientIp = getIp(req);

    req.location = await resolveLocation({
      lat: req.body.location?.lat || req.body.lat || null,
      lon: req.body.location?.lon || req.body.lon || null,
      ip: clientIp,
      sessionId,
    });

    next();
  } catch (error) {
    console.error("Error in sessionLocation middleware:", error);
    req.location = null;
    next();
  }
};

export default sessionLocation;
