export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check on server to avoid hydration mismatch
  if (import.meta.server) return;

  const authStore = useAuthStore();
  const publicRoutes = ["/login"];

  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (publicRoutes.includes(to.path)) {
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
