import mongoose from "mongoose";
import { logger } from "../middlewares";
import env from "../env";

const connectToDB = () => {
  const dbUrl = env.DATABASE_URL;
  mongoose
    .connect(dbUrl)
    .then(() => logger.info(`✅ DB Connected`))
    .catch((err) => {
      logger.error(`❌ DB Connection Issue: ${err}`);
      process.exit(1);
    });
};

export default connectToDB;

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
  logger.info("Disconnected from database");
  return;
}
