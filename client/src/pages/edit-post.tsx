import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RichTextEditor from "@/components/rich-text-editor";
import { updatePostSchema, type UpdatePost, type Post } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import slugify from "slugify";

export default function EditPost() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/edit/:id");
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const postId = params?.id || null;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/admin/posts", postId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      return response.json();
    },
    enabled: !!postId,
  });

  const form = useForm<UpdatePost>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        published: post.published || false,
      });
      setContent(post.content);
    }
  }, [post, form]);

  const updatePostMutation = useMutation({
    mutationFn: async (data: UpdatePost) => {
      const response = await apiRequest("PUT", `/api/posts/${postId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts", postId] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdatePost) => {
    updatePostMutation.mutate({
      ...data,
      content,
    });
  };

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    const slug = slugify(title, { lower: true, strict: true });
    form.setValue("slug", slug);
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    updatePostMutation.mutate({
      ...data,
      content,
      published: false,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-96 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load post. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
            Edit Post
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your blog content
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your post title..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTitleChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug Field */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="post-slug"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      URL: <span className="font-mono text-primary">/posts/{field.value}</span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Excerpt Field */}
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Excerpt <span className="text-slate-500">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of your post..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rich Text Editor */}
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your post..."
              />

              {/* Published Toggle */}
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Published
                      </FormLabel>
                      <div className="text-sm text-slate-500">
                        Make this post visible to the public
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={updatePostMutation.isPending}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit"
                  disabled={updatePostMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Update Post
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
