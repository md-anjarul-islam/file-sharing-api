import dotenv from "dotenv";
dotenv.config();

export const serverConfig = {
  port: Number(process.env.PORT ?? 3000),
};

export const rateLimiterConfig = {
  dailyDownloadLimit: Number(process.env.DAILY_DOWNLOAD_LIMIT ?? 100), // Default: 100 MB
  dailyUploadLimit: Number(process.env.DAILY_UPLOAD_LIMIT ?? 100), // Default: 100 MB
};

export const fileConfig = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY ?? "secret",
  inactiveDaysForCleanUp: Number(process.env.INACTIVE_DAYS_FOR_CLEAN_UP ?? 1), // Default: 1 day
};

// The type of storage and that storage specific configuration
export const storageConfig = {
  storageType: process.env.STORAGE_TYPE ?? "local",
  config: {
    rootFolder: process.env.FOLDER ?? "./uploads",
  },
};
