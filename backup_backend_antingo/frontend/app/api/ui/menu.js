module.exports = [
  {
    key: 'painel',
    name: 'Contatos',
    icon: 'account_box',
    child: [
      {
        key: 'account_page',
        name: 'Sttaic Auth Page',
        title: false,
      },
    ]
  },

  {
    key: 'cadastros',
    name: 'Cadastros',
    icon: 'important_devices',
    child: [
      {
        key: 'cadastros_page',
        name: 'Cadastros',
        title: true,
      },
      {
        key: 'clientes_page',
        name: 'Clientes',
        icon: 'accessibility',
        link: '/app/pages/clientes'
      },
      {
        key: 'projetos_page',
        name: 'Projetos',
        icon: 'engineering',
        link: '/app/pages/projetos'
      },
      {
        key: 'tarifas_page',
        name: 'Tarifas',
        icon: 'engineering',
        link: '/app/pages/tarifas'
      },
      {
        key: 'tarifas_precos_page',
        name: 'Tarifas Preços',
        icon: 'engineering',
        link: '/app/pages/tarifasPrecos'
      },
      {
        key: 'tipo_atividade_page',
        name: 'Tipos Atividades',
        icon: 'build',
        link: '/app/pages/tiposAtividades'
      },
      {
        key: 'atividades_page',
        name: 'Atividades',
        icon: 'engineering',
        link: '/app/pages/atividades'
      },
      {
        key: 'tipos_recursos_page',
        name: 'Tipos Recursos',
        icon: 'accessibility',
        link: '/app/pages/tiposRecursos'
      },
      {
        key: 'cargos_page',
        name: 'Cargos',
        icon: 'settings_brightness',
        link: '/app/pages/cargos'
      },
      {
        key: 'funcionarios_page',
        name: 'Funcionários',
        icon: 'accessibility',
        link: '/app/pages/funcionarios'
      },
      {
        key: 'equipamentos_page',
        name: 'Equipamentos',
        icon: 'accessibility',
        link: '/app/pages/equipamentos'
      },

      {
        key: 'certificados_page',
        name: 'Certificados',
        icon: 'engineering',
        link: '/app/pages/certificados'
      },
      {
        key: 'exames_page',
        name: 'Exames',
        icon: 'watch_later',
        link: '/app/pages/exames'
      }

      // {
      //   key: 'jornadas_page',
      //   name: 'Jornadas',
      //   icon: 'watch_later',
      //   link: '/app/pages/jornadas'
      // },

    ]
  },
  {
    key: 'lancamentos',
    name: 'Lancamentos',
    icon: 'watch_later',
    child: [
      {
        key: 'ponto',
        name: 'Ponto',
        title: true,
      },
      {
        key: 'marcacao',
        name: 'Marcação de ponto',
        icon: 'watch',
        link: '/app/pages/PontosMarcacoes/PontoMarcacao'
      },
      {
        key: 'lancamento',
        name: 'Lançamento de Pontos',
        icon: 'cloud_upload',
        link: '/app/pages/PontosMarcacoes/'
      }
    ]
  },
  {
    key: 'errors',
    name: 'Relatorios',
    icon: 'assignment',
    child: [
      {
        key: 'errors',
        name: 'Relatórios',
        title: true,
      },
      {
        key: 'not_found_page',
        name: 'Not Found Page',
        icon: 'pets',
        link: '/app/pages/not-found'
      },
      {
        key: 'error_page',
        name: 'Error Page',
        icon: 'flash_on',
        link: '/app/pages/error'
      }
    ]
  },
  {
    key: 'settings',
    name: 'Configurações',
    icon: 'settings',
    child: [
      {
        key: 'settings_page',
        name: 'Configurações',
        title: true,
      },
      {
        key: 'users_page',
        name: 'Usuários',
        icon: 'account_box',
        link: '/app/pages/users'
      }
    ]
  },
  {
    key: 'menu_levels',
    name: 'Menu Levels',
    multilevel: true,
    icon: 'sort',
    child: [
      {
        key: 'level_1',
        name: 'Level 1',
        link: '/#'
      },
      {
        key: 'level_2',
        keyParent: 'menu_levels',
        name: 'Level 2',
        child: [
          {
            key: 'sub_menu_1',
            name: 'Sub Menu 1',
            link: '/#'
          },
          {
            key: 'sub_menu_2',
            name: 'Sub Menu 2',
            link: '/#'
          },
        ]
      },
    ]
  }
];
