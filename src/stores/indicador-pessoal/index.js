import { defineStore, acceptHMRUpdate } from "pinia";

export const useIndicadorPessoal = defineStore("indicador-pessoal", {
  state: () => ({
    indicadorPessoal: {
      // Dados Pessoais
      id: null,
      nome: "",
      is_ativo: true,
      tipo_pessoa_id: "PESSOA_FISICA",
      cpf_cnpj: "",
      data_nascimento: null,
      email: "",
      passaporte: "",
      rg: "",
      cnh: "",
      identidade_profissional: "",

      // SISCOAF
      pessoa_falecida: false,
      menor_idade: false,
      incapaz: false,
      pessoa_politicamente_exposta: false,
      servidor_publico: false,
      pessoa_obrigada: false,

      // Dados de Contato
      telefone: "",
      celular: "",

      // Estado Civil
      estado_civil_id: null,
      regime_casamento_id: null,
      data_casamento: null,
      data_divorcio: null,
      conjuge: {
        codigo: "",
        nome: "",
        registro_civil_id: null,
        livro: "",
        folhas: "",
      },

      // Filiação
      nome_mae: "",
      pai_desconhecido: false,
      nome_pai: "",

      // Profissão
      profissao_id: null,

      // Endereço
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        complemento: "",
        estado_id: null,
        cidade_id: null,
        pais_id: null,
      },
    },
  }),

  getters: {
    // Getter para máscara de CPF/CNPJ
    mascaraCpfCnpj: (state) => {
      return state.indicadorPessoal.tipo_pessoa_id === 1
        ? "###.###.###-##"
        : "##.###.###/####-##";
    },

    // Verifica se o formulário é válido
    formularioValido: (state) => {
      const { nome, tipo_pessoa_id, cpf_cnpj } = state.indicadorPessoal;
      return !!(nome && tipo_pessoa_id && cpf_cnpj);
    },
  },

  actions: {
    // Reseta o formulário
    resetarFormulario() {
      this.indicadorPessoal = {
        id: null,
        nome: "",
        ativo: true,
        tipo_pessoa_id: null,
        cpf_cnpj: "",
        data_nascimento: null,
        email: "",
        passaporte: "",
        rg: "",
        cnh: "",
        identidade_profissional: "",
        pessoa_falecida: false,
        menor_idade: false,
        incapaz: false,
        pessoa_politicamente_exposta: false,
        servidor_publico: false,
        pessoa_obrigada: false,
        telefone: "",
        celular: "",
        estado_civil_id: null,
        regime_casamento_id: null,
        data_casamento: null,
        data_divorcio: null,
        conjuge: {
          codigo: "",
          nome: "",
          registro_civil_id: null,
          livro: "",
          folhas: "",
        },
        nome_mae: "",
        pai_desconhecido: false,
        nome_pai: "",
        profissao_id: null,
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          bairro: "",
          complemento: "",
          estado_id: null,
          cidade_id: null,
          pais_id: null,
        },
      };
    },

    // Preenche dados do CEP
    preencherEnderecoCep(dadosCep) {
      this.indicadorPessoal.endereco.logradouro = dadosCep.logradouro || "";
      this.indicadorPessoal.endereco.bairro = dadosCep.bairro || "";
      this.indicadorPessoal.endereco.complemento = dadosCep.complemento || "";
    },

    // Salvar indicador (placeholder - implementar lógica de API)
    async salvar() {
      try {
        // Implementar chamada à API
        console.log("Salvando indicador:", this.indicadorPessoal);
        return { success: true };
      } catch (error) {
        console.error("Erro ao salvar indicador:", error);
        throw error;
      }
    },

    // Carregar indicador por ID (placeholder)
    async carregar(id) {
      try {
        // Implementar chamada à API
        console.log("Carregando indicador:", id);
      } catch (error) {
        console.error("Erro ao carregar indicador:", error);
        throw error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIndicadorPessoal, import.meta.hot));
}
