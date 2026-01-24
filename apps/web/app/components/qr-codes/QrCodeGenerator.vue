<script setup lang="ts">
import QRCode from "qrcode";

const props = defineProps<{
  url: string;
  foregroundColor?: string;
  backgroundColor?: string;
  logoUrl?: string | null;
  size?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  logoSize?: number | null;
  roundedCorners?: boolean;
}>();

const qrCanvas = ref<HTMLCanvasElement | null>(null);
const logoDataUrl = ref<string | null>(null);

const logoStyle = computed(() => {
  const size = props.logoSize || 50;
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "4px",
    backgroundColor: props.backgroundColor || "#ffffff",
    padding: "4px",
  };
});

const generateQrCode = async () => {
  if (!qrCanvas.value || !props.url) return;

  try {
    const options = {
      errorCorrectionLevel: props.errorCorrectionLevel || "M",
      width: props.size || 300,
      color: {
        dark: props.foregroundColor || "#000000",
        light: props.backgroundColor || "#ffffff",
      },
      margin: 1,
    };

    await QRCode.toCanvas(qrCanvas.value, props.url, options);

    // Load logo if provided
    if (props.logoUrl) {
      loadLogo(props.logoUrl);
    } else {
      logoDataUrl.value = null;
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

const loadLogo = (url: string) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    logoDataUrl.value = url;
  };
  img.onerror = () => {
    console.error("Error loading logo");
    logoDataUrl.value = null;
  };
  img.src = url;
};

// Watch for prop changes and regenerate QR code
watch(
  () => [
    props.url,
    props.foregroundColor,
    props.backgroundColor,
    props.size,
    props.errorCorrectionLevel,
    props.logoUrl,
    props.logoSize,
  ],
  () => {
    generateQrCode();
  },
  { immediate: true },
);

defineExpose({
  canvas: qrCanvas,
  regenerate: generateQrCode,
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="relative p-4 rounded-lg"
      :style="{ backgroundColor: backgroundColor }"
    >
      <canvas ref="qrCanvas" />
      <img
        v-if="logoUrl && logoDataUrl"
        :src="logoDataUrl"
        alt="QR Code Logo"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        :style="logoStyle"
      />
    </div>
  </div>
</template>
