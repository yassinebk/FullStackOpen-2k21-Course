const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const User = require("../models/user");
const helper = require("./testHelper");

const api = supertest(app);

describe("testing the User api", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const hashPromises = helper.listOfUsers.map((user) => bcrypt.hash(user.password, 10));
    const hashes = await Promise.all(hashPromises);
    let i = 0;
    const userObjects = helper.listOfUsers.map(
      (user) => new User({
        username: user.username,
        name: user.name,
        // eslint-disable-next-line no-plusplus
        passwordHash: hashes[i++],
      }),
    );
    const promiseArray = userObjects.map((user) => user.save());
    console.log("saving user to db");
    await Promise.all(promiseArray);
  });

  test("Getting all the user", async () => {
    const result = await api.get("/api/users")
      .expect(200);
    expect(result.body)
      .toHaveLength(helper.listOfUsers.length);
  });

  test("Adding a new user", async () => {
    const userAtStart = await helper.getUsers();
    const newUser = {
      name: "hello",
      username: "hello",
      password: "helloWorld",
    };
    await api.post("/api/users")
      .send(newUser)
      .expect(200);
    const userAtEnd = await helper.getUsers();
    expect(userAtEnd)
      .toHaveLength(userAtStart.length + 1);
  });
});

test("The login auth", async () => {
  await api
    .post("/api/login")
    .send({
      username: helper.listOfUsers[0].username,
      password: helper.listOfUsers[0].password,
    })
    .expect(200);
});
