import { Link } from "wouter";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Post } from "@shared/schema";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <a className="block hover:bg-slate-50 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-primary truncate">
              {post.title}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {post.excerpt}
            </p>
            <div className="mt-2 flex items-center text-sm text-slate-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-1" />
              <span>Admin</span>
            </div>
          </div>
          <div className="ml-2 flex-shrink-0">
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </a>
    </Link>
  );
}
