<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "guest",
});

const toast = useToast();

const providers = [
  {
    label: "Discord",
    icon: "i-simple-icons-discord",
    size: "lg",
    onClick: () => {
      navigateTo("http://localhost:3333/auth/discord/redirect", {
        external: true,
      });
    },
  },
  {
    label: "Google",
    icon: "i-simple-icons-google",
    size: "lg",
    onClick: () => {
      toast.add({ title: "Google", description: "Login with Google" });
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    size: "lg",
    onClick: () => {
      toast.add({ title: "GitHub", description: "Login with GitHub" });
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
