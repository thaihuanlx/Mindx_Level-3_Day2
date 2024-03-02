import express from "express";
import {
  getUserById,
  createUser,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  searchPostsByContent,
  getPublicPosts,
} from "./handle.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// API lấy thông tin của user với id được truyền trên params
app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = getUserById(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// API tạo user mới
app.post("/users", (req, res) => {
  const { userName, email, age, avatar } = req.body;
  const newUser = createUser(userName, email, age, avatar);
  if (newUser.error) {
    res.status(400).json({ error: newUser.error });
  } else {
    res.status(201).json(newUser);
  }
});

// API lấy ra các bài post của user được truyền userId trên params
app.get("/users/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const userPosts = getUserPosts(userId);
  res.json(userPosts);
});

// API thực hiện tạo bài post với id của user được truyền trên params
app.post("/users/:userId/posts", (req, res) => {
  const { userId } = req.params;
  const { content, isPublic } = req.body;
  const newPost = createPost(userId, content, isPublic);
  res.status(201).json(newPost);
});

// API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép
app.put("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;
  const updatedPost = updatePost(postId, userId, content);
  if (updatedPost.error) {
    res.status(400).json({ error: updatedPost.error });
  } else {
    res.json(updatedPost);
  }
});

// API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép
app.delete("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const result = deletePost(postId, userId);
  if (result.error) {
    res.status(400).json({ error: result.error });
  } else {
    res.json({ message: "Post deleted successfully" });
  }
});

// API tìm kiếm các bài post với content tương ứng được gửi lên từ query params
app.get("/posts/search", (req, res) => {
  const { content } = req.query;
  const matchedPosts = searchPostsByContent(content);
  res.json(matchedPosts);
});

// API lấy tất cả các bài post với isPublic là true
app.get("/posts/public", (req, res) => {
  const publicPosts = getPublicPosts();
  res.json(publicPosts);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
