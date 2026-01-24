<script setup lang="ts">
import QRCode from "qrcode";
import {
  useCreateQrCodeMutation,
  useDeleteQrCodeMutation,
  useUpdateQrCodeMutation,
} from "~/queries/qr-codes";

const props = defineProps<{
  linkId: string;
  url: string;
  qrCodeId?: string;
  initialData?: {
    name: string;
    foregroundColor: string;
    backgroundColor: string;
    logoUrl: string | null;
    size: number;
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    logoSize: number | null;
    roundedCorners: boolean;
  };
}>();

const emit = defineEmits<{
  saved: [];
  updated: [];
  deleted: [];
}>();

const qrGenerator = ref<any>(null);
const isSaving = ref(false);
const isDeleting = ref(false);

const isEditMode = computed(() => !!props.qrCodeId);

const formData = reactive({
  name: props.initialData?.name || "",
  foregroundColor: props.initialData?.foregroundColor || "#000000",
  backgroundColor: props.initialData?.backgroundColor || "#ffffff",
  logoUrl: props.initialData?.logoUrl || "",
  size: props.initialData?.size || 300,
  errorCorrectionLevel:
    props.initialData?.errorCorrectionLevel || ("M" as "L" | "M" | "Q" | "H"),
  logoSize: props.initialData?.logoSize || 50,
  roundedCorners: props.initialData?.roundedCorners || false,
});

const createMutation = useCreateQrCodeMutation();
const updateMutation = useUpdateQrCodeMutation();
const deleteMutation = useDeleteQrCodeMutation();

const saveQrCode = async () => {
  if (!formData.name) {
    alert("Veuillez entrer un nom pour le QR code");
    return;
  }

  isSaving.value = true;
  try {
    await createMutation.mutateAsync({
      linkId: props.linkId,
      name: formData.name,
      foregroundColor: formData.foregroundColor,
      backgroundColor: formData.backgroundColor,
      logoUrl: formData.logoUrl || null,
      size: formData.size,
      errorCorrectionLevel: formData.errorCorrectionLevel,
      logoSize: formData.logoSize,
      roundedCorners: formData.roundedCorners,
    });
    emit("saved");
  } catch (error) {
    console.error("Error saving QR code:", error);
    alert("Erreur lors de l'enregistrement du QR code");
  } finally {
    isSaving.value = false;
  }
};

const updateQrCode = async () => {
  if (!props.qrCodeId || !formData.name) {
    alert("Veuillez entrer un nom pour le QR code");
    return;
  }

  isSaving.value = true;
  try {
    await updateMutation.mutateAsync({
      id: props.qrCodeId,
      name: formData.name,
      foregroundColor: formData.foregroundColor,
      backgroundColor: formData.backgroundColor,
      logoUrl: formData.logoUrl || null,
      size: formData.size,
      errorCorrectionLevel: formData.errorCorrectionLevel,
      logoSize: formData.logoSize,
      roundedCorners: formData.roundedCorners,
    });
    emit("updated");
  } catch (error) {
    console.error("Error updating QR code:", error);
    alert("Erreur lors de la mise à jour du QR code");
  } finally {
    isSaving.value = false;
  }
};

const deleteQrCode = async () => {
  if (!props.qrCodeId) return;

  if (!confirm("Êtes-vous sûr de vouloir supprimer ce QR code ?")) {
    return;
  }

  isDeleting.value = true;
  try {
    await deleteMutation.mutateAsync(props.qrCodeId);
    emit("deleted");
  } catch (error) {
    console.error("Error deleting QR code:", error);
    alert("Erreur lors de la suppression du QR code");
  } finally {
    isDeleting.value = false;
  }
};

const downloadQrCode = async () => {
  if (!qrGenerator.value?.canvas) return;

  try {
    const canvas = qrGenerator.value.canvas as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qr-code-${formData.name || "download"}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error downloading QR code:", error);
    alert("Erreur lors du téléchargement du QR code");
  }
};

