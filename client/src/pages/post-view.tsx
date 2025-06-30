import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Heart, Share, ArrowLeft } from "lucide-react";
import type { Post } from "@shared/schema";
import { format } from "date-fns";

export default function PostView() {
  const [, params] = useRoute("/posts/:slug");
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${slug}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="text-center mb-8">
                <div className="h-12 bg-slate-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <p className="text-slate-500 mb-4">The post you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Set page title for SEO
  document.title = `${post.title} - Blog CMS`;
  
  // Set meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', post.excerpt || post.title);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = post.excerpt || post.title;
    document.head.appendChild(meta);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Admin</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-primary prose-strong:text-slate-900 prose-code:text-slate-900 prose-code:bg-slate-100 prose-pre:bg-slate-900 prose-blockquote:border-slate-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Actions */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
