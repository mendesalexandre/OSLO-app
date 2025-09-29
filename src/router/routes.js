const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "home",
      },

      {
        path: "configuracao",
        component: () => import("src/pages/configuracao/Index.vue"),
        name: "configuracao.index",
        children: [
          // Redirect padrão para cartório
          {
            path: "",
            redirect: { name: "configuracao.cartorio" },
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
      },

      {
        path: "matricula",
        component: () => import("src/pages/matricula/Index.vue"),
        name: "matricula.index",
      },

      // PROTOCOLO
      {
        path: "/protocolo/:id",
        name: "protocolo.index",
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
        name: "matricula.index",
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
        name: "home",
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
