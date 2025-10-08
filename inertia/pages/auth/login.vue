<script setup lang="ts">
import { reactive, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import Empty from '~/layouts/empty.vue'

defineOptions({
  layout: Empty,
})

const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
})

function submit() {
  router.post('/login', form)
}
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="flex flex-col gap-6 ring ring-default bg-default rounded-lg p-6 w-sm">
      <div class="flex flex-col gap-1 items-center justify-center">
        <UIcon name="lucide:lock" class="size-8" />
        <h1 class="text-2xl font-semibold">Connexion</h1>
        <p class="text-muted">
          Pas encore de compte ?
          <ULink to="/register" class="text-primary font-semibold">S'inscrire</ULink>
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <UButton label="Google" icon="mdi:google" color="neutral" variant="soft" block size="lg" />
        <UButton label="Github" icon="mdi:github" color="neutral" variant="soft" block size="lg" />
      </div>

      <USeparator label="Ou" />

      <form @submit.prevent="submit" class="flex flex-col gap-4 w-full">
        <UFormField label="E-mail" required>
          <UInput placeholder="Entrez votre e-mail" class="w-full" v-model="form.email" size="lg" />
        </UFormField>

        <UFormField label="Mot de passe" required>
          <UInput
            :type="showPassword ? 'text' : 'password'"
            placeholder="Entrez votre mot de passe"
            class="w-full"
            size="lg"
            v-model="form.password"
          >
            <template #trailing>
              <UButton
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                :aria-pressed="showPassword"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                aria-controls="password"
                color="neutral"
                variant="link"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          label="Se connecter"
          icon="lucide:log-in"
          block
          class="mt-2"
          size="lg"
        />
        <p class="text-muted">
          Version Beta 6
        </p>
      </form>
    </div>
  </div>
</template>
