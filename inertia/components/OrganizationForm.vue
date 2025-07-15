<script setup lang="ts">
import { reactive, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import type Organization from '#models/organization'

interface Props {
  organization?: Organization
  mode: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits(['close', 'success'])

const form = reactive({
  id: props.organization?.id || '',
  name: props.organization?.name || '',
  description: props.organization?.description || '',
  logoUrl: props.organization?.logoUrl || '',
})

const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() =>
  isEditMode.value ? "Modifier l'organisation" : 'Créer une nouvelle organisation'
)

const modalDescription = computed(() =>
  isEditMode.value
    ? 'Modifiez les détails de votre organisation.'
    : 'Créez une nouvelle organisation pour organiser vos liens et domaines.'
)

const submitButtonLabel = computed(() =>
  isEditMode.value ? 'Sauvegarder les modifications' : "Créer l'organisation"
)

const submitButtonIcon = computed(() => (isEditMode.value ? 'lucide:save' : 'lucide:plus'))

const handleSubmit = () => {
  const url = isEditMode.value ? `/organizations/${props.organization!.id}` : '/organizations'
  const method = isEditMode.value ? 'patch' : 'post'

  router[method](url, form, {
    onSuccess: () => {
      if (!isEditMode.value) {
        resetForm()
      }
      emit('success')
      emit('close')
    },
    onError: (errors) => {
      console.error('Form submission errors:', errors)
    },
  })
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.logoUrl = ''
}
</script>

<template>
  <UModal :title="modalTitle" :description="modalDescription">
    <template #body>
      <div class="flex flex-col gap-4 w-full">
        <UFormField label="Nom de l'organisation" required>
          <UInput
            icon="lucide:building"
            placeholder="Mon Entreprise"
            class="w-full"
            v-model="form.name"
            size="lg"
          />
        </UFormField>

        <UFormField label="Description" hint="Optionnel">
          <UTextarea
            placeholder="Description de l'organisation..."
            class="w-full"
            v-model="form.description"
            :rows="3"
            resize
          />
        </UFormField>

        <UFormField label="URL du logo" hint="Optionnel">
          <UInput
            icon="lucide:image"
            placeholder="https://example.com/logo.png"
            class="w-full"
            v-model="form.logoUrl"
            size="lg"
          />
        </UFormField>

        <div class="ml-auto">
          <UButton :label="submitButtonLabel" :icon="submitButtonIcon" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </UModal>
</template>
