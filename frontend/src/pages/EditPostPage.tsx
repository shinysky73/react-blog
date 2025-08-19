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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost, updatePost } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const updatePostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  content: z.string().optional(),
});

type UpdatePostSchema = z.infer<typeof updatePostSchema>;

export default function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(Number(postId)),
    enabled: !!postId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content || "",
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdatePostSchema) => updatePost(Number(postId), data),
    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to update post", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: UpdatePostSchema) => {
    mutation.mutate(data);
  };

  if (isPostLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-3xl mt-20">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Update the details of your blog post.
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
              {mutation.isPending ? "Updating..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
