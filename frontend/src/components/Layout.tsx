import { Outlet, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/authStore";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  type: string;
  read: boolean;
  sender: {
    email: string;
  };
  post: {
    id: number;
    title: string;
  };
}

export default function Layout() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const readMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      readMutation.mutate(notification.id);
    }
    navigate(`/posts/${notification.post.id}`);
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center container mx-auto">
        <Link
          to="/"
          className="flex items-center justify-center font-bold text-xl"
        >
          Blog System
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications && notifications.length > 0 ? (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`cursor-pointer ${!n.read ? "font-bold" : ""}`}
                  >
                    <div>
                      <p>{n.sender.email} {n.type === 'NEW_LIKE' ? 'liked' : 'commented on'} your post:</p>
                      <p className="text-sm text-muted-foreground">{n.post.title}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          {user && (
            <Link to={`/profile/${user.id}`} className="text-sm font-medium text-muted-foreground hover:underline">
              {user.email}
            </Link>
          )}
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex-1 container mx-auto p-8">
        <Outlet />
      </main>
      <footer className="flex container mx-auto items-center justify-center py-6 w-full border-t">
        <p className="text-xs text-gray-500">
          &copy; 2025 Blog System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
