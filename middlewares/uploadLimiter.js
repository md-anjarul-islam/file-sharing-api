import { rateLimiterConfig } from "../config/index.js";

/**
 * @description Stores the upload stats for each ip adddress
 * @type { {[key: string]: { totalUploaded: number, lastUploadedDate: Date } }}
 *
 * */
const uploadStats = {}; //Stores the upload stats for each ip adddress
const ONE_MB_IN_BYTE = 1024 * 1024;

export function uploadLimiter(req, res, next) {
  const userIP = req.ip;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initialize if doesn't exist or Reset if the date changed
  if (
    !uploadStats[userIP] ||
    uploadStats[userIP]?.lastUploadedDate?.getTime() !== today.getTime()
  ) {
    uploadStats[userIP] = { lastUploadedDate: today, totalUploaded: 0 };
  }

  const newFileSize =
    parseInt(req.headers["content-length"], 10) / ONE_MB_IN_BYTE;

  // Check the upload limit
  if (
    uploadStats[userIP].totalUploaded + newFileSize >
    rateLimiterConfig.dailyUploadLimit
  ) {
    return res.status(429).json({ message: "Daily upload limit exceeded" });
  }

  // Update the upload size and last access time for the ip
  uploadStats[userIP].totalUploaded +=
    parseInt(newFileSize, 10) / ONE_MB_IN_BYTE; // add the file size (in MB)
  uploadStats[userIP].lastUploadedDate = today;

  next();
}
