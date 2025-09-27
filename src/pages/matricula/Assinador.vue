<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-lg" bordered>
          <q-card-section>
            <div class="text-h5 q-mb-md">Assinatura Digital com Token A3</div>
          </q-card-section>

          <q-card-section>
            <!-- Upload do Documento -->
            <q-file
              v-model="selectedFile"
              label="Selecione o documento (PDF)"
              accept=".pdf"
              outlined
              clearable
              @input="onFileSelected"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <!-- Botão para Carregar Certificados -->
            <q-btn
              @click="loadCertificates"
              label="Carregar Certificados do Token"
              color="primary"
              icon="security"
              :loading="loadingCertificates"
              class="q-mb-md full-width"
            />

            <!-- Seleção de Certificados -->
            <q-select
              v-model="selectedCertificate"
              :options="certificateOptions"
              option-label="displayName"
              option-value="id"
              label="Selecione o Certificado"
              outlined
              clearable
              :disable="certificateOptions.length === 0"
              class="q-mb-md"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="verified_user" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.displayName }}</q-item-label>
                    <q-item-label caption>
                      Válido até: {{ scope.opt.validUntil }}
                    </q-item-label>
                    <q-item-label caption>
                      Emissor: {{ scope.opt.issuer }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum certificado carregado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- PIN do Token -->
            <q-input
              v-model="pin"
              label="PIN do Token"
              type="password"
              outlined
              class="q-mb-md"
              :rules="[(val) => !!val || 'PIN é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>

            <!-- Botão de Assinatura -->
            <q-btn
              @click="signDocument"
              label="Assinar Documento"
              color="positive"
              icon="draw"
              :loading="signing"
              :disable="!canSign"
              class="full-width"
              size="lg"
            />
          </q-card-section>
        </q-card>

        <!-- Card de Status -->
        <q-card v-if="statusMessage" class="q-mt-md">
          <q-card-section>
            <q-banner :class="statusClass" rounded>
              <template v-slot:avatar>
                <q-icon :name="statusIcon" />
              </template>
              {{ statusMessage }}
            </q-banner>
          </q-card-section>
        </q-card>

        <!-- Lista de Documentos Assinados -->
        <q-card v-if="signedDocuments.length > 0" class="q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Documentos Assinados</div>
            <q-list bordered separator>
              <q-item
                v-for="doc in signedDocuments"
                :key="doc.id"
                clickable
                @click="viewDocument(doc)"
              >
                <q-item-section avatar>
                  <q-icon name="description" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ doc.filename }}</q-item-label>
                  <q-item-label caption>
                    Assinado em: {{ formatDate(doc.signed_at) }}
                  </q-item-label>
                  <q-item-label caption>
                    Por: {{ doc.signer_name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    icon="verified"
                    color="green"
                    flat
                    round
                    @click.stop="verifySignature(doc.document_id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { http } from "boot/axios";
import AssijusService from "src/services/AssijusService";

export default {
  name: "SignaturePage",
  setup() {
    const $q = useQuasar();

    // Reactive data
    const selectedFile = ref(null);
    const selectedCertificate = ref(null);
    const pin = ref("");
    const certificateOptions = ref([]);
    const loadingCertificates = ref(false);
    const signing = ref(false);
    const statusMessage = ref("");
    const statusType = ref("info");
    const signedDocuments = ref([]);

    // Instância do serviço Assijus
    const assijusService = new AssijusService();

    // Computed
    const canSign = computed(() => {
      return (
        selectedFile.value &&
        selectedCertificate.value &&
        pin.value &&
        !signing.value
      );
    });

    const statusClass = computed(() => {
      const classes = {
        success: "bg-positive text-white",
        error: "bg-negative text-white",
        warning: "bg-warning text-white",
        info: "bg-info text-white",
      };
      return classes[statusType.value] || classes.info;
    });

    const statusIcon = computed(() => {
      const icons = {
        success: "check_circle",
        error: "error",
        warning: "warning",
        info: "info",
      };
      return icons[statusType.value] || icons.info;
    });

    // Methods
    const showStatus = (message, type = "info") => {
      statusMessage.value = message;
      statusType.value = type;
    };

    const onFileSelected = (file) => {
      if (file) {
        showStatus(`Arquivo selecionado: ${file.name}`, "success");
      }
    };

    const loadCertificates = async () => {
      loadingCertificates.value = true;
      showStatus("Carregando certificados do token...", "info");

      try {
        const certificates = await assijusService.detectCertificates();

        if (certificates.length === 0) {
          throw new Error(
            "Nenhum certificado encontrado. Verifique se o token A3 está conectado."
          );
        }

        certificateOptions.value = certificates.map((cert) => ({
          id: cert.id,
          displayName: cert.subject.split(",")[0].replace("CN=", ""),
          subject: cert.subject,
          thumbprint: cert.thumbprint,
          validUntil: cert.validUntil || "N/A",
          issuer: cert.issuer || "N/A",
          rawCert: cert,
        }));

        showStatus(
          `${certificates.length} certificado(s) encontrado(s)`,
          "success"
        );
      } catch (error) {
        showStatus(`Erro: ${error.message}`, "error");
        $q.notify({
          type: "negative",
          message: error.message,
          position: "top",
        });
      } finally {
        loadingCertificates.value = false;
      }
    };

    const signDocument = async () => {
      signing.value = true;
      showStatus("Assinando documento...", "info");

      try {
        // Validações
        if (!selectedFile.value) {
          throw new Error("Selecione um documento");
        }

        if (!selectedCertificate.value) {
          throw new Error("Selecione um certificado");
        }

        if (!pin.value) {
          throw new Error("Digite o PIN do token");
        }

        // Lê o arquivo
        const documentBytes = await readFileAsArrayBuffer(selectedFile.value);

        // Assina com o Assijus
        const signatureResult = await assijusService.signDocument({
          documentBytes,
          certificate: selectedCertificate.value.rawCert,
          pin: pin.value,
        });

        // Envia para o Laravel
        const response = await sendToLaravel({
          signature: signatureResult.signature,
          document: arrayBufferToBase64(documentBytes),
          certificate_thumbprint: selectedCertificate.value.thumbprint,
          certificate_subject: selectedCertificate.value.subject,
          filename: selectedFile.value.name,
        });

        if (response.data.success) {
          showStatus("Documento assinado com sucesso!", "success");

          // Adiciona à lista de documentos assinados
          signedDocuments.value.unshift(response.data.signed_document);

          // Limpa o formulário
          selectedFile.value = null;
          selectedCertificate.value = null;
          pin.value = "";

          $q.notify({
            type: "positive",
            message: "Documento assinado com sucesso!",
            position: "top",
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        showStatus(`Erro: ${error.message}`, "error");
        $q.notify({
          type: "negative",
          message: error.message,
          position: "top",
        });
      } finally {
        signing.value = false;
      }
    };

    const readFileAsArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    };

    const arrayBufferToBase64 = (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    const sendToLaravel = async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      return await http.post("/assijus-sign", formData);
    };

    const verifySignature = async (documentId) => {
      try {
        const response = await http.get(`/verify-signature/${documentId}`);

        $q.dialog({
          title: "Verificação de Assinatura",
          message: response.data.valid
            ? "Assinatura válida ✓"
            : "Assinatura inválida ✗",
          ok: true,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Erro ao verificar assinatura",
          position: "top",
        });
      }
    };

    const viewDocument = (doc) => {
      $q.dialog({
        title: "Informações do Documento",
        message: `
          Arquivo: ${doc.filename}
          Assinado por: ${doc.signer_name}
          Data: ${formatDate(doc.signed_at)}
        `,
        ok: true,
      });
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString("pt-BR");
    };

    const loadSignedDocuments = async () => {
      try {
        const response = await http.get("/signed-documents");
        signedDocuments.value = response.data.documents || [];
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
      }
    };

    onMounted(() => {
      loadSignedDocuments();
    });

    return {
      selectedFile,
      selectedCertificate,
      pin,
      certificateOptions,
      loadingCertificates,
      signing,
      statusMessage,
      statusClass,
      statusIcon,
      signedDocuments,
      canSign,
      onFileSelected,
      loadCertificates,
      signDocument,
      verifySignature,
      viewDocument,
      formatDate,
    };
  },
};
</script>

<style scoped>
.q-page {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  /* min-height: 100vh; */
}

.q-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}
</style>
