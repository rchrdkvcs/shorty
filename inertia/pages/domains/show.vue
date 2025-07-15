<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

interface Domain {
  id: string
  name: string
  description?: string
  label: string
  isActive: boolean
  organizationId: string
  organization?: {
    id: string
    name: string
  }
  links?: Array<{
    id: string
    targetUrl: string
    slugAuto: string
    slugCustom?: string
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

interface Props {
  domain: Domain
}

const props = defineProps<Props>()
</script>

<template>
  <Head :title="`Domaine ${domain.name}`" />

  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center space-x-2 mb-2">
          <UButton variant="ghost" icon="lucide:arrow-left" to="/dashboard/domains" size="sm">
            Retour
          </UButton>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ domain.name }}</h1>
        <p class="text-gray-600 mt-1">{{ domain.label }}</p>
      </div>

      <div class="flex space-x-2">
        <UBadge :color="domain.isActive ? 'green' : 'red'" variant="subtle">
          {{ domain.isActive ? 'Actif' : 'Inactif' }}
        </UBadge>
        <UButton icon="lucide:edit" variant="outline"> Modifier </UButton>
      </div>
    </div>

    <!-- Informations du domaine -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informations</h3>
        <dl class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Nom</dt>
            <dd class="text-sm text-gray-900">{{ domain.name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Label</dt>
            <dd class="text-sm text-gray-900">{{ domain.label }}</dd>
          </div>
          <div v-if="domain.description">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="text-sm text-gray-900">{{ domain.description }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Organisation</dt>
            <dd class="text-sm text-gray-900">{{ domain.organization?.name || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Créé le</dt>
            <dd class="text-sm text-gray-900">
              {{ new Date(domain.createdAt).toLocaleDateString('fr-FR') }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
        <dl class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Nombre de liens</dt>
            <dd class="text-2xl font-bold text-gray-900">{{ domain.links?.length || 0 }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Statut</dt>
            <dd class="text-sm text-gray-900">
              <UBadge :color="domain.isActive ? 'green' : 'red'" variant="subtle">
                {{ domain.isActive ? 'Actif' : 'Inactif' }}
              </UBadge>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Liens récents -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Liens récents</h3>
      </div>

      <div v-if="!domain.links || domain.links.length === 0" class="p-6 text-center">
        <UIcon name="lucide:link" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun lien</h3>
        <p class="text-gray-500">Aucun lien n'a encore été créé avec ce domaine.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                URL de destination
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Slug
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date de création
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="link in domain.links" :key="link.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 truncate max-w-xs">
                  {{ link.targetUrl }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ link.slugCustom || link.slugAuto }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(link.createdAt).toLocaleDateString('fr-FR') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
