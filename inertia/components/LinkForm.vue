<script setup lang="ts">
import { reactive, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import type Link from '#models/link'
import type Organization from '#models/organization'
import type Domain from '#models/domain'

interface Props {
  link?: Link
  mode: 'create' | 'edit'
  availableDomains?: Domain[]
  organizations?: Organization[]
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits(['close', 'success'])

const domain = window.location.hostname

const form = reactive({
  id: props.link?.id || '',
  name: props.link?.name || '',
  targetUrl: props.link?.targetUrl || '',
  domainId: props.link?.domainId || '',
  organizationId: props.link?.organizationId || props.organizations?.[0]?.id || '',
  slugCustom: props.link?.slugCustom || (props.mode === 'edit' ? props.link?.slugAuto : '') || '',
  category: props.link?.category || '',
  tags: Array.isArray(props.link?.tags) ? props.link.tags.join(', ') : '',
})

const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() => (isEditMode.value ? 'Modifier le lien' : 'Créer un nouveau lien'))

const modalDescription = computed(() =>
  isEditMode.value
    ? 'Modifiez les détails de votre lien raccourci.'
    : 'Raccourcissez votre URL et personnalisez-la selon vos besoins.'
)

const submitButtonLabel = computed(() =>
  isEditMode.value ? 'Sauvegarder les modifications' : 'Créer le lien'
)

const submitButtonIcon = computed(() => (isEditMode.value ? 'lucide:save' : 'lucide:plus'))

const handleSubmit = () => {
  const url = isEditMode.value ? `/links/${props.link!.id}` : '/links'
  const method = isEditMode.value ? 'patch' : 'post'

  const submitData = {
    ...form,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }

  router[method](url, submitData, {
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
  form.targetUrl = ''
  form.domainId = ''
  form.organizationId = props.organizations?.[0]?.id || ''
  form.slugCustom = ''
  form.category = ''
  form.tags = ''
}
</script>

<template>
  <UModal :title="modalTitle" :description="modalDescription">
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

        <UFormField label="Organisation" required>
          <USelect
            icon="lucide:building"
            placeholder="Sélectionner une organisation"
            :items="organizations?.map((org) => ({ label: org.name, value: org.id })) || []"
            v-model="form.organizationId"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField label="Domaine" hint="Optionnel">
          <USelect
            icon="lucide:globe"
            placeholder="Domaine par défaut"
            :items="
              availableDomains?.map((domain) => ({ label: domain.label, value: domain.id })) || []
            "
            v-model="form.domainId"
            class="w-full"
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

        <UFormField label="Catégorie" hint="Optionnel">
          <UInput
            icon="lucide:folder"
            placeholder="Marketing, Personnel, etc."
            class="w-full"
            v-model="form.category"
            size="lg"
          />
        </UFormField>

        <UFormField label="Tags" hint="Optionnel, séparés par des virgules">
          <UInput
            icon="lucide:tag"
            placeholder="marketing, social, urgent"
            class="w-full"
            v-model="form.tags"
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
