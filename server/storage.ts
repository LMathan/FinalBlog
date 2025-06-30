import { UserModel, PostModel, type User, type InsertUser, type Post, type InsertPost, type UpdatePost } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getAllPosts(): Promise<Post[]>;
  getPublishedPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: UpdatePost): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    if (!user) return undefined;
    return {
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) return undefined;
    return {
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    return {
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
    return posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  async getPublishedPosts(): Promise<Post[]> {
    const posts = await PostModel.find({ published: true }).sort({ createdAt: -1 }).lean();
    return posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || this.generateExcerpt(post.content),
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  private generateExcerpt(content: string): string {
    // Strip HTML tags and get first 150 characters
    const stripped = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return stripped.length > 150 ? stripped.substring(0, 150) + '...' : stripped;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const post = await PostModel.findOne({ slug }).lean();
    if (!post) return undefined;
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const post = await PostModel.findById(id).lean();
    if (!post) return undefined;
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const post = new PostModel(insertPost);
    await post.save();
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updatePost(id: string, updatePost: UpdatePost): Promise<Post | undefined> {
    const post = await PostModel.findByIdAndUpdate(
      id,
      updatePost,
      { new: true }
    ).lean();
    if (!post) return undefined;
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || undefined,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const storage = new DatabaseStorage();
