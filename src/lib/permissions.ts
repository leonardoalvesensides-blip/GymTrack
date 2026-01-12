export type Plano = 'gratuito' | 'basic' | 'intermediario' | 'avancado'

export const PLANOS = {
  gratuito: {
    nome: 'Gratuito',
    valor: 0,
    features: [
      'Treinos básicos',
      'Dashboards simples',
      'Com anúncios'
    ]
  },
  basic: {
    nome: 'Basic',
    valor: 9.90,
    features: [
      'Treinos com IA',
      'Registro de cargas',
      'Dieta simples',
      'Sem anúncios'
    ]
  },
  intermediario: {
    nome: 'Intermediário',
    valor: 19.90,
    features: [
      'Tudo do Basic',
      'Dieta avançada com IA',
      'Dashboards detalhados',
      'Sugestões de receitas',
      'Lista de compras automática'
    ]
  },
  avancado: {
    nome: 'Avançado',
    valor: 29.90,
    features: [
      'Todos os recursos',
      'Treinos adaptativos com IA',
      'Experiência completa',
      'Alertas inteligentes',
      'Exportação de relatórios',
      'Suporte prioritário'
    ]
  }
}

export const PERMISSOES = {
  treinoIA: ['basic', 'intermediario', 'avancado'],
  treinoAdaptativo: ['avancado'],
  registroCarga: ['basic', 'intermediario', 'avancado'],
  dietaSimples: ['basic', 'intermediario', 'avancado'],
  dietaAvancada: ['intermediario', 'avancado'],
  dashboardsDetalhados: ['intermediario', 'avancado'],
  exportacaoRelatorios: ['avancado'],
  alertasInteligentes: ['avancado'],
  listaCompras: ['intermediario', 'avancado'],
  substituicoesInteligentes: ['intermediario', 'avancado']
}

export function temPermissao(plano: Plano, feature: keyof typeof PERMISSOES): boolean {
  return PERMISSOES[feature].includes(plano)
}

export function getPlanosDisponiveis() {
  return Object.entries(PLANOS).map(([key, value]) => ({
    id: key as Plano,
    ...value
  }))
}
