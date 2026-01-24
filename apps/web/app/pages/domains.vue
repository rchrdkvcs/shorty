<script setup lang="ts">
import type { Domain } from "~/queries/domains";
import {
  useDomainsQuery,
  useDeleteDomainMutation,
  useVerifyDomainMutation,
} from "~/queries/domains";
import AddDomainModal from "~/components/modals/AddDomainModal.vue";
import { useClipboard } from "@vueuse/core";

const { data: domains, status } = useDomainsQuery();
const { copy, copied } = useClipboard();

const selectedDomain = ref<Domain | null>(null);

const overlay = useOverlay();
const addDomainModal = overlay.create(AddDomainModal);

const { mutate: deleteDomain, isLoading: isDeleting } =
  useDeleteDomainMutation();
const { mutate: verifyDomain, isLoading: isVerifying } =
  useVerifyDomainMutation();

const handleDeleteDomain = (id: string) => {
  deleteDomain(id);
  if (selectedDomain.value?.id === id) {
    selectedDomain.value = null;
  }
};

const handleVerifyDomain = (id: string) => {
  verifyDomain(id);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="My Domains">
        <template #right>
          <UButton
            icon="lucide:plus"
            label="Add Domain"
            @click="addDomainModal.open()"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Loading State -->
      <div v-if="status === 'pending'" class="space-y-3">
        <USkeleton v-for="i in 3" :key="i" class="h-24" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!domains?.length" class="text-center text-muted py-12">
        <UIcon name="lucide:globe" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="text-lg font-medium">No domains added yet</p>
        <p class="text-sm mb-4">
          Add a custom domain to use with your shortened links
        </p>
        <UButton
          icon="lucide:plus"
          label="Add Domain"
          @click="addDomainModal.open()"
        />
      </div>

      <!-- Domains List -->
      <div v-else class="space-y-3">
        <UCard
          v-for="domain in domains"
          :key="domain.id"
          variant="subtle"
          :ui="{ header: 'p-0!' }"
        >
          <template #header>
            <div
              class="flex items-center justify-between p-3 transition-all duration-200 ease-in-out"
              :class="[
                selectedDomain?.id === domain.id && 'bg-elevated',
                !domain.isVerified && 'cursor-pointer hover:bg-elevated',
              ]"
              @click="
                () => {
                  if (!domain.isVerified) {
                    selectedDomain =
                      selectedDomain?.id === domain.id ? null : domain;
                  }
                }
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 rounded-md bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <UIcon name="lucide:globe" class="size-6 text-primary" />
                </div>
                <div>
                  <p class="font-semibold">{{ domain.domain }}</p>
                  <p class="text-xs text-muted">
                    Added {{ formatDate(domain.createdAt) }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <UBadge
                  :color="domain.isVerified ? 'success' : 'warning'"
                  variant="subtle"
                >
                  {{ domain.isVerified ? "Verified" : "Pending" }}
                </UBadge>

                <UButton
                  v-if="!domain.isVerified"
                  icon="lucide:refresh-cw"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  :loading="isVerifying"
                  @click.stop="handleVerifyDomain(domain.id)"
                />

                <UButton
                  icon="lucide:trash-2"
                  variant="ghost"
                  color="error"
                  size="sm"
                  :loading="isDeleting"
                  @click.stop="handleDeleteDomain(domain.id)"
                />
              </div>
            </div>
          </template>

          <!-- Verification Instructions -->
          <template
            v-if="selectedDomain?.id === domain.id && !domain.isVerified"
            #default
          >
            <p class="text-sm font-medium">DNS Verification Required</p>
            <p class="text-sm text-muted">
              Add the following TXT record to your DNS settings to verify
              ownership:
            </p>

            <div class="bg-elevated rounded-lg p-3 space-y-2 mt-3">
              <div class="flex items-center text-sm gap-2">
                <span class="text-muted">Type:</span>
                <code class="bg-default px-2 py-0.5 rounded">TXT</code>
                <UButton
                  :icon="copied ? 'lucide:check-circle' : 'lucide:copy'"
                  variant="ghost"
                  size="sm"
                  @click="copy('TXT')"
                />
              </div>
              <div class="flex items-center text-sm gap-2">
                <span class="text-muted">Host:</span>
                <code class="bg-default px-2 py-0.5 rounded"
                  >_shorty-verification</code
                >
                <UButton
                  :icon="copied ? 'lucide:check-circle' : 'lucide:copy'"
                  variant="ghost"
                  size="sm"
                  @click="copy('_shorty-verification')"
                />
              </div>
              <div class="flex items-center text-sm gap-2">
                <span class="text-muted">Value:</span>
                <code class="bg-default px-2 py-1 rounded text-xs break-all">
                  shorty-verify={{ domain.verificationToken }}
                </code>
                <UButton
                  :icon="copied ? 'lucide:check-circle' : 'lucide:copy'"
                  variant="ghost"
                  size="sm"
                  @click="copy(`shorty-verify=${domain.verificationToken}`)"
                />
              </div>
            </div>

            <p class="text-xs text-muted mt-3">
              DNS changes may take up to 24-48 hours to propagate. Click the
              refresh button to check verification status.
            </p>
          </template>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
