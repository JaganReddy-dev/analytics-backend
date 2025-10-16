import cacheSessionLocation from "../utils/cacheSessionLocation.js";

const resolveLocation = async ({ lat = null, lon = null, ip, sessionId }) => {
  let locationData = null;

  try {
    // Try geolocation API if lat/lon provided
    if (lat && lon) {
      const geoURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(geoURL);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        locationData = {
          lat: lat.toString(),
          lon: lon.toString(),
          location: data.results[0].formatted_address,
          source: "geolocation",
          sessionId: sessionId,
        };

        // Cache and return early
        await cacheSessionLocation(sessionId, locationData);
        return locationData;
      }
    }

    // Fallback to IP-based geolocation
    if (!ip) {
      console.warn("No IP address provided for geolocation");
      locationData = {
        lat: null,
        lon: null,
        location: null,
        source: "unknown",
        sessionId,
      };
      return locationData; // Don't cache null data
    }

    // Skip IP lookup for localhost/private IPs
    if (
      ip === "127.0.0.1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.")
    ) {
      locationData = {
        lat: null,
        lon: null,
        location: "Local Network",
        source: "local-ip",
        sessionId,
      };
      return locationData; // Don't cache local IPs
    }

    const ipAPI = `https://ipapi.co/${ip}/json/`;
    const ipResponse = await fetch(ipAPI);
    const ipData = await ipResponse.json();

    // ipapi.co returns 'error' field when there's an issue
    if (ipData.error) {
      console.error("IP geolocation error:", ipData.reason || ipData.error);
      locationData = {
        lat: null,
        lon: null,
        location: null,
        source: "ip-error",
        sessionId,
      };
      return locationData; // Don't cache errors
    }

    locationData = {
      lat: ipData.latitude?.toString() || null,
      lon: ipData.longitude?.toString() || null,
      location: `${ipData.city}, ${ipData.region}, ${ipData.country_name}`,
      source: "ip",
      sessionId: sessionId,
    };
  } catch (err) {
    console.error("Location resolution failed:", err);
    locationData = {
      lat: null,
      lon: null,
      location: null,
      source: "error",
      sessionId,
    };
    return locationData; // Don't cache errors
  }

  // Cache valid location data before returning
  if (
    locationData &&
    locationData.lat &&
    locationData.lon &&
    locationData.location
  ) {
    await cacheSessionLocation(sessionId, locationData);
  }

  return locationData;
};

export default resolveLocation;
