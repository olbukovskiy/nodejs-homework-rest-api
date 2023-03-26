const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");
const { connectDb } = require("../src/db/connection");
const User = require("../src/db/usersSchema");

describe("POST /login", () => {
  const testUserData = {
    email: "supertest1@gmail.com",
    password: "qwerty",
  };
  let server;

  beforeAll(async () => {
    server = app.listen(process.env.PORT);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    mongoose.set("strictQuery", false);
    await connectDb();

    const user = new User(testUserData);
    await user.save();
  });

  afterEach(async () => {
    const { email } = testUserData;
    await User.findOneAndRemove({ email });
    mongoose.set("strictQuery", true);
    await mongoose.disconnect;
  });

  test("should return a token and user object with email and subscription as strings", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(testUserData);

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
