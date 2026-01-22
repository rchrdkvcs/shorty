import type User from "@shorty/api/app/models/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  async function fetchUser() {
    if (user.value) return user.value;

    const data = await $fetch<User | null>(useBaseUrl("/auth/me"), {
      credentials: "include",
    });

    user.value = data;
    return data;
  }

  async function logout() {
    try {
      await $fetch(useBaseUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      user.value = null;
      await navigateTo("/login");
    }
  }

  return {
    user,
    isAuthenticated,
    fetchUser,
    logout,
  };
});
