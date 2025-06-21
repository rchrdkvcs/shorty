<script setup lang="ts">
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

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
  <form @submit.prevent="submit">
    <div>
      <label>Username</label>
      <input v-model="form.username" type="text" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="form.email" type="text" />
    </div>

    <div>
      <label>Password</label>
      <input v-model="form.password" type="text" />
    </div>

    <button type="submit" class="p-2 bg-muted">Register</button>
  </form>
</template>
