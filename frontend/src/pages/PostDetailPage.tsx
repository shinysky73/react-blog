import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getPost, createComment, deleteComment, toggleLike } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Heart, MessageSquare, ArrowLeft } from "lucide-react";

// Types
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    email: string;
  };
  replies: Comment[];
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  author: {
    id: number;
    email: string;
    department: {
      name: string;
    };
  };
  comments: Comment[];
  _count: {
    likes: number;
  };
  userHasLiked: boolean;
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => getPost(Number(postId)),
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(Number(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (newComment: { content: string; postId: number }) =>
      createComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      setComment("");
      toast.success("Comment posted successfully!");
    },
    onError: () => {
      toast.error("Failed to post comment.");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comment deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete comment.");
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentMutation.mutate({ content: comment, postId: Number(postId) });
  };

  if (isLoading) return <p>Loading post...</p>;
  if (isError || !post) return <p>Failed to load post.</p>;

  const CommentList = ({ comments }: { comments: Comment[] }) => (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id} className="flex flex-col">
          <div className="flex justify-between">
            <Link to={`/profile/${c.author.id}`} className="font-semibold hover:underline">
              {c.author.email}
            </Link>
            {user?.id === c.author.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCommentMutation.mutate(c.id)}
              >
                Delete
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{c.content}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground mb-8">
        <span>By <Link to={`/profile/${post.author.id}`} className="hover:underline">{post.author.email}</Link></span>
        <span>In {post.author.department.name}</span>
      </div>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      <div className="flex items-center gap-4 mt-8 border-t pt-4">
        <Button variant="outline" onClick={() => likeMutation.mutate()}>
          <Heart
            className={`mr-2 h-4 w-4 ${
              post.userHasLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {post._count.likes} Likes
        </Button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          {post.comments.length} Comments
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {user && (
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
            />
            <Button type="submit" disabled={commentMutation.isPending}>
              {commentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        )}
        <CommentList comments={post.comments} />
      </div>
    </div>
  );
}