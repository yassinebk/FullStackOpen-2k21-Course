const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const listHelper = require("../utils/list_helper");
const app = require("../app");
const Blog = require("../models/blog");
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
        passwordHash: hashes[i++],
      }),
    );
    const promiseArray = userObjects.map((user) => user.save());
    console.log("saving user to db");
    await Promise.all(promiseArray);
  });

  test("Getting all the user", async () => {
    const result = await api.get("/api/users").expect(200);
    expect(result.body).toHaveLength(helper.listOfUsers.length);
  });

  test("Adding a new user", async () => {
    const userAtStart = await helper.getUsers();
    const newUser = {
      name: "hello",
      username: "hello",
      password: "helloWorld",
    };
    await api.post("/api/users").send(newUser).expect(200);
    const userAtEnd = await helper.getUsers();
    expect(userAtEnd).toHaveLength(userAtStart.length + 1);
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

/*  describe("testing PUT requests", () => {
    test("for an exisitng blog", async () => {
      const currentBlogs = await helper.getBlogs();
      const updatedBlog = { likes: 12131 };
      await api
        .put(`/api/blogs/${currentBlogs[0].id}`)
        .send(updatedBlog)
        .expect(204);
      const blogsAtEnd = await helper.getBlogs();
      expect(blogsAtEnd[0].likes).toBe(updatedBlog.likes);
    });
  });
}); */

test("dummy returns one", () => expect(listHelper.dummy([])).toBe(1));

describe("total likes", () => {
  test("When list has only one blog , equals the likes of that", () => expect(
    listHelper.totalLikes(
      helper.listWithOneBlog.map((blog) => (blog.likes === 5 ? blog : { likes: 0 })),
    ),
  ).toBe(5));

  test("of empty list is 0", () => expect(listHelper.totalLikes([])).toBe(0));

  test("of a bigger list is calculated Right", () => expect(listHelper.totalLikes(helper.listWithOneBlog)).toBe(64));
});

describe("Favorite blog", () => {
  test("When list is empty", () => expect(listHelper.favoriteBlog([])).toEqual({
    title: "",
    author: "",
    likes: 0,
  }));

  test("When list has one element", () => expect(
    listHelper.favoriteBlog([
      {
        _id: "444",
        title: "bordeom",
        author: "no one",
        url: "pew.com",
        likes: 44,
      },
    ]),
  ).toEqual({
    title: "bordeom",
    author: "no one",
    likes: 44,
  }));

  test("When we got a big list", () => expect(listHelper.favoriteBlog(helper.listWithOneBlog)).toEqual({
    title: "Facebook",
    author: "Mark Zuckenburg",
    likes: 55,
  }));
});

describe("Author with most blog", () => {
  test("When list is empyty", () => expect(listHelper.mostBlogs([])).toEqual({
    author: "",
    blogs: 0,
  }));
  test("When list with one blog  we expect to return the blog", () => expect(
    listHelper.mostBlogs([
      {
        _id: "444",
        title: "bordeom",
        author: "no one",
        url: "pew.com",
        blogs: 44,
      },
    ]),
  ).toEqual({
    author: "no one",
    blogs: 44,
  }));

  test("When big List  we expect to return the right blog", () => expect(
    listHelper.mostBlogs([
      {
        _id: "444",
        title: "bordeom",
        author: "no one",
        url: "pew.com",
        blogs: 44,
      },
      {
        _id: "555",
        title: "higher boredom",
        author: "no one",
        url: "pew.com",
        blogs: 10,
      },
    ]),
  ).toEqual({
    author: "no one",
    blogs: 44,
  }));
});

describe("Author with most likes", () => {
  test("When list is empyty", () => expect(listHelper.mostLikes([])).toEqual({
    author: "",
    likes: 0,
  }));

  test("When list with one blog  we expect to return the blog", () => expect(
    listHelper.mostLikes([
      {
        _id: "444",
        title: "bordeom",
        author: "no one",
        url: "pew.com",
        likes: 44,
      },
    ]),
  ).toEqual({
    author: "no one",
    likes: 44,
  }));

  test("When big List  we expect to return the right blog", () => expect(
    listHelper.mostLikes([
      {
        _id: "444",
        title: "bordeom",
        author: "no one",
        url: "pew.com",
        likes: 44,
      },
      {
        _id: "555",
        title: "higher boredom",
        author: "no one",
        url: "pew.com",
        likes: 10,
      },
    ]),
  ).toEqual({
    author: "no one",
    likes: 44,
  }));
});

afterAll(() => {
  mongoose.connection.close();
});
