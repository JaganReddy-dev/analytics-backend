import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Too many Redis connection retries, giving up");
        return new Error("Too many retries");
      }
      // Exponential backoff: 50ms, 100ms, 200ms, etc.
      return Math.min(retries * 50, 3000);
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("✓ Redis client connected");
});

redisClient.on("reconnecting", () => {
  console.log("⟳ Redis client reconnecting...");
});

redisClient.on("ready", () => {
  console.log("✓ Redis client ready");
});

try {
  await redisClient.connect();
} catch (err) {
  console.error("Failed to connect to Redis:", err);
  process.exit(1);
}

export default redisClient;
