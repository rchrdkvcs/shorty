<script setup lang="ts">
definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();

const providers = [
  {
    label: "Discord",
    icon: "i-simple-icons-discord",
    size: "lg",
    onClick: () => {
      navigateTo(config.public.apiUrl + "/auth/discord/redirect", {
        external: true,
      });
    },
  },
  {
    label: "Google",
    icon: "i-simple-icons-google",
    size: "lg",
    onClick: () => {
      navigateTo(config.public.apiUrl + "/auth/google/redirect", {
        external: true,
      });
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    size: "lg",
    onClick: () => {
      navigateTo(config.public.apiUrl + "/auth/github/redirect", {
        external: true,
      });
    },
  },
];
</script>

<template>
  <UMain class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :providers="providers"
      />
    </UPageCard>
  </UMain>
</template>
