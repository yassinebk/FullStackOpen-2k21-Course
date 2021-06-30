const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./testHelper");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);

describe("Blogs api functionality with token auth", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const userID = await helper.grabUserId();
    const blogObjects = helper.listWithOneBlog.map(
      (blog) => new Blog({ ...blog, user: userID }),
    );
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  describe("api GET requests are working", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });
    test("blogs are all returned", async () => {
      const response = await api.get("/api/blogs");
      expect(response.body).toHaveLength(helper.listWithOneBlog.length);
    });

    test("the id identifier exists under the name of id ", async () => {
      const blogs = await helper.getBlogs();
      blogs.forEach((blog) => expect(blog.id).toBeDefined());
    });
  });

  describe("api POST requests are working", () => {
    test("a valid blog can be added ", async () => {
      const token = await api.post("/api/login").send({
        username: helper.listOfUsers[0].username,
        password: helper.listOfUsers[0].password,
      });

      const userId = await helper.grabUserId();
      const newBlog = {
        author: "Yassine Belkhadem",
        title: "The art of sleep deprivation",
        url: "theartofsleepdeprivation.com",
        likes: 5152456,
        userId,
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `bearer ${token.body.token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      const blogsAtEnd = await helper.getBlogs();
      expect(blogsAtEnd).toHaveLength(helper.listWithOneBlog.length + 1);
    });

    test("the default value for likes is 0 ", async () => {
      const userId = await helper.grabUserId();
      const token = await api.post("/api/login").send({
        username: helper.listOfUsers[0].username,
        password: helper.listOfUsers[0].password,
      });
      const newBlog = {
        author: "this is a test blog",
        title: "testing blog",
        url: "helloWorld",
        userId,
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .set("Authorization", `bearer ${token.body.token}`)
        .expect(200);

      const blogsAtEnd = await helper.getBlogs();
      const addedBlog = blogsAtEnd.filter(
        (blog) => blog.title === newBlog.title,
      );

      expect(addedBlog.length).toEqual(1);
      expect(addedBlog[0].likes).toEqual(0);
    });

    test("a request with invalid content is not accepeted", async () => {
      const token = await api.post("/api/login").send({
        username: helper.listOfUsers[0].username,
        password: helper.listOfUsers[0].password,
      });

      const newBadBlog = {
        likes: 33,
      };
      await api
        .post("/api/blogs")
        .send(newBadBlog)
        .set("Authorization", `Bearer ${token.body.token}`)
        .expect(400);
    });
  });

  describe("testing the Delete Request", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const token = await api.post("/api/login").send({
        username: helper.listOfUsers[0].username,
        password: helper.listOfUsers[0].password,
      });
      const blogsAtStart = await helper.getBlogs();
      console.log("blogs at start", blogsAtStart);
      const blogToDelete = blogsAtStart[0];
      console.log("blog to delete", blogToDelete._id);

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set("Authorization", `Bearer ${token.body.token}`)
        .expect(204);
      const blogsAtEnd = await helper.getBlogs();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    });
  });
});
