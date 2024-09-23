import fs from "fs";
import { StorageFactory } from "../../utils/storageFactory.js";
import { storageConfig } from "../../config/index.js";
import { expect } from "expect";

async function streamToString(stream) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

describe("LocalFileStorage", async () => {
  const storage = StorageFactory.createStorage();

  it("should upload a file successfully", async () => {
    const fileBuffer = Buffer.from("Test file content");
    // Upload a file with some content
    await storage.upload(fileBuffer, "test.txt");

    // If upload is succesful then the file should be in the specified folder
    const filePath = `./${storageConfig.config.rootFolder}/test.txt`;
    expect(fs.existsSync(filePath)).toBe(true);

    // Cleanup the uploaded file
    fs.unlinkSync(filePath);
  });

  it("should download a file successfully", async () => {
    const mockFileName = `test2.txt`;
    const mockFilePath = `./${storageConfig.config.rootFolder}/${mockFileName}`;
    const mockFileContent = "Test file content";
    // Put a dummy file in the specified directory
    fs.writeFileSync(mockFilePath, mockFileContent);

    // Now after downloading the file, the content should be the same as uploaded
    const stream = await storage.download(mockFileName);
    const downloadData = await streamToString(stream);
    expect(downloadData).toBe(mockFileContent);

    // Cleanup the uploaded file
    fs.unlinkSync(mockFilePath);
  });

  it("should delete a file successfully", async () => {
    const mockFileName = `test3.txt`;
    const mockFilePath = `./${storageConfig.config.rootFolder}/${mockFileName}`;
    const mockFileContent = "Test file content";
    // Put a dummy file in the specified directory
    fs.writeFileSync(mockFilePath, mockFileContent);

    // Now after deleting the file, the file should not exist
    await storage.delete(mockFileName);
    expect(fs.existsSync(mockFilePath)).toBe(false);
  });
});
