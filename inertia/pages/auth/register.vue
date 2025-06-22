<script setup lang="ts">
import { reactive, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import Empty from '~/layouts/empty.vue'

defineOptions({
  layout: Empty,
})

const showPassword = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
})

function submit() {
  router.post('/register', form)
}
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="flex flex-col gap-6 ring ring-default bg-default rounded-lg p-6 w-sm">
      <div class="flex flex-col gap-1 items-center justify-center">
        <UIcon name="lucide:user-plus" class="size-8" />
        <h1 class="text-2xl font-semibold">Inscription</h1>
        <p class="text-muted">
          Déjà un compte ?
          <ULink to="/login" class="text-primary font-semibold">Se connecter</ULink>
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <UButton label="Google" icon="mdi:google" color="neutral" variant="soft" block size="lg" />
        <UButton label="Github" icon="mdi:github" color="neutral" variant="soft" block size="lg" />
      </div>

      <USeparator label="Ou" />

      <form @submit.prevent="submit" class="flex flex-col gap-4 w-full">
        <UFormField label="Nom d'utilisateur" required>
          <UInput
            placeholder="Entrez votre nom d'utilisateur"
            class="w-full"
            v-model="form.username"
            size="lg"
          />
        </UFormField>

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
          label="S'inscrire"
          icon="lucide:user-plus"
          block
          class="mt-2"
          size="lg"
        />
      </form>
    </div>
  </div>
</template>
