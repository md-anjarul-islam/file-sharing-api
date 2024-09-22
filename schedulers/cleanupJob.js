import cron from "node-cron";
import { StorageFactory } from "../utils/storageFactory.js";

// Schedule the cleanup job to run once a day (at midnight)
export function startCleanupJob() {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("STARTED: Cleanup process started at:", new Date());
      await StorageFactory.createStorage().cleanup();
      console.log("COMPLETED: Cleanup process successfully:", new Date());
    } catch (error) {
      console.error("ERROR: Cleanup process", error);
    }
  });
}
