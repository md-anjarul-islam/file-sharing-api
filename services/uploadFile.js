import crypto from "crypto";
import jwt from "jsonwebtoken";
import { fileConfig } from "../config/index.js";
import { StorageFactory } from "../utils/storageFactory.js";
const fileStorage = StorageFactory.createStorage();

export async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  /** Generate a random key to use as public key */
  const randomKey = crypto.randomUUID();
  const publicKey = `${randomKey}_${req.file.originalname}`;

  /** Generate private key by signing the public key and a jwt secret*/
  const privateKey = jwt.sign({ publicKey }, fileConfig.jwtPrivateKey);

  /** Upload the file to the storage.
   * And send the public key so that, the file can be found by that key later
   */
  await fileStorage.upload(req.file.buffer, publicKey);

  res.json({ publicKey, privateKey });
}
