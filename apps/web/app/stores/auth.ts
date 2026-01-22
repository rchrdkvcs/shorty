import type User from "@shorty/api/app/models/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  const fetchUser = async () => {
    if (user.value) return;

    try {
      user.value = await $fetch<User>(useBaseUrl("/auth/me"), {
        credentials: "include",
        headers: useRequestHeaders(["cookie"]) as HeadersInit,
      });
    } catch (error) {
      user.value = null;
      console.error(error);
    }
  };

  return {
    user,
    isAuthenticated,
    fetchUser,
  };
});
