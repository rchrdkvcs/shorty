<script setup lang="ts">
import DashboardSidebar from '~/components/DashboardSidebar.vue'
</script>

<template>
  <UApp>
    <div class="grid grid-cols-[256px_1fr] h-screen bg-default">
      <DashboardSidebar />
      <main class="size-full overflow-x-scroll">
        <slot />
      </main>
    </div>
  </UApp>
</template>
