<script setup lang="ts">
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

const form = reactive({
  email: '',
  password: '',
})

function submit() {
  router.post('/login', form)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <label>Email</label>
      <input v-model="form.email" type="text" />
    </div>

    <div>
      <label>Password</label>
      <input v-model="form.password" type="text" />
    </div>

    <button type="submit" class="p-2 bg-muted">Se connecter</button>
  </form>
</template>
