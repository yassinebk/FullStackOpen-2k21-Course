const Blog = require("../models/blog");
const User = require("../models/user");

const listWithOneBlog = [
  {
    title: "The art of Design",
    author: "Designers",
    url: "https://dribbble.com/",
    likes: 5,
  },
  {
    title: "Facebook",
    author: "Mark Zuckenburg",
    url: "https://www.facebook.com/",
    likes: 55,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 4,
  },
];

const listOfUsers = [
  {
    username: "MichaelRefka",
    name: "Michael Refka",
    password: "123456",
  },
  {
    username: "AhmedBenAhmed",
    name: "Ahmed Ben Ahmed",
    password: "232424989",
  },
  {
    username: "Markss",
    name: "Mark Zuckenbug",
    password: "998724174",
  },
];

const getBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs;
};
const getUsers = async () => {
  const users = await User.find({});
  return users;
};
const grabUserId = async () => {
  const users = await getUsers();
  return users[0]._id;
};

module.exports = {
  listOfUsers, getUsers, getBlogs, listWithOneBlog, grabUserId,
};
