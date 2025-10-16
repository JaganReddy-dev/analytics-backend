import redisClient from "../config/redis.js";

const cacheSessionLocation = async (sessionId, data) => {
  try {
    if (!sessionId || !data) {
      console.warn("Missing sessionId or data for caching");
      return null;
    }

    const { location, lat, lon, source } = data;

    // Validate we have complete data
    if (!location || !lat || !lon) {
      console.warn("Incomplete location data, skipping cache");
      return null;
    }

    // Store in Redis
    await redisClient.hSet(`session:${sessionId}`, {
      location,
      lat: lat.toString(),
      lon: lon.toString(),
      source: source || "unknown",
    });

    // Set expiration to 24 hours
    await redisClient.expire(`session:${sessionId}`, 60 * 60 * 24);

    return { location, lat, lon, source };
  } catch (error) {
    console.error("Error caching session location:", error);
    return null;
  }
};

export default cacheSessionLocation;
