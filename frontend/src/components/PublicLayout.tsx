import { Link, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();

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
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
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
