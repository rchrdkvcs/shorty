<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue'
</script>

<template>
  <UApp>
    <div class="grid grid-cols-[256px_1fr] h-screen bg-default">
      <AppSidebar />
      <main class="size-full overflow-x-scroll">
        <slot />
      </main>
    </div>
  </UApp>
</template>

<style scoped></style>
