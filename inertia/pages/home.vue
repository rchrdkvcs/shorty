<script setup lang="ts">
import type Link from '#models/link'
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

defineProps<{
  links: Link[]
}>()

const form = reactive({
  name: '',
  slugCustom: '',
  targetUrl: '',
  category: '',
  tags: '',
})

const customDomainForm = reactive({
  name: '',
  description: '',
  label: '',
})

function submit() {
  router.post('/links', form)
}

function submitCustomDomain() {
  router.post('/domains', customDomainForm)
}

function getLinkName(link: Link): string {
  if (link.name) {
    return link.name
  } else if (link.slugCustom) {
    return link.slugCustom
  } else {
    return link.slugAuto
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Home Page</h1>
    <form @submit.prevent="submit">
      <div>
        <label>Slug Custom</label>
        <input v-model="form.slugCustom" type="text" />
      </div>

      <div>
        <label>Nom</label>
        <input v-model="form.name" type="text" />
      </div>

      <div>
        <label>Target URL</label>
        <input v-model="form.targetUrl" type="url" required />
      </div>

      <button type="submit" class="p-2 bg-muted">Créer le lien</button>
    </form>

    <form @submit.prevent="submitCustomDomain" class="mt-8">
      <div>
        <label>Nom</label>
        <input v-model="customDomainForm.name" type="text" />
      </div>

      <div>
        <label>Description</label>
        <input v-model="customDomainForm.description" type="text" />
      </div>

      <div>
        <label>Label</label>
        <input v-model="customDomainForm.label" type="text" />
      </div>

      <button type="submit" class="p-2 bg-muted">Créer le domaine personnalisé</button>
    </form>

    <ul v-if="links.length > 0" class="mt-4">
      <li v-for="link in links" :key="link.id" class="mb-2 flex items-center">
        <a :href="link.targetUrl" class="text-blue-500 hover:underline">{{ getLinkName(link) }}</a>
        <span class="ml-2 text-gray-500">({{ link.slugAuto }})</span>
        <span v-if="link.slugCustom" class="ml-2">{{ link.slugCustom }}</span>
        <span v-if="link.category" class="ml-2 text-yellow-500">Category: {{ link.category }}</span>
        <span v-if="link.tags" class="ml-2 text-purple-500">Tags: {{ link.tags.join(', ') }}</span>
      </li>
    </ul>
    <p v-else class="text-gray-500 mt-4">No links available.</p>
  </div>
</template>
