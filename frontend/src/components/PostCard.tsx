import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/lib/api';
import { toast } from 'sonner';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string | null;
    isAnnouncement?: boolean;
    viewCount?: number;
    author?: {
      id: number;
      email: string;
      department: {
        name: string;
      };
    };
    _count: {
      likes: number;
      comments?: number;
    };
  };
}

const PostCard = React.memo(({ post }: PostCardProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
    onError: (error) => {
      toast.error('Failed to delete post', {
        description: error.message,
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>
            <Link to={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          {post.isAnnouncement && <Badge>Announcement</Badge>}
        </div>
        {post.author && (
          <p className="text-sm text-muted-foreground pt-2">
            By{' '}
            <Link
              to={`/profile/${post.author.id}`}
              className="hover:underline"
            >
              {post.author.email}
            </Link>
          </p>
        )}
      </CardHeader>
      <CardContent className="h-40">
        <p className="text-sm text-muted-foreground line-clamp-6">
          {post.content || 'No content'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post._count.likes}</span>
          </div>
          {post._count.comments !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post._count.comments}</span>
            </div>
          )}
          {post.viewCount !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span className="text-xs">{post.viewCount}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/edit-post/${post.id}`}>
            <Button variant="outline" className="w-16 h-7 text-xs">
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-16 h-7 text-xs"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
});

export default PostCard;
