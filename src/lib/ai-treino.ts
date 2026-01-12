import { UserProfile, Exercicio } from './supabase'

export type ObjetivoTreino = 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'reabilitacao'
export type NivelExperiencia = 'iniciante' | 'intermediario' | 'avancado'

interface ParametrosTreino {
  objetivo: ObjetivoTreino
  nivel: NivelExperiencia
  frequencia: number
  restricoes?: string
  historico?: any[]
}

const EXERCICIOS_BASE = {
  peito: [
    { nome: 'Supino Reto', grupo: 'Peito' },
    { nome: 'Supino Inclinado', grupo: 'Peito' },
    { nome: 'Crucifixo', grupo: 'Peito' },
    { nome: 'Flexão', grupo: 'Peito' }
  ],
  costas: [
    { nome: 'Puxada Frontal', grupo: 'Costas' },
    { nome: 'Remada Curvada', grupo: 'Costas' },
    { nome: 'Remada Cavalinho', grupo: 'Costas' },
    { nome: 'Pullover', grupo: 'Costas' }
  ],
  pernas: [
    { nome: 'Agachamento', grupo: 'Pernas' },
    { nome: 'Leg Press', grupo: 'Pernas' },
    { nome: 'Cadeira Extensora', grupo: 'Pernas' },
    { nome: 'Cadeira Flexora', grupo: 'Pernas' },
    { nome: 'Panturrilha', grupo: 'Pernas' }
  ],
  ombros: [
    { nome: 'Desenvolvimento', grupo: 'Ombros' },
    { nome: 'Elevação Lateral', grupo: 'Ombros' },
    { nome: 'Elevação Frontal', grupo: 'Ombros' }
  ],
  bracos: [
    { nome: 'Rosca Direta', grupo: 'Bíceps' },
    { nome: 'Rosca Alternada', grupo: 'Bíceps' },
    { nome: 'Tríceps Testa', grupo: 'Tríceps' },
    { nome: 'Tríceps Corda', grupo: 'Tríceps' }
  ]
}

export function gerarTreinoIA(params: ParametrosTreino): any {
  const { objetivo, nivel, frequencia } = params
  
  // Definir séries e repetições baseado no objetivo
  let series = 3
  let repeticoes = '10-12'
  let descanso = 60
  
  if (objetivo === 'hipertrofia') {
    series = nivel === 'iniciante' ? 3 : nivel === 'intermediario' ? 4 : 5
    repeticoes = '8-12'
    descanso = 90
  } else if (objetivo === 'emagrecimento') {
    series = 3
    repeticoes = '12-15'
    descanso = 45
  } else if (objetivo === 'resistencia') {
    series = 3
    repeticoes = '15-20'
    descanso = 30
  } else if (objetivo === 'reabilitacao') {
    series = 2
    repeticoes = '12-15'
    descanso = 120
  }
  
  // Definir divisão baseado na frequência
  let divisao = 'ABC'
  let treinos: any = {}
  
  if (frequencia <= 3) {
    divisao = 'ABC'
    treinos = {
      A: [...EXERCICIOS_BASE.peito, ...EXERCICIOS_BASE.bracos.slice(0, 2)],
      B: [...EXERCICIOS_BASE.costas, ...EXERCICIOS_BASE.bracos.slice(2)],
      C: [...EXERCICIOS_BASE.pernas, ...EXERCICIOS_BASE.ombros]
    }
  } else if (frequencia <= 5) {
    divisao = 'ABCDE'
    treinos = {
      A: EXERCICIOS_BASE.peito,
      B: EXERCICIOS_BASE.costas,
      C: EXERCICIOS_BASE.pernas,
      D: EXERCICIOS_BASE.ombros,
      E: EXERCICIOS_BASE.bracos
    }
  } else {
    divisao = 'Push/Pull/Legs'
    treinos = {
      Push: [...EXERCICIOS_BASE.peito, ...EXERCICIOS_BASE.ombros, EXERCICIOS_BASE.bracos[2], EXERCICIOS_BASE.bracos[3]],
      Pull: [...EXERCICIOS_BASE.costas, EXERCICIOS_BASE.bracos[0], EXERCICIOS_BASE.bracos[1]],
      Legs: EXERCICIOS_BASE.pernas
    }
  }
  
  // Montar exercícios com parâmetros
  const treinosFormatados: any = {}
  
  Object.entries(treinos).forEach(([dia, exercicios]: [string, any]) => {
    treinosFormatados[dia] = exercicios.map((ex: any, index: number) => ({
      nome: ex.nome,
      grupo_muscular: ex.grupo,
      series,
      repeticoes,
      descanso,
      carga: calcularCargaInicial(nivel, ex.nome),
      ordem: index + 1
    }))
  })
  
  return {
    divisao,
    frequencia_semanal: frequencia,
    treinos: treinosFormatados
  }
}

function calcularCargaInicial(nivel: NivelExperiencia, exercicio: string): number {
  const cargas: any = {
    iniciante: { base: 10, multiplicador: 1 },
    intermediario: { base: 20, multiplicador: 1.5 },
    avancado: { base: 30, multiplicador: 2 }
  }
  
  const config = cargas[nivel]
  
  // Exercícios compostos têm carga maior
  const compostos = ['Agachamento', 'Leg Press', 'Supino', 'Remada']
  const isComposto = compostos.some(c => exercicio.includes(c))
  
  return isComposto ? config.base * config.multiplicador * 2 : config.base * config.multiplicador
}

export function calcularProgressaoCarga(
  exercicio: Exercicio,
  historico: any[],
  objetivo: ObjetivoTreino
): number {
  // Se completou todas as séries com facilidade, aumenta carga
  const ultimasExecucoes = historico.slice(-3)
  
  if (ultimasExecucoes.length < 3) {
    return exercicio.carga
  }
  
  const todasCompletas = ultimasExecucoes.every(ex => ex.concluido)
  
  if (todasCompletas) {
    // Aumenta 2.5kg para exercícios de isolamento, 5kg para compostos
    const compostos = ['Agachamento', 'Leg Press', 'Supino', 'Remada']
    const isComposto = compostos.some(c => exercicio.nome.includes(c))
    
    return exercicio.carga + (isComposto ? 5 : 2.5)
  }
  
  return exercicio.carga
}

export function gerarAlertasInteligentes(historico: any[]): string[] {
  const alertas: string[] = []
  
  if (historico.length < 3) {
    return alertas
  }
  
  const ultimaSemana = historico.slice(-7)
  const treinos_concluidos = ultimaSemana.filter(h => h.tipo === 'treino').length
  
  if (treinos_concluidos < 3) {
    alertas.push('⚠️ Você treinou menos de 3x esta semana. Mantenha a consistência!')
  }
  
  // Verificar estagnação
  const ultimoMes = historico.slice(-30)
  const cargas = ultimoMes.map(h => h.dados?.carga || 0)
  const cargaMedia = cargas.reduce((a, b) => a + b, 0) / cargas.length
  const ultimasCargas = cargas.slice(-5)
  const mediaRecente = ultimasCargas.reduce((a, b) => a + b, 0) / ultimasCargas.length
  
  if (Math.abs(mediaRecente - cargaMedia) < 1) {
    alertas.push('📊 Suas cargas estão estagnadas. Considere aumentar a intensidade!')
  }
  
  return alertas
}
