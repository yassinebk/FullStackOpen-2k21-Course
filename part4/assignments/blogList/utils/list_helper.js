const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reduce = (sum, blog) => blog.likes + sum;
  return blogs.reduce(reduce, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return { title: "", author: "", likes: 0 };
  const reducer = (favBlog, blog) => {
    if (blog.likes > favBlog.likes) return { title: blog.title, author: blog.author, likes: blog.likes };
    return favBlog;
  };
  return blogs.reduce(reducer, { title: "", auhtor: "", likes: 0 });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return { author: "", blogs: 0 };
  const reduce = (mostHaveBlogs, blog) => {
    if (blog.blogs > mostHaveBlogs.blogs) return { author: blog.author, blogs: blog.blogs };
    return mostHaveBlogs;
  };

  return blogs.reduce(reduce, { author: "", blogs: 0 });
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return { author: "", likes: 0 };
  const reduce = (mostLiked, blog) => {
    if (blog.likes > mostLiked.likes) return { author: blog.author, likes: blog.likes };
    return mostLiked;
  };

  return blogs.reduce(reduce, { author: "", likes: 0 });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostLikes,
  mostBlogs,
};
