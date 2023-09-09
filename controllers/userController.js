import { User } from "../models/userSchema.js";
import { Blog } from "../models/blogSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  const { userName, email, password } = req.body;
  const exist = await User.findOne({ userName });
  if (exist) {
    return res.status(400).json({ message: "User already existed" });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      ...req.body,
      password: hashPassword,
    });
    return res.status(200).json({ message: "User created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }
};
const authenticateUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        userName,
        profileImage: user.profileImage,
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    return res
      .status(200)
      .json({ message: "User logged in successfully", token: token });
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong" });
  }
};

const getUserDetails = async (req, res) => {
  const { token } = req.body;
  const validUser = jwt.verify(token, process.env.JWT_SECRET);
  if (!validUser) {
    return res.status(404).json({ message: "Invalid token" });
  }
  return res.status(200).json(validUser);
};

const deleteUser = async (req, res) => {
  const { id, userName } = req.query;
  try {
    const user = await User.findByIdAndDelete({ _id: id });
    if (user) {
      await Blog.deleteMany({ userName });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Something went wrong" });
  }
};
const updateUserDetails = async (req, res) => {
  const { name, id } = req.query;
  const { profileImage } = req.body;
  try {
    const exist = await User.findOne({ userName: name });
    if (exist) {
      return res.status(404).json({ message: "User name already taken" });
    }
    await User.findByIdAndUpdate({ _id: id }, { userName: name, profileImage });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Something went wrong" });
  }
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword, userName } = req.body;
  const user = await User.findOne({ userName });
  const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isCorrectPassword) {
    return res.status(404).json({ message: "Incorrect Password" });
  }
  try {
    const hashPassword = await bcrypt.hash(newPassword, 16);
    await User.findOneAndUpdate({ userName }, { password: hashPassword });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};
export {
  createUser,
  authenticateUser,
  getUserDetails,
  deleteUser,
  updateUserDetails,
  updateUserPassword,
};