const downloadQrCodeSvg = async () => {
  try {
    const svg = await QRCode.toString(props.url, {
      type: "svg",
      errorCorrectionLevel: formData.errorCorrectionLevel,
      color: {
        dark: formData.foregroundColor,
        light: formData.backgroundColor,
      },
      margin: 1,
      width: formData.size,
    });

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qr-code-${formData.name || "download"}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading SVG:", error);
    alert("Erreur lors du téléchargement du SVG");
  }
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- QR Code Preview -->
    <div class="flex flex-col items-center gap-4">
      <UCard class="w-full">
        <template #header>
          <h3 class="text-lg font-semibold">Preview</h3>
        </template>

        <div class="flex flex-col items-center gap-4 py-8">
          <QrCodeGenerator
            ref="qrGenerator"
            :url="url"
            :foreground-color="formData.foregroundColor"
            :background-color="formData.backgroundColor"
            :logo-url="formData.logoUrl"
            :size="formData.size"
            :error-correction-level="formData.errorCorrectionLevel"
            :logo-size="formData.logoSize"
            :rounded-corners="formData.roundedCorners"
          />

          <div class="flex gap-2 w-full">
            <UButton
              icon="i-lucide-download"
              color="primary"
              block
              @click="downloadQrCode"
            >
              Télécharger PNG
            </UButton>
            <UButton
              icon="i-lucide-file-text"
              color="white"
              block
              @click="downloadQrCodeSvg"
            >
              Télécharger SVG
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Customization Form -->
    <div class="flex flex-col gap-4">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Personnalisation</h3>
        </template>

        <div class="flex flex-col gap-4">
          <!-- Name -->
          <UFormField label="Nom du QR Code" name="name" required>
            <UInput v-model="formData.name" placeholder="Mon QR Code" />
          </UFormField>

          <!-- Colors -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Couleur principale" name="foregroundColor">
              <div class="flex gap-2">
                <input
                  v-model="formData.foregroundColor"
                  type="color"
                  class="w-12 h-10 rounded cursor-pointer"
                />
                <UInput
                  v-model="formData.foregroundColor"
                  placeholder="#000000"
                  class="flex-1"
                />
              </div>
            </UFormField>

            <UFormField label="Couleur de fond" name="backgroundColor">
              <div class="flex gap-2">
                <input
                  v-model="formData.backgroundColor"
                  type="color"
                  class="w-12 h-10 rounded cursor-pointer"
                />
                <UInput
                  v-model="formData.backgroundColor"
                  placeholder="#ffffff"
                  class="flex-1"
                />
              </div>
            </UFormField>
          </div>

          <!-- Size -->
          <UFormField label="Taille (px)" name="size">
            <UInput
              v-model.number="formData.size"
              type="number"
              min="100"
              max="1000"
              placeholder="300"
            />
          </UFormField>

          <!-- Error Correction Level -->
          <UFormField
            label="Niveau de correction d'erreur"
            name="errorCorrectionLevel"
            hint="Un niveau plus élevé permet d'ajouter un logo plus grand"
          >
            <USelect
              v-model="formData.errorCorrectionLevel"
              :options="[
                { label: 'L (7%)', value: 'L' },
                { label: 'M (15%)', value: 'M' },
                { label: 'Q (25%)', value: 'Q' },
                { label: 'H (30%)', value: 'H' },
              ]"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormField>

          <!-- Logo URL -->
          <UFormField
            label="URL du logo (optionnel)"
            name="logoUrl"
            hint="URL d'une image à afficher au centre du QR code"
          >
            <UInput
              v-model="formData.logoUrl"
              placeholder="https://example.com/logo.png"
            />
          </UFormField>

          <!-- Logo Size -->
          <UFormField
            v-if="formData.logoUrl"
            label="Taille du logo (px)"
            name="logoSize"
          >
            <UInput
              v-model.number="formData.logoSize"
              type="number"
              min="10"
              max="200"
              placeholder="50"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <UButton
          v-if="!isEditMode"
          icon="i-lucide-save"
          color="primary"
          block
          :loading="isSaving"
          @click="saveQrCode"
        >
          Enregistrer
        </UButton>
        <UButton
          v-else
          icon="i-lucide-save"
          color="primary"
          block
          :loading="isSaving"
          @click="updateQrCode"
        >
          Mettre à jour
        </UButton>
        <UButton
          v-if="isEditMode"
          icon="i-lucide-trash-2"
          color="red"
          variant="outline"
          :loading="isDeleting"
          @click="deleteQrCode"
        >
          Supprimer
        </UButton>
      </div>
    </div>
  </div>
</template>
