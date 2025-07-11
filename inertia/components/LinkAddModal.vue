<script setup lang="ts">
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

const emit = defineEmits(['close'])

const domain = window.location.hostname

const form = reactive({
  name: '',
  targetUrl: '',
  domain: '',
  slugCustom: '',
})

const handleSubmit = () => {
  router.post('/links', form, {
    onSuccess: () => {
      form.name = ''
      form.targetUrl = ''
      form.domain = ''
      form.slugCustom = ''

      emit('close')
    },
  })
}
</script>

<template>
  <UModal
    title="Créer un nouveau lien"
    description="Raccourcissez votre URL et personnalisez-la selon vos besoins."
  >
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
          <UButton label="Créer le lien" icon="lucide:plus" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </UModal>
</template>
