import { storageConfig } from "../config/index.js";
import { LocalFileStorage } from "./localFileStorage.js";

export class StorageFactory {
  static createStorage() {
    // Create the storage instance based on storageConfig.storageType.

    // Default is local storage
    return new LocalFileStorage(storageConfig.config); // Default to local storage
  }
}
