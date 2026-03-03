<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue'
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <AppSidebar />

      <slot />
    </UDashboardGroup>
  </UApp>
</template>
