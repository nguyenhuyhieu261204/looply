import dotenv from "dotenv";
dotenv.config();

import "#config/database";
import "#config/redis";
import "#config/passport";

import http from "http";
import app from "./app.js";
import { env, closePGConnection, closeRedisConnection } from "#config";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

const shutdown = () => {
  server.close(async () => {
    console.log("Closing server...");
    await closePGConnection();
    await closeRedisConnection();
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
