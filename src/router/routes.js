const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "tarefas",
        meta: {
          title: "Tarefas",
          publico: false,
        },
      },

      {
        path: "doi",
        component: () => import("pages/doi/Index.vue"),
        name: "doi.index",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      {
        path: "doi/lote",
        component: () => import("pages/lote/Index.vue"),
        name: "lote.index",
        meta: {
          title: "Lotes DOI",
          publico: false,
        },
      },

      {
        path: "caixa",
        component: () => import("pages/caixa/Index.vue"),
        name: "caixa",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      // {
      //   path: "/administracao/tabela-custa",
      //   component: () => import("src/pages/tabela-custa/Index.vue"),
      //   name: "tabela-custa.index",
      //   meta: {
      //     title: "Tabela de Custas",
      //     publico: false,
      //   },
      // },
      // {
      //   path: "/administracao/tabela-custa/atos/:tabelaCustaId",
      //   component: () => import("src/pages/tabela-custa/Index.vue"),
      //   name: "tabela-custa.editar",
      //   meta: {
      //     title: "Tabela de Custas",
      //     publico: false,
      //   },
      // },

      {
        path: "caixa/movimento",
        component: () => import("pages/movimento-caixa/Index.vue"),
        name: "movimento-caixa",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      {
        path: "transacao",
        component: () => import("pages/transacao/Index.vue"),
        name: "transacao",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      {
        path: "configuracao",
        component: () => import("src/pages/configuracao/Index.vue"),
        name: "configuracao.index",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
        children: [
          // Redirect padrão para cartório
          {
            path: "",
            redirect: { name: "configuracao.cartorio" },
            name: "configuracao.redicionado",
          },

          // Configurações do Cartório
          {
            path: "cartorio",
            component: () => import("pages/configuracao/cartorio/Index.vue"),
            name: "configuracao.cartorio",
          },

          // Portal de Estatísticas
          {
            path: "estatistica",
            component: () => import("pages/configuracao/estatistica/Index.vue"),
            name: "configuracao.estatistica",
          },

          // DOI - Declaração sobre Operações Imobiliárias
          {
            path: "doi",
            component: () => import("pages/configuracao/doi/Index.vue"),
            name: "configuracao.doi",
          },

          // Centrais
          {
            path: "centrais",
            component: () => import("pages/configuracao/centrais/Index.vue"),
            name: "configuracao.centrais",
          },

          // Financeiro
          // {
          //   path: "financeiro",
          //   component: () => import("pages/configuracao/financeiro/Index.vue"),
          //   name: "configuracao.financeiro",
          // },

          // E-mail & WhatsApp
          {
            path: "email",
            component: () => import("pages/configuracao/email/Index.vue"),
            name: "configuracao.email",
          },

          // Selo
          // {
          //   path: "selo",
          //   component: () => import("pages/configuracao/selo/Index.vue"),
          //   name: "configuracao.selo",
          // },

          // // Indisponibilidade
          // {
          //   path: "indisponibilidade",
          //   component: () =>
          //     import("pages/configuracao/indisponibilidade/Index.vue"),
          //   name: "configuracao.indisponibilidade",
          // },

          // Atendimento
          // {
          //   path: "atendimento",
          //   component: () => import("pages/configuracao/atendimento/Index.vue"),
          //   name: "configuracao.atendimento",
          // },

          // ONR - Certidão
          // {
          //   path: "onr/certidao",
          //   component: () =>
          //     import("pages/configuracao/onr/certidao/Index.vue"),
          //   name: "configuracao.onr.certidao.index",
          // },

          // ONR - E-Protocolo (dentro de centrais)
          // {
          //   path: "centrais/onr/eprotocolo",
          //   component: () =>
          //     import("pages/configuracao/centrais/onr/eprotocolo/Index.vue"),
          //   name: "configuracao.centrais.onr.eprotocolo.index",
          // },
        ],
      },

      // NATUREZA
      {
        path: "administracao/natureza",
        component: () => import("src/pages/natureza/Index.vue"),
        name: "natureza.index",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      {
        path: "matricula",
        component: () => import("src/pages/matricula/Index.vue"),
        name: "matricula.index",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          publico: false,
        },
      },

      // PROTOCOLO
      {
        path: "/protocolo/:id",
        name: "protocolo.index",
        meta: {
          title: "Declaração sobre Operações Imobiliárias",
          requiresAuth: true,
        },
        props: true,
        component: () => import("pages/protocolo/Index.vue"),

        children: [
          {
            path: "",
            redirect: (to) => {
              const id = to.params.id;
              return { name: "protocolo.geral", params: { id } };
            },
            name: "protocolo.redirect",
          },
          {
            path: "/protocolo/:id/geral",
            name: "protocolo.geral",
            props: true,
            meta: { title: "Protocolo - Geral" },
            component: () => import("pages/protocolo/geral/Index.vue"),
          },

          // {
          //   path: "/protocolo/:id/atos",
          //   name: "protocolo.atos",
          //   props: true,
          //   meta: { title: "Protocolo - Atos" },
          //   component: () => import("pages/protocolo/atos/Index.vue"),
          // },

          // {
          //   path: "/protocolo/:id/financeiro",
          //   name: "protocolo.financeiro",
          //   props: true,
          //   meta: { title: "Protocolo - Financeiro" },
          //   component: () => import("pages/protocolo/financeiro/Index.vue"),
          // },
        ],
      },

      // ADMINISTRAÇÃO
      {
        path: "administracao",
        component: () => import("src/pages/administracao/Index.vue"),
        name: "administracao.index",
        meta: {
          title: "Administração",
          publico: false,
        },
        children: [
          {
            path: "tabela-custa",
            name: "administracao.tabela-custa.index",
            component: () =>
              import("src/pages/administracao/tabela-custa/Index.vue"),
            meta: {
              title: "Tabelas de Custas",
              publico: false,
            },
          },
          {
            path: "tabela-custa/:tabelaCustaId/atos",
            name: "administracao.tabela-custa.atos.index",
            component: () =>
              import("src/pages/administracao/tabela-custa/atos/Index.vue"),
            props: true,
            meta: {
              title: "Atos da Tabela de Custas",
              publico: false,
            },
          },
        ],
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/autenticacao/login/Index.vue"),
        name: "login",
        meta: {
          publico: true,
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
