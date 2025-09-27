<template>
  <div class="pdf-viewer-local">
    <!-- Controles de Upload -->
    <div class="upload-section">
      <input type="file" @change="loadPDF" accept=".pdf" ref="fileInput" style="display: none" />
      <q-btn @click="$refs.fileInput.click()" color="primary" icon="upload_file" label="Selecionar PDF"
        class="q-mb-md" />
    </div>

    <!-- PDF Viewer com controles nativos do navegador -->
    <div class="pdf-container" v-if="pdfUrl">
      <iframe :src="pdfUrl" class="pdf-iframe" frameborder="0" title="PDF Viewer" allowfullscreen></iframe>
    </div>

    <!-- Controles Extras -->
    <div class="extra-controls" v-if="pdfUrl">
      <q-btn @click="downloadPDF" color="positive" icon="download" label="Download" size="sm" class="q-mr-sm" />
      <q-btn @click="printPDF" color="secondary" icon="print" label="Imprimir" size="sm" class="q-mr-sm" />
      <q-btn @click="openInNewTab" color="info" icon="open_in_new" label="Nova Aba" size="sm" />
    </div>

    <!-- Mensagem quando nenhum PDF estiver carregado -->
    <div v-if="!pdfUrl" class="no-pdf">
      <q-icon name="picture_as_pdf" size="64px" color="grey-5" />
      <p class="text-grey-6 q-mt-md">
        Selecione um PDF para visualizar com controles nativos
      </p>
    </div>

    <!-- Fallback para navegador nativo -->
    <div v-if="showFallback" class="fallback-info">
      <q-banner class="bg-orange-2 text-orange-8">
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        Usando visualizador nativo do navegador como fallback
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const fileInput = ref(null);
const pdfUrl = ref("");
const currentFile = ref(null);
const showFallback = ref(false);

// URL do viewer local
const viewerUrl = computed(() => {
  if (!pdfUrl.value) return "";

  // Usar apenas o navegador nativo (sempre funciona)
  return pdfUrl.value;
});

const loadPDF = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  currentFile.value = file;
  pdfUrl.value = URL.createObjectURL(file);
  showFallback.value = false;
};

// Verificar se o viewer local está disponível
const checkViewerAvailable = async () => {
  try {
    const response = await fetch("/statics/pdfjs/viewer.html");
    if (!response.ok) {
      showFallback.value = true;
      return false;
    }
    return true;
  } catch (error) {
    showFallback.value = true;
    return false;
  }
};

// Download do PDF
const downloadPDF = () => {
  if (!currentFile.value) return;

  const url = URL.createObjectURL(currentFile.value);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentFile.value.name || "documento.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Imprimir PDF
const printPDF = () => {
  if (!currentFile.value) return;

  const url = URL.createObjectURL(currentFile.value);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 1000);
  };
};

// Abrir em nova aba
const openInNewTab = () => {
  if (!currentFile.value) return;

  const url = URL.createObjectURL(currentFile.value);
  window.open(url, "_blank");

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 5000);
};
</script>

<style scoped>
.pdf-viewer-local {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.upload-section {
  text-align: center;
  margin-bottom: 20px;
}

.pdf-container {
  width: 100%;
  height: 85vh;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.extra-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.no-pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  text-align: center;
}

.fallback-info {
  margin-top: 10px;
}

@media (max-width: 600px) {
  .pdf-viewer-local {
    padding: 10px;
  }

  .pdf-container {
    height: 70vh;
  }

  .extra-controls {
    flex-direction: column;
    align-items: center;
  }

  .extra-controls .q-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>