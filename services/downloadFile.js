import mime from "mime";
import { StorageFactory } from "../utils/storageFactory.js";
const fileStorage = StorageFactory.createStorage();

export async function downloadFile(req, res) {
  const publicKey = req.params.publicKey;

  const fileMime = mime.getType(publicKey);
  res.setHeader("Content-Type", fileMime);

  // Download from the configured storage instance
  // And pipe back to the response
  fileStorage.download(publicKey).pipe(res);
}
