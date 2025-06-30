import { z } from "zod";
import mongoose, { Schema, Document } from "mongoose";

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Post Schema
const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  published: { type: Boolean, default: false },
}, { timestamps: true });

// MongoDB Models
export const UserModel = mongoose.model('User', userSchema);
export const PostModel = mongoose.model('Post', postSchema);

// Zod Schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
});

export const updatePostSchema = insertPostSchema.partial();

// TypeScript Types
export interface User {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
