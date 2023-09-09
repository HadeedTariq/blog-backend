import { Blog } from "../models/blogSchema.js";

const createBlogPost = async (req, res) => {
  const {
    userName,
    title,
    description,
    thumbnail,
    content,
    category,
    userImage,
  } = req.body;
  try {
    await Blog.create({
      userName,
      title,
      description,
      thumbnail,
      content,
      category,
      userImage,
    });
    return res.status(200).json({ message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find({});
    return res.status(200).json(blogPosts);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Something went wrong" });
  }
};

export { createBlogPost, getAllBlogPosts };
