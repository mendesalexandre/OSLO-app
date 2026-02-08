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
          permissao: ["DOI_LISTAR"],
        },
      },

      {
        path: "doi/lote",
        component: () => import("pages/lote/Index.vue"),
        name: "lote.index",
        meta: {
          title: "Lotes DOI",
          publico: false,
          permissao: ["DOI_LISTAR"],
        },
      },

      {
        path: "caixa",
        component: () => import("pages/caixa/Index.vue"),
        name: "caixa",
        meta: {
          title: "Caixa",
          publico: false,
          permissao: ["CAIXA_LISTAR"],
        },
      },

      {
        path: "caixa/movimento",
        component: () => import("pages/movimento-caixa/Index.vue"),
        name: "movimento-caixa",
        meta: {
          title: "Movimento de Caixa",
          publico: false,
          permissao: ["CAIXA_MOVIMENTO_LISTAR"],
        },
      },

      {
        path: "transacao",
        component: () => import("pages/transacao/Index.vue"),
        name: "transacao",
        meta: {
          title: "Transações",
          publico: false,
          permissao: ["TRANSACAO_LISTAR"],
        },
      },

      {
        path: "configuracao",
        component: () => import("src/pages/configuracao/Index.vue"),
        name: "configuracao.index",
        meta: {
          title: "Configurações",
          publico: false,
          permissao: ["CONFIGURACAO_LISTAR"],
        },
        children: [
          {
            path: "",
            redirect: { name: "configuracao.cartorio" },
            name: "configuracao.redicionado",
          },

          {
            path: "cartorio",
            component: () => import("pages/configuracao/cartorio/Index.vue"),
            name: "configuracao.cartorio",
          },

          {
            path: "estatistica",
            component: () => import("pages/configuracao/estatistica/Index.vue"),
            name: "configuracao.estatistica",
          },

          {
            path: "doi",
            component: () => import("pages/configuracao/doi/Index.vue"),
            name: "configuracao.doi",
          },

          {
            path: "centrais",
            component: () => import("pages/configuracao/centrais/Index.vue"),
            name: "configuracao.centrais",
          },

          {
            path: "email",
            component: () => import("pages/configuracao/email/Index.vue"),
            name: "configuracao.email",
          },
        ],
      },

      // NATUREZA
      {
        path: "administracao/natureza",
        component: () => import("src/pages/natureza/Index.vue"),
        name: "natureza.index",
        meta: {
          title: "Naturezas",
          publico: false,
          permissao: ["NATUREZA_LISTAR"],
        },
      },

      {
        path: "administracao/natureza/novo",
        component: () => import("src/pages/natureza/Create.vue"),
        name: "natureza.create",
        meta: {
          title: "Natureza - Novo",
          publico: false,
          permissao: ["NATUREZA_CRIAR"],
        },
      },

      {
        path: "matricula",
        component: () => import("src/pages/matricula/Index.vue"),
        name: "matricula.index",
        meta: {
          title: "Matrículas",
          publico: false,
        },
      },

      // PROTOCOLO
      {
        path: "/protocolo/:id",
        name: "protocolo.index",
        meta: {
          title: "Protocolo",
          requiresAuth: true,
          permissao: ["PROTOCOLO_VISUALIZAR"],
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
      },

      {
        path: "administracao/tabela-custa",
        name: "administracao.tabela-custa.index",
        component: () =>
          import("src/pages/administracao/tabela-custa/Index.vue"),
        meta: {
          title: "Tabelas de Custas",
          publico: false,
          permissao: ["TABELA_CUSTA_LISTAR"],
        },
      },
      {
        path: "administracao/tabela-custa/:tabelaCustaId/atos",
        name: "administracao.tabela-custa.atos.index",
        component: () =>
          import("src/pages/administracao/tabela-custa/atos/Index.vue"),
        props: true,
        meta: {
          title: "Atos da Tabela de Custas",
          publico: false,
          permissao: ["TABELA_CUSTA_LISTAR"],
        },
      },

      // GRUPOS DE PERMISSÃO
      {
        path: "administracao/grupos",
        name: "administracao.grupos.index",
        component: () => import("src/pages/administracao/grupos/Index.vue"),
        meta: {
          title: "Grupos de Permissão",
          publico: false,
          permissao: ["GRUPO_LISTAR"],
        },
      },

      // PERMISSÕES DO SISTEMA
      {
        path: "administracao/permissoes",
        name: "administracao.permissoes.index",
        component: () => import("src/pages/administracao/permissoes/Index.vue"),
        meta: {
          title: "Permissões",
          publico: false,
          permissao: ["PERMISSAO_LISTAR"],
        },
      },

      // PERMISSÕES DE USUÁRIOS
      {
        path: "administracao/usuarios-permissoes",
        name: "administracao.usuarios-permissoes.index",
        component: () => import("src/pages/administracao/usuarios-permissoes/Index.vue"),
        meta: {
          title: "Permissões de Usuários",
          publico: false,
          permissao: ["USUARIO_PERMISSAO_LISTAR"],
        },
      },

      // SEM PERMISSÃO
      {
        path: "sem-permissao",
        name: "sem-permissao",
        component: () => import("pages/SemPermissaoPage.vue"),
        meta: {
          title: "Acesso Negado",
          publico: false,
        },
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
