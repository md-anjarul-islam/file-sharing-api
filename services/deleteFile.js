import jwt from "jsonwebtoken";
import { StorageFactory } from "../utils/storageFactory.js";
const fileStorage = StorageFactory.createStorage();

export async function deleteFile(req, res) {
  const { privateKey } = req.params;
  try {
    /** Decode the key to get the public key. That will be used to delete
     * the file from storage
     */
    const decoded = jwt.verify(privateKey, fileConfig.jwtPrivateKey);
    const publicKey = decoded.publicKey;

    /** Delete file from storage */
    await fileStorage.delete(publicKey);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "File not found or Invalid private key" });
  }
}
