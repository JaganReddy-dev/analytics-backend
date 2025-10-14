import fetch from "node-fetch";

const resolveLocation = async ({ lat, lon, ip }) => {
  try {
    if (lat !== "" && lon !== "") {
      const geoURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(geoURL);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return {
          lat,
          lon,
          address: data.results[0].formatted_address,
          source: "geolocation",
        };
      }
    }

    const ipAPI = `https://ipapi.co/${ip}/json/`;
    const ipResponse = await fetch(ipAPI);
    const ipData = await ipResponse.json();

    return {
      lat: ipData.latitude,
      lon: ipData.longitude,
      address: `${ipData.city}, ${ipData.region}, ${ipData.country_name}`,
      source: "ip",
    };
  } catch (err) {
    console.error("Location resolution failed:", err);
    return { lat: null, lon: null, address: null, source: "unknown" };
  }
};

export const cacheSessionLocation = async (sessionId, location) => {
  await redisClient.set(
    `session:${sessionId}:location`,
    JSON.stringify(location),
    {
      EX: 60 * 60 * 24,
    }
  );
};

export const getSessionLocation = async (sessionId) => {
  const data = await redisClient.get(`session:${sessionId}:location`);
  return data ? JSON.parse(data) : null;
};

export default resolveLocation;
