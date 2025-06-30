import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/post-card";
import type { Post } from "@shared/schema";

export default function Home() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load posts. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Section */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Our Blog</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover insights, tutorials, and stories from our community of writers and developers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <Card>
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-slate-900">Latest Posts</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Recent articles and tutorials</p>
        </div>
        {posts && posts.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <CardContent className="p-6 text-center">
            <p className="text-slate-500">No posts published yet.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
