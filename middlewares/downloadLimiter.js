import path from "path";
import { rateLimiterConfig, storageConfig } from "../config/index.js";
import { StorageFactory } from "../utils/storageFactory.js";

/**
 * @description Stores the download stats for each ip adddress
 * @type { {[key: string]: { totalDownloaded: number, lastDownloadedDate: Date } }}
 */
const downloadStats = {}; //Stores the download stats for each ip adddress
const ONE_MB_IN_BYTE = 1024 * 1024;
const storage = StorageFactory.createStorage();

export async function downloadLimiter(req, res, next) {
  try {
    const publicKey = req.params.publicKey;
    const filePath = path.join(storageConfig.config.rootFolder, publicKey);

    const fileSize = (await storage.fileSize(filePath)) / ONE_MB_IN_BYTE;
    const userIP = req.ip;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize if doesn't exist or Reset if the date changed
    if (
      !downloadStats[userIP] ||
      downloadStats[userIP]?.lastDownloadedDate?.getTime() !== today.getTime()
    ) {
      downloadStats[userIP] = {
        lastDownloadedDate: today,
        totalDownloaded: 0,
      };
    }

    // Check the upload limit
    if (
      downloadStats[userIP].totalDownloaded + fileSize >
      rateLimiterConfig.dailyDownloadLimit
    ) {
      return res.status(429).json({ message: "Daily download limit exceeded" });
    }

    // Update the download size and the last access time for the ip
    downloadStats[userIP].totalDownloaded += fileSize / ONE_MB_IN_BYTE; // add the file size (in MB)
    downloadStats[userIP].lastDownloadedDate = today;

    next();
  } catch (err) {
    res.status(400).json({ message: "File not found" });
  }
}
