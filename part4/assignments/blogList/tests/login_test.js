const supertest = require("supertest");
const app = require("../app");

const api = app.use(supertest);

test("login works", async () => {
  const response = await api
    .post("/api/login")
    .send({ username: "test", password: "root" })
    .expect(200);
  console.log(response);
});
