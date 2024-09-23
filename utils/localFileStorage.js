import fs, { createWriteStream, existsSync } from "fs";
import path from "path";
import { mkdir, stat } from "fs/promises";
import { BaseFileStorage } from "./baseStorage.js";
import { fileConfig } from "../config/index.js";

/** Local file system to manage files */
export class LocalFileStorage extends BaseFileStorage {
  /** @param {{rootFolder: string}} localStorageConfig */

  constructor(localStorageConfig) {
    super();
    this.config = localStorageConfig;
  }

  // Write file to local folder
  async upload(fileBuffer, publicKey) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create folder if does not exist
        const folderStat = existsSync(this.config.rootFolder);
        if (!folderStat) {
          await mkdir(this.config.rootFolder);
        }
        const filePath = path.join(this.config.rootFolder, publicKey);
        const writeStream = createWriteStream(filePath);
        writeStream.write(fileBuffer, (err) => {
          if (!err) {
            return resolve(true);
          }

          throw new Error(err);
        });
      } catch (error) {
        console.error("Error uploading file to storage", error);
        reject(error);
      }
    });
  }

  async fileSize(filePath) {
    if (!existsSync(filePath)) {
      throw new Error("File not exist");
    }

    return (await stat(filePath)).size;
  }

  // Download implementation
  async download(fileKey) {
    const filePath = path.join(this.config.rootFolder, fileKey);
    if (!(await stat(filePath))) {
      throw new Error("File not found");
    }
    return fs.createReadStream(filePath); // Stream the file
  }

  // Delete implementation
  async delete(fileKey) {
    const filePath = path.join(this.config.rootFolder, fileKey);
    if (!(await stat(filePath))) {
      throw new Error("File not found");
    }

    await fs.promises.unlink(filePath);

    return { message: "File deleted successfully" };
  }

  // Cleanup inactive files
  async cleanup() {
    // Read all the files from the storage folder
    const files = await fs.promises.readdir(this.config.rootFolder);
    const now = new Date();
    for (const file of files) {
      const filePath = path.join(this.config.rootFolder, file);
      // get the file stats (to know the last access time)
      const stats = await fs.promises.stat(filePath);
      const lastAccessed = stats.atime;
      // Calculate the day difference since the file was last accessed
      const diffDays = Math.floor((now - lastAccessed) / (1000 * 60 * 60 * 24));

      // if the last inactive time was more then the threshold days then delete file
      if (diffDays >= fileConfig.inactiveDaysForCleanUp) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}
