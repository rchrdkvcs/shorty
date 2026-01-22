<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem>([
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
  },
  {
    label: "Links",
    icon: "i-lucide-link",
    to: "/links",
  },
  {
    label: "Contacts",
    icon: "i-lucide-users",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    defaultOpen: true,
    children: [
      {
        label: "General",
      },
      {
        label: "Members",
      },
      {
        label: "Notifications",
      },
    ],
  },
]);
const authStore = useAuthStore();
</script>

<template>
  <UDashboardSidebar>
    <template #default>
      <UButton
        label="Quick add"
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        block
      />

      <UNavigationMenu :items="items" orientation="vertical" />
    </template>

    <template #footer>
      <UUser
        class="p-2 hover:bg-elevated/50 border border-transparent hover:border-default/75 rounded-lg transition-colors cursor-pointer w-full"
        :avatar="{
          src: authStore.user?.avatarUrl,
          alt: 'Avatar',
        }"
        :name="authStore.user.nickname"
        :description="authStore.user.email"
      />
    </template>
  </UDashboardSidebar>
</template>
