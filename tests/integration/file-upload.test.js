import request from "supertest";
import app from "../../app.js";
import { expect } from "expect";
import { unlinkSync } from "fs";

describe("POST /files/", function () {
  let file = null;
  //Clean up the files after test completes
  this.afterAll(() => {
    unlinkSync(`./uploads/${file}`);
  });

  it("should upload file successfully", async function () {
    const fileContent = "Test content";
    // call POST method and attach a file with some content
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt");

    // The response should be OK (200) and should have public and private key in body
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("publicKey");
    expect(response.body).toHaveProperty("privateKey");

    // save public key to delete the file after test completes
    file = response.body.publicKey;
  });
});

describe("POST /files/", function () {
  let files = [];
  //Clean up the files after test completes
  this.afterAll(() => {
    for (const file of files) {
      unlinkSync(`./uploads/${file}`);
    }
  });

  it("should upload file successfully and be able to download it", async function () {
    const fileContent = "Test content";
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    const { publicKey } = response.body;
    // Save the key to delete the file after test completes
    files.push(publicKey);

    await request(app)
      .get(`/files/${publicKey}`)
      .expect(200)
      .expect("Content-Type", /text/)
      .then((response) => {
        expect(response.text).toEqual(fileContent);
      });
  });

  it("should upload file successfully and fail to download for wrong key", async function () {
    const fileContent = "Test content";
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    const { publicKey } = response.body;
    // Save the key to delete the file after test completes
    files.push(publicKey);

    await request(app).get(`/files/wrong-key`).expect(400);
  });
});

// 3. Test for delete file
describe("DELETE /files/", function () {
  let files = [];
  //Clean up the files after test completes
  this.afterAll(() => {
    for (const file of files) {
      unlinkSync(`./uploads/${file}`);
    }
  });

  it("should upload file successfully and will fail to delete with wrong private key", async function () {
    const fileContent = "Test content";
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    const { privateKey, publicKey } = response.body;
    // Save the key to delete the file after test completes
    files.push(publicKey);

    await request(app)
      .delete(`/files/wrong-private-key`)
      .expect(400)
      .then((response) =>
        expect(response.body).toStrictEqual({
          message: "File not found or Invalid private key",
        })
      );
  });

  it("should upload file successfully and delete succesfully with correct private key", async function () {
    const fileContent = "Test content";
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    const { privateKey } = response.body;

    await request(app)
      .delete(`/files/${privateKey}`)
      .expect(200)
      .then((response) =>
        expect(response.body.message).toBe("File deleted successfully")
      );
  });
});
