import redisClient from "../config/redis.js";

const getSessionLocation = async (sessionId) => {
  try {
    const locationData = await redisClient.hGetAll(`session:${sessionId}`);

    if (!locationData || Object.keys(locationData).length === 0) {
      return null;
    }

    const { location, lat, lon, source } = locationData;
    return { location, lat, lon, source };
  } catch (error) {
    console.error("Error fetching session location from cache:", error);
    return null;
  }
};

export default getSessionLocation;
