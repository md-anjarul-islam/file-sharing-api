import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import multer from "multer";

import { uploadFile } from "./services/uploadFile.js";
import { deleteFile } from "./services/deleteFile.js";
import { downloadFile } from "./services/downloadFile.js";
import { uploadLimiter } from "./middlewares/uploadLimiter.js";
import { downloadLimiter } from "./middlewares/downloadLimiter.js";
import { serverConfig } from "./config/index.js";
import { startCleanupJob } from "./schedulers/cleanupJob.js";

const swaggerDocument = YAML.load(path.join("./", "swagger.yaml"));

const upload = multer();
const app = express();

app.post("/files", uploadLimiter, upload.single("file"), uploadFile);
app.get("/files/:publicKey", downloadLimiter, downloadFile);
app.delete("/files/:privateKey", deleteFile);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the cron job
startCleanupJob();

// Start the server
app.listen(serverConfig.port, () => {
  console.log(`Server is running on port ${serverConfig.port}`);
});
