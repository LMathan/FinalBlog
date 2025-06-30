import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RichTextEditor from "@/components/rich-text-editor";
import { insertPostSchema, type InsertPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import slugify from "slugify";

const createPostSchema = insertPostSchema.extend({
  published: insertPostSchema.shape.published.default(false),
});

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const form = useForm<InsertPost>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const response = await apiRequest("POST", "/api/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPost) => {
    createPostMutation.mutate({
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
    createPostMutation.mutate({
      ...data,
      content,
      published: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
            Create New Post
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Write and publish your blog content
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
                    <FormLabel>
                      Slug <span className="text-slate-500">(auto-generated)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-slate-50"
                        readOnly
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
                        Publish immediately
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
                  disabled={createPostMutation.isPending}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit"
                  disabled={createPostMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {form.watch("published") ? "Publish Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
