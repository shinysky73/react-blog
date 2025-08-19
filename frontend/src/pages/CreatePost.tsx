import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

type CreatePostSchema = z.infer<typeof createPostSchema>;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to create post", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: CreatePostSchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl mt-20">
        <CardHeader>
          <CardTitle>Create a new Post</CardTitle>
          <CardDescription>
            Fill in the details below to create a new blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                className="h-96"
                placeholder="Enter post content (optional)"
                {...register("content")}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
