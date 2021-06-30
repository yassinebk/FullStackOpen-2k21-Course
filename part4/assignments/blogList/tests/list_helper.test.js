const mongoose = require("mongoose");
const listHelper = require("../utils/list_helper");
const helper = require("./testHelper");



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
