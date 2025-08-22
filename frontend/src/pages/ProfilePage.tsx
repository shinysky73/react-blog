import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, getPostsByAuthor } from "@/lib/api";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface UserProfile {
  id: number;
  email: string;
  department: {
    name: string;
  };
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  _count: {
    likes: number;
  };
}

export default function ProfilePage() {
  const { userId } = useParams();

  const { data: user, isLoading: isLoadingUser } = useQuery<UserProfile>({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(Number(userId)),
    enabled: !!userId,
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ["userPosts", userId],
    queryFn: () => getPostsByAuthor(Number(userId)),
    enabled: !!userId,
  });

  if (isLoadingUser || isLoadingPosts) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.email}`} />
          <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.email}</h1>
          <p className="text-muted-foreground">{user.department.name}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Posts by {user.email}</h2>
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>This user has not published any posts yet.</p>
      )}
    </div>
  );
}
