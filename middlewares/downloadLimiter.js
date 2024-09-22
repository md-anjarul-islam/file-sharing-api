import { existsSync, statSync } from "fs";
import path from "path";
import { fileConfig, rateLimiterConfig } from "../config/index.js";

/**
 * @description Stores the download stats for each ip adddress
 * @type { {[key: string]: { totalDownloaded: number, lastDownloadedDate: Date } }}
 */
const downloadStats = {}; //Stores the download stats for each ip adddress
const ONE_MB_IN_BYTE = 1024 * 1024;

export function downloadLimiter(req, res, next) {
  const publicKey = req.params.publicKey;
  const filePath = path.join(fileConfig.storageRootFolder, publicKey);

  if (!existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const fileSize = getFileSize(filePath) / ONE_MB_IN_BYTE;
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
}

export function getFileSize(filePath) {
  if (!existsSync(filePath)) {
    return -1;
  }

  return statSync(filePath).size;
}
