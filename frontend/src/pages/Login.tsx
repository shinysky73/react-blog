import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (data: any) => api.post("/auth/login", data),
    onSuccess: async (response) => {
      const { accessToken } = response.data;
      // Temporarily set token for profile fetch
      useAuthStore.setState({ token: accessToken });
      try {
        const profileResponse = await api.get("/users/profile");
        // Finalize login with user and token
        login(profileResponse.data, accessToken);
        navigate("/dashboard");
        toast.success("Login successful!");
      } catch (error) {
        console.error("Failed to fetch profile after login:", error);
        useAuthStore.setState({ token: null }); // Clear token on error
        toast.error("Failed to fetch profile. Please try again.");
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    mutation.mutate({ email, password });
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                ref={emailRef}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required ref={passwordRef} />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
