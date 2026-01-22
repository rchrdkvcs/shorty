export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    await authStore.fetchUser();
  }

  if (authStore.isAuthenticated && to.path === "/login") {
    return navigateTo("/");
  }

  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }
});
