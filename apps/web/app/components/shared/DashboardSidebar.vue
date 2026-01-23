<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import QuickAddModal from "~/components/modals/QuickAddModal.vue";

const items = ref<NavigationMenuItem>([
  {
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    to: "/",
  },
  {
    label: "My Links",
    icon: "lucide:link",
    to: "/links",
  },
  {
    label: "QR Codes",
    icon: "lucide:qr-code",
    to: "/qrcodes",
  },
  {
    label: "Shared with me",
    icon: "lucide:users",
    to: "/shared",
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
const overlay = useOverlay();
const quickModal = overlay.create(QuickAddModal);
</script>

<template>
  <UDashboardSidebar>
    <template #default>
      <UButton
        label="Quick add link"
        icon="i-lucide-plus"
        color="neutral"
        variant="subtle"
        @click="quickModal.open()"
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
        :name="authStore.user?.nickname"
        :description="authStore.user?.email"
      />
    </template>
  </UDashboardSidebar>
</template>
