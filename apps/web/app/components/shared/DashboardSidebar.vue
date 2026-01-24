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
    label: "Analytics",
    icon: "lucide:bar-chart-3",
    to: "/analytics",
  },
  {
    label: "My Links",
    icon: "lucide:link",
    to: "/links",
  },
  {
    label: "Domains",
    icon: "lucide:globe",
    to: "/domains",
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
        label="New link"
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
