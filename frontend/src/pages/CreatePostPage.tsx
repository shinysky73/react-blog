import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, getCategories } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
  categoryIds: z
    .array(z.number())
    .min(1, { message: "At least one category must be selected" }),
  tagNames: z
    .string()
    .optional()
    .transform((val) => val?.split(",").map((tag) => tag.trim()) || []),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
  isAnnouncement: z.boolean().default(false),
});

type CreatePostSchema = z.infer<typeof createPostSchema>;

interface Category {
  id: number;
  name: string;
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      categoryIds: [],
      status: "DRAFT",
      visibility: "PRIVATE",
    },
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
      <Card className="w-full max-w-3xl mt-20 mb-20">
        <CardHeader>
          <CardTitle>Create a new Post</CardTitle>
          <CardDescription>
            Fill in the details below to create a new blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
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

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactMde
                    {...field}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={(markdown) =>
                      Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                    }
                  />
                )}
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-4">
                      {categories?.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={field.value?.includes(category.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, category.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (id) => id !== category.id
                                    )
                                  );
                            }}
                          />
                          <Label htmlFor={`category-${category.id}`}>
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
              {errors.categoryIds && (
                <p className="text-red-500 text-sm">
                  {errors.categoryIds.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tagNames">Tags (comma-separated)</Label>
              <Input
                id="tagNames"
                placeholder="e.g., react, typescript, nestjs"
                {...register("tagNames")}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DRAFT" id="draft" />
                      <Label htmlFor="draft">Draft</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLISHED" id="published" />
                      <Label htmlFor="published">Published</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PRIVATE" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLIC" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* isAnnouncement */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isAnnouncement"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isAnnouncement"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isAnnouncement">Set as Announcement</Label>
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
