export type Plano = 'gratuito'

export const PLANOS = {
  gratuito: {
    nome: 'Gratuito',
    valor: 0,
    features: [
      'Treinos personalizados com IA',
      'Dietas completas com receitas',
      'Registro de cargas e evolução',
      'Dashboards detalhados',
      'Lista de compras automática',
      'Sem anúncios',
      'Todos os recursos liberados'
    ]
  }
}

export const PERMISSOES = {
  treinoIA: ['gratuito'],
  treinoAdaptativo: ['gratuito'],
  registroCarga: ['gratuito'],
  dietaSimples: ['gratuito'],
  dietaAvancada: ['gratuito'],
  dashboardsDetalhados: ['gratuito'],
  exportacaoRelatorios: ['gratuito'],
  alertasInteligentes: ['gratuito'],
  listaCompras: ['gratuito'],
  substituicoesInteligentes: ['gratuito']
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
