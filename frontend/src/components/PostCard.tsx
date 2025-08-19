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

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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
        <CardTitle>
          <Link to={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-40">
        <p className="text-sm text-muted-foreground line-clamp-6">
          {post.content || 'No content'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
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
      </CardFooter>
    </Card>
  );
}
