import request from "supertest";
import app from "../../app.js";
import { expect } from "expect";
import { unlinkSync } from "fs";

describe("POST /files/", function () {
  let files = [];
  //Clean up the files after test completes
  this.afterAll(() => {
    for (const file of files) {
      unlinkSync(`./uploads/${file}`);
    }
  });

  it("should upload file successfully and fail to download for wrong key", async function () {
    const fileContent = "Test content";
    // call POST method and upload a file with some content
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    // Save the key to delete the file after test completes
    files.push(response.body.publicKey);

    // will get 400 for wrong-key
    await request(app).get(`/files/wrong-key`).expect(400);
  });

  it("should upload file successfully and be able to download it with correct key", async function () {
    const fileContent = "Test content";
    // call POST method and upload a file with some content
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    // Take the correct public key from response to get the file
    const { publicKey } = response.body;
    // Save the key to delete the file after test completes
    files.push(publicKey);

    // After getting the file it should response 200, and the file content should be as it was uploaded
    await request(app)
      .get(`/files/${publicKey}`)
      .expect(200)
      .expect("Content-Type", /text/)
      .then((response) => {
        // Check the file content as it was uploaded
        expect(response.text).toEqual(fileContent);
      });
  });
});
