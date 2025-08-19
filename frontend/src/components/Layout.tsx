import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card text-card-foreground p-4 shadow-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Blog System
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm">{user?.email}</span>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
