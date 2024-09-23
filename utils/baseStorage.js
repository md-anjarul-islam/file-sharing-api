/** The base class (that needs to be extended) for file storages */
export class BaseFileStorage {
  // Upload file interface
  async upload(fileBuffer, filePath) {
    throw new Error("Method not implemented.");
  }

  async fileSize(filePath) {
    throw new Error("Method not implemented");
  }

  // Download file interface
  async download(fileKey) {
    throw new Error("Method not implemented.");
  }

  // Delete file interface
  async delete(fileKey) {
    throw new Error("Method not implemented.");
  }

  // Cleanup interface
  async cleanup() {
    throw new Error("Method not implemented.");
  }
}
