import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Posts
export const createPost = async (data: {
  title: string;
  content?: string;
  categoryIds: number[];
  tagNames?: string[];
  status?: string;
  visibility?: string;
}) => {
  return api.post("/posts", data);
};

export const getPosts = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: number;
  keyword?: string;
}) => {
  const { data } = await api.get("/posts", { params });
  return data;
};

export const getMyPosts = async () => {
  const { data } = await api.get("/posts/my-posts");
  return data;
};

export const getPostsByAuthor = async (authorId: number) => {
  const { data } = await api.get(`/posts/author/${authorId}`);
  return data;
};

export const getPost = async (id: number) => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

export const updatePost = async (
  id: number,
  data: {
    title?: string;
    content?: string;
    categoryIds?: number[];
    tagNames?: string[];
    status?: string;
    visibility?: string;
    isAnnouncement?: boolean;
  }
) => {
  return api.patch(`/posts/${id}`, data);
};

export const deletePost = async (id: number) => {
  return api.delete(`/posts/${id}`);
};

// Users
export const getUserProfile = async (id: number) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// Departments & Categories
export const getDepartments = async () => {
  const { data } = await api.get("/departments");
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

// Comments
export const createComment = async (data: {
  content: string;
  postId: number;
  parentId?: number;
}) => {
  return api.post("/comments", data);
};

export const deleteComment = async (id: number) => {
  return api.delete(`/comments/${id}`);
};

// Likes
export const toggleLike = async (postId: number) => {
  return api.post("/likes/toggle", { postId });
};

// Notifications
export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationAsRead = async (id: number) => {
  return api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return api.patch("/notifications/read/all");
};
