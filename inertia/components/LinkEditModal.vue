<script setup lang="ts">
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import type Link from '#models/link'

const props = defineProps<{ link: Link }>()

const emit = defineEmits(['close'])

const domain = window.location.hostname

const form = reactive({
  id: props.link.id,
  name: props.link.name || '',
  targetUrl: props.link.targetUrl,
  domain: props.link.domain ? props.link.domain.label : '',
  slugCustom: props.link.slugCustom || props.link.slugAuto,
})

const handleSubmit = () => {
  router.patch(`/links/${props.link.id}`, form, {
    onSuccess: () => {
      emit('close')
    },
  })
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

        <UFormField label="Slug personnalisé" hint="Optionnel">
          <UButtonGroup class="w-full">
            <UBadge color="neutral" variant="outline" size="lg" :label="domain + '/'" />

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
