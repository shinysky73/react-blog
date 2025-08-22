import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts, getCategories } from "@/lib/api";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

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
  _count: {
    likes: number;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const {
    data: postsData,
    isLoading,
    isError,
  } = useQuery<{ data: Post[]; total: number; page: number; limit: number }>({
    queryKey: ["posts", page, categoryId, debouncedKeyword],
    queryFn: () => getPosts({ page, categoryId, keyword: debouncedKeyword }),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const totalPages = postsData ? Math.ceil(postsData.total / postsData.limit) : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search posts..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => {
            const isAll = value === 'all';
            setCategoryId(isAll ? undefined : Number(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        {isLoading && <p>Loading posts...</p>}
        {isError && <p>Failed to load posts.</p>}
        {postsData?.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postsData.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {postsData?.data?.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No posts found.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        {postsData && postsData.total > 0 && (
          <>
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}