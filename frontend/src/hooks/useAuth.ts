import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  return {
    user,
    token,
    isAuthenticated: !!token,
    logout,
    checkAuth,
  };
};
