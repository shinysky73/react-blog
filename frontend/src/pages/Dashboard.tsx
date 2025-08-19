import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

interface Post {
  id: number;
  title: string;
  content: string | null;
}

export default function DashboardPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link to="/create-post">
          <Button>Create Post</Button>
        </Link>
      </div>

      <div>
        {isLoading && <p>Loading posts...</p>}
        {isError && <p>Failed to load posts.</p>}
        {posts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {posts?.length === 0 && <p>You haven't created any posts yet.</p>}
      </div>
    </div>
  );
}
