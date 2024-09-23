import request from "supertest";
import app from "../../app.js";
import { unlinkSync, writeFileSync } from "fs";

describe("GET /files/:publicKey", function () {
  it("should return 404 when no file exists", async function () {
    await request(app).get("/files/12345_nonexistent.txt").expect(400);
  });

  // put a dummy file at the location
  before(() => {
    writeFileSync("./uploads/12345_test.txt", Buffer.from("Test text"));
  });

  // delete the dummy file after test completes
  after(() => {
    unlinkSync("./uploads/12345_test.txt");
  });

  it("should return 200 when file exists", async function () {
    await request(app).get("/files/12345_test.txt").expect(200);
  });
});
