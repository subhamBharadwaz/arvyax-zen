import dotEnv from "dotenv";
dotEnv.config();

import app from "./app";
import { connectToDB } from "./utils";
import { disconnectFromDatabase } from "./utils/db";
import env from "./env";
import { logger } from "./middlewares";

connectToDB();

const PORT = env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    server.close();

    // Disconnect from the database
    await disconnectFromDatabase();

    logger.info("Goodbye, got signal", signal);
    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
