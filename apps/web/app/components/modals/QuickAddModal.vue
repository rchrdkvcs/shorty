<script setup lang="ts"></script>

<template>
  <UModal class="w-xl">
    <template #body>
      <UInput
        v-model="title"
        label="Title"
        placeholder="Enter title"
        class="mb-4"
      />
    </template>
  </UModal>
</template>
