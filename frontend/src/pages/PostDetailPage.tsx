import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPost(Number(postId)),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading post...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="p-8">
        <p>Failed to load post or post not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card className="flex flex-col gap-4 justify-center mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="min-h-96">
          <p className="text-gray-700 whitespace-pre-wrap">
            {post.content || "No content"}
          </p>
        </CardContent>
        <Button
          type="button"
          className="w-full"
          variant="default"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}
