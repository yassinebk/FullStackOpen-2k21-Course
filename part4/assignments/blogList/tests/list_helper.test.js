const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 15,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 4,
    __v: 0,
  },
];
describe("total likes", () => {
  test("When list has only one blog , equals the likes of that", () => expect(
    listHelper.totalLikes(
      listWithOneBlog.map((blog) => (blog.likes === 5 ? blog : { likes: 0 })),
    ),
  ).toBe(5));

  test("of empty list is 0", () => expect(listHelper.totalLikes([])).toBe(0));

  test("of a bigger list is calculated Right", () => expect(listHelper.totalLikes(listWithOneBlog)).toBe(24));
});

describe("Favorite blog", () => {
  test("When list is empty", () => expect(listHelper.favoriteBlog([])).toEqual({ title: "", author: "", likes: 0 }));

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

  test("When we got a big list", () => expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    likes: 15,
  }));
});

describe("Author with most blog", () => {
  test("When list is empyty", () => expect(listHelper.mostBlogs([])).toEqual({
    author: "", blogs: 0,
  }));
  test("When list with one blog  we expect to return the blog", () => expect(listHelper.mostBlogs([
    {
      _id: "444",
      title: "bordeom",
      author: "no one",
      url: "pew.com",
      blogs: 44,
    },
  ])).toEqual({
    author: "no one",
    blogs: 44,
  }));

  test("When big List  we expect to return the right blog", () => expect(listHelper.mostBlogs([
    {
      _id: "444",
      title: "bordeom",
      author: "no one",
      url: "pew.com",
      blogs: 44,
    }, {
      _id: "555",
      title: "higher boredom",
      author: "no one",
      url: "pew.com",
      blogs: 10,
    },
  ])).toEqual({
    author: "no one",
    blogs: 44,
  }));
});

describe("Author with most likes", () => {
  test("When list is empyty", () => expect(listHelper.mostLikes([])).toEqual({
    author: "", likes: 0,
  }));
  test("When list with one blog  we expect to return the blog", () => expect(listHelper.mostLikes([
    {
      _id: "444",
      title: "bordeom",
      author: "no one",
      url: "pew.com",
      likes: 44,
    },
  ])).toEqual({
    author: "no one",
    likes: 44,
  }));

  test("When big List  we expect to return the right blog", () => expect(listHelper.mostLikes([
    {
      _id: "444",
      title: "bordeom",
      author: "no one",
      url: "pew.com",
      likes: 44,
    }, {
      _id: "555",
      title: "higher boredom",
      author: "no one",
      url: "pew.com",
      likes: 10,
    },
  ])).toEqual({
    author: "no one",
    likes: 44,
  }));
});
