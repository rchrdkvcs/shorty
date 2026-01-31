<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>

    <template #body>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-semibold">Bienvenue sur Shorty</h1>
          <p class="text-muted">Gérez vos liens raccourcis et suivez leurs performances</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-4">
          <UCard variant="subtle">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:link" class="size-6 text-primary" />
                <h3 class="font-semibold">Mes liens</h3>
              </div>
              <p class="text-sm text-muted mb-2">Créez et gérez vos liens raccourcis</p>
              <UButton to="/dashboard/links" variant="soft" size="sm">
                Voir mes liens
                <UIcon name="lucide:arrow-right" class="ml-2" />
              </UButton>
            </div>
          </UCard>

          <UCard variant="subtle">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:bar-chart-3" class="size-6 text-primary" />
                <h3 class="font-semibold">Analytics</h3>
              </div>
              <p class="text-sm text-muted mb-2">Suivez les performances de vos liens</p>
              <UButton to="/dashboard/analytics" variant="soft" size="sm">
                Voir les analytics
                <UIcon name="lucide:arrow-right" class="ml-2" />
              </UButton>
            </div>
          </UCard>

          <UCard variant="subtle">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:globe" class="size-6 text-primary" />
                <h3 class="font-semibold">Domaines</h3>
              </div>
              <p class="text-sm text-muted mb-2">Gérez vos domaines personnalisés</p>
              <UButton to="/dashboard/domains" variant="soft" size="sm">
                Gérer les domaines
                <UIcon name="lucide:arrow-right" class="ml-2" />
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
