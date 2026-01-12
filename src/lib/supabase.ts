import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserProfile = {
  id: string
  email: string
  nome: string
  idade?: number
  sexo?: 'masculino' | 'feminino' | 'outro'
  peso?: number
  altura?: number
  nivel_experiencia?: 'iniciante' | 'intermediario' | 'avancado'
  objetivo?: 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'reabilitacao'
  restricoes_fisicas?: string
  plano: 'gratuito' | 'basic' | 'intermediario' | 'avancado'
  created_at: string
}

export type Treino = {
  id: string
  usuario_id: string
  objetivo: string
  divisao: string
  frequencia_semanal: number
  status: 'ativo' | 'inativo'
  created_at: string
}

export type Exercicio = {
  id: string
  treino_id: string
  nome: string
  grupo_muscular: string
  carga: number
  series: number
  repeticoes: string
  descanso: number
  ordem: number
  data_execucao?: string
  concluido?: boolean
}

export type Dieta = {
  id: string
  usuario_id: string
  objetivo: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
  preferencias_alimentares?: string
  restricoes?: string
  created_at: string
}

export type Refeicao = {
  id: string
  dieta_id: string
  tipo: 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia'
  nome: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
  ingredientes: string[]
  modo_preparo?: string
}

export type HistoricoProgresso = {
  id: string
  usuario_id: string
  tipo: 'treino' | 'dieta' | 'corporal'
  data: string
  dados: any
  created_at: string
}

export type Assinatura = {
  id: string
  usuario_id: string
  plano: 'gratuito' | 'basic' | 'intermediario' | 'avancado'
  status: 'ativa' | 'cancelada' | 'expirada'
  data_inicio: string
  data_fim?: string
  valor: number
  created_at: string
}
