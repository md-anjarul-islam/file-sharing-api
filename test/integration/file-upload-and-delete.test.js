import request from "supertest";
import app from "../../app.js";
import { expect } from "expect";
import { unlinkSync } from "fs";

describe("DELETE /files/", function () {
  let files = [];
  //Clean up the files after test completes
  this.afterAll(() => {
    for (const file of files) {
      unlinkSync(`./uploads/${file}`);
    }
  });

  it("should upload file successfully and fail to delete with wrong private key", async function () {
    const fileContent = "Test content";
    // call POST method and upload a file with some content
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    // Save the key to delete the file after test completes
    files.push(response.body.publicKey);

    // should response 400 for the wrong private key
    await request(app)
      .delete(`/files/wrong-private-key`)
      .expect(400)
      .then((response) =>
        // the response message as validating
        expect(response.body).toStrictEqual({
          message: "File not found or Invalid private key",
        })
      );
  });

  it("should upload file successfully and delete succesfully with correct private key", async function () {
    const fileContent = "Test content";
    // call POST method and upload a file with some content
    const response = await request(app)
      .post("/files")
      .attach("file", Buffer.from(fileContent), "test.txt")
      .expect(200);

    // Take the correct private key from response body to call delete api
    const { privateKey } = response.body;

    // Delete api should response 200 and a message acknowledgement
    await request(app)
      .delete(`/files/${privateKey}`)
      .expect(200)
      .then((response) =>
        expect(response.body.message).toBe("File deleted successfully")
      );
  });
});
