import mime from "mime";
import { StorageFactory } from "../utils/storageFactory.js";
const fileStorage = StorageFactory.createStorage();

export async function downloadFile(req, res) {
  try {
    const publicKey = req.params.publicKey;

    const fileMime = mime.getType(publicKey);
    res.setHeader("Content-Type", fileMime);

    // Download from the configured storage instance
    // And pipe back to the response
    return (await fileStorage.download(publicKey)).pipe(res);
  } catch (err) {
    return res.status(400).json({ message: "File not found" });
  }
}
