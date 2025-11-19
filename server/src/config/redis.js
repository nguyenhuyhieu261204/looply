import Redis from "ioredis";
import { env } from "./environment.js";

const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅Redis connected successfully.");
});

redis.on("ready", () => {
  console.log("✅Redis is ready to use.");
});

redis.on("error", (err) => {
  console.error("❌Redis connection error:", err);
});

redis.on("close", () => {
  console.log("❌Redis connection closed.");
});

redis.on("reconnecting", () => {
  console.log("🔄Redis is reconnecting...");
});

const closeRedisConnection = async () => {
  try {
    await redis.quit();
    console.log("✅Redis connection has been closed successfully.");
  } catch (error) {
    console.error("❌Unable to close the Redis connection:", error);
  }
};

export { redis, closeRedisConnection };
export default redis;
