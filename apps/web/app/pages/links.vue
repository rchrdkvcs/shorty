<script lang="ts">
const links = ref([
  {
    name: "My New Link",
    destination: "https://discord.com",
    customSlug: "discord",
    autoSlug: "ar395gdsf",
  },
]);

const selectedLink = ref(null);
</script>

<template>
  <UDashboardPanel id="links-panel">
    <template #header>
      <UDashboardNavbar title="Links" />
    </template>

    <template #body>
      <UPageGrid>
        <UPageCard v-for="link in links" variant="soft">
          {{ link.name }}
        </UPageCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>

  <UDashboardPanel v-if="selectedLink" id="link-panel">
    <template #header>
      <UDashboardNavbar title="Links" />
    </template>

    <template #body>
      <UPageGrid>
        <UPageCard variant="soft"></UPageCard>
      </UPageGrid>
    </template>
  </UDashboardPanel>
</template>
