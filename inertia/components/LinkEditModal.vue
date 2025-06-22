<script setup lang="ts">
import { reactive, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import type Link from '#models/link'

const props = defineProps<{ link: Link }>()

const form = reactive({
  id: props.link.id,
  name: props.link.name || '',
  targetUrl: props.link.targetUrl,
  domain: props.link.domain ? props.link.domain.label : '',
  slugCustom: props.link.slugCustom || props.link.slugAuto,
})

const domains = [
  { label: 'MonLien.fr', value: 'monlien.fr' },
  { label: 'LienCourt.com', value: 'liencourt.com' },
  { label: 'Exemple.io', value: 'exemple.io' },
]

const displayDomain = computed(() => {
  return form.domain || (typeof window !== 'undefined' ? window.location.hostname : '')
})

const handleSubmit = () => {
  router.patch('/links', form)
}
</script>

<template>
  <UModal title="Modifier le lien" description="Modifiez les détails de votre lien raccourci.">
    <template #body>
      <div class="flex flex-col gap-4 w-full">
        <UFormField label="URL de destination" required>
          <UInput
            icon="lucide:link"
            placeholder="https://example.com/mon-super-lien"
            class="w-full"
            v-model="form.targetUrl"
            size="lg"
          />
        </UFormField>

        <UFormField label="Nom du lien" hint="Optionnel">
          <UInput
            icon="lucide:tag"
            placeholder="Mon super lien"
            class="w-full"
            v-model="form.name"
            size="lg"
          />
        </UFormField>

        <UFormField label="Domaine" hint="Optionnel">
          <USelect
            v-model="form.domain"
            :items="domains"
            placeholder="Sélectionnez un domaine"
            class="w-full"
            icon="lucide:globe"
            size="lg"
          />
        </UFormField>

        <UFormField label="Slug personnalisé" hint="Optionnel">
          <UButtonGroup class="w-full">
            <UBadge color="neutral" variant="outline" size="lg" :label="displayDomain + '/'" />

            <UInput
              color="neutral"
              variant="outline"
              placeholder="mon-super-lien"
              class="w-full"
              size="lg"
              v-model="form.slugCustom"
            />
          </UButtonGroup>
        </UFormField>

        <div class="ml-auto">
          <UButton label="Sauvegarder les modifications" icon="lucide:save" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </UModal>
</template>
