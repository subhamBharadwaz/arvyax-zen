import mongoose from "mongoose";
import { logger } from "./index";

const connectToDB = () => {
  const dbUrl = process.env.DBURL as string;
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
