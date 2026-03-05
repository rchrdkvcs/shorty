<script setup lang="ts">
import { ref } from 'vue'
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
  createdAt: string
  updatedAt: string
}

interface Props {
  domains: Domain[]
  organizationId?: string
}

const props = defineProps<Props>()

const showCreateModal = ref(false)
const selectedDomain = ref<Domain | null>(null)
const showEditModal = ref(false)

const openCreateModal = () => {
  showCreateModal.value = true
}

const openEditModal = (domain: Domain) => {
  selectedDomain.value = domain
  showEditModal.value = true
}

const deleteDomain = async (domainId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
    return
  }

  // TODO: Implémenter la suppression
  console.log('Delete domain:', domainId)
}

const toggleDomainStatus = async (domainId: string) => {
  // TODO: Implémenter le toggle du statut
  console.log('Toggle domain status:', domainId)
}
</script>

<template>
  <Head title="Gestion des domaines" />

  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des domaines</h1>
        <p class="text-gray-600 mt-1">Gérez vos domaines personnalisés pour les liens raccourcis</p>
      </div>

      <UButton icon="lucide:plus" @click="openCreateModal" class="bg-blue-600 hover:bg-blue-700">
        Ajouter un domaine
      </UButton>
    </div>

    <!-- Liste des domaines -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="domains.length === 0" class="p-8 text-center">
        <UIcon name="lucide:globe" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun domaine</h3>
        <p class="text-gray-500 mb-4">Ajoutez votre premier domaine personnalisé pour commencer.</p>
        <UButton @click="openCreateModal" icon="lucide:plus"> Ajouter un domaine </UButton>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Domaine
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Organisation
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de création
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="domain in domains" :key="domain.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ domain.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ domain.label }}
                    </div>
                    <div v-if="domain.description" class="text-xs text-gray-400 mt-1">
                      {{ domain.description }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ domain.organization?.name || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge :color="domain.isActive ? 'green' : 'red'" variant="subtle">
                    {{ domain.isActive ? 'Actif' : 'Inactif' }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(domain.createdAt).toLocaleDateString('fr-FR') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="lucide:eye"
                      :to="`/dashboard/domains/${domain.id}`"
                    >
                      Voir
                    </UButton>
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="lucide:edit"
                      @click="openEditModal(domain)"
                    >
                      Modifier
                    </UButton>
                    <UButton
                      size="xs"
                      variant="ghost"
                      :icon="domain.isActive ? 'lucide:pause' : 'lucide:play'"
                      @click="toggleDomainStatus(domain.id)"
                    >
                      {{ domain.isActive ? 'Désactiver' : 'Activer' }}
                    </UButton>
                    <UButton
                      size="xs"
                      variant="ghost"
                      icon="lucide:trash-2"
                      color="red"
                      @click="deleteDomain(domain.id)"
                    >
                      Supprimer
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <!-- TODO: Implémenter les modals de création et d'édition -->
</template>
