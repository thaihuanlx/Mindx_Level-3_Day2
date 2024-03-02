import { v4 as uuidv4 } from "uuid";
import { users, posts } from "./data.js";

// API lấy thông tin của user với id được truyền trên params
function getUserById(userId) {
  return users.find((user) => user.id === userId);
}

// Kiểm tra xem email đã tồn tại trong danh sách users chưa
function isEmailExists(email) {
  return users.some((user) => user.email === email);
}

// API tạo user mới
function createUser(userName, email, age, avatar) {
  if (isEmailExists(email)) {
    return { error: "Email already exists" };
  }

  const newUser = {
    id: uuidv4(),
    userName,
    email,
    age,
    avatar,
  };

  users.push(newUser);
  return newUser;
}

// API lấy ra các bài post của user được truyền userId trên params
function getUserPosts(userId) {
  return posts.filter((post) => post.userId === userId);
}

// API thực hiện tạo bài post với id của user được truyền trên params
function createPost(userId, content, isPublic) {
  const newPost = {
    userId,
    postId: uuidv4(),
    content,
    createdAt: new Date().toISOString(),
    isPublic,
  };

  posts.push(newPost);
  return newPost;
}

// API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép
function updatePost(postId, userId, newContent) {
  const postToUpdate = posts.find((post) => post.postId === postId);

  if (!postToUpdate) {
    return { error: "Post not found" };
  }

  if (postToUpdate.userId !== userId) {
    return { error: "You are not authorized to update this post" };
  }

  postToUpdate.content = newContent;
  return postToUpdate;
}

// API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép
function deletePost(postId, userId) {
  const index = posts.findIndex((post) => post.postId === postId);

  if (index === -1) {
    return { error: "Post not found" };
  }

  if (posts[index].userId !== userId) {
    return { error: "You are not authorized to delete this post" };
  }

  posts.splice(index, 1);
  return { message: "Post deleted successfully" };
}

// API tìm kiếm các bài post với content tương ứng được gửi lên từ query params
function searchPostsByContent(content) {
  return posts.filter((post) => post.content.includes(content));
}

// API lấy tất cả các bài post với isPublic là true
function getPublicPosts() {
  return posts.filter((post) => post.isPublic);
}

export {
  getUserById,
  createUser,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  searchPostsByContent,
  getPublicPosts,
};
