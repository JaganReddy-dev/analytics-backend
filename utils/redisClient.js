import { createClient } from "redis";

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = createClient(REDIS_PORT);

redisClient.on("error", (err) => console.log("Redis Client Error", err));

await redisClient.connect();

export default redisClient;
