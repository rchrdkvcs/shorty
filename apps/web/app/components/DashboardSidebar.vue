<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[][] = [
  [
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
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
  ],
];
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{ footer: 'border-t border-default', root: 'w-64!' }"
  >
    <template #header />

    <template #default>
      <UButton
        label="Search..."
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
      >
        <template #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :items="items[0]"
        orientation="vertical"
        :ui="{ link: 'py-2 cursor-pointer my-0.5' }"
      />

      <UNavigationMenu
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <template #footer>
      <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png',
        }"
        label="Benjamin"
        color="neutral"
        variant="ghost"
        class="w-full"
      />
    </template>
  </UDashboardSidebar>
</template>
