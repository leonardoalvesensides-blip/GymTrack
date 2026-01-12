'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { gerarTreinoIA, calcularProgressaoCarga } from '@/lib/ai-treino'
import { temPermissao } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Dumbbell, Plus, Check, TrendingUp, Lock } from 'lucide-react'

export default function TreinosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [treino, setTreino] = useState<any>(null)
  const [exercicios, setExercicios] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    setUser(user)

    const { data: perfilData } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single()

    setPerfil(perfilData)

    const { data: treinoData } = await supabase
      .from('treinos')
      .select('*')
      .eq('usuario_id', user.id)
      .eq('status', 'ativo')
      .single()

    if (treinoData) {
      setTreino(treinoData)
      
      const { data: exerciciosData } = await supabase
        .from('exercicios')
        .select('*')
        .eq('treino_id', treinoData.id)
        .order('ordem')

      const exerciciosPorDia: any = {}
      exerciciosData?.forEach((ex: any) => {
        const dia = ex.dia || 'A'
        if (!exerciciosPorDia[dia]) {
          exerciciosPorDia[dia] = []
        }
        exerciciosPorDia[dia].push(ex)
      })
      
      setExercicios(exerciciosPorDia)
    }

    setLoading(false)
  }

  const gerarNovoTreino = async () => {
    if (!perfil) return

    const plano = perfil.plano || 'gratuito'
    
    if (!temPermissao(plano, 'treinoIA')) {
      alert('Você precisa de um plano pago para gerar treinos com IA. Faça upgrade!')
      router.push('/planos')
      return
    }

    setGerando(true)

    const treinoGerado = gerarTreinoIA({
      objetivo: perfil.objetivo || 'hipertrofia',
      nivel: perfil.nivel_experiencia || 'iniciante',
      frequencia: 4,
      restricoes: perfil.restricoes_fisicas
    })

    const { data: novoTreino } = await supabase
      .from('treinos')
      .insert({
        usuario_id: user.id,
        objetivo: perfil.objetivo,
        divisao: treinoGerado.divisao,
        frequencia_semanal: treinoGerado.frequencia_semanal,
        status: 'ativo'
      })
      .select()
      .single()

    if (novoTreino) {
      for (const [dia, exs] of Object.entries(treinoGerado.treinos)) {
        for (const ex of exs as any[]) {
          await supabase.from('exercicios').insert({
            treino_id: novoTreino.id,
            dia,
            ...ex
          })
        }
      }
    }

    setGerando(false)
    carregarDados()
  }

  const concluirExercicio = async (exercicioId: string, cargaUsada: number) => {
    await supabase
      .from('exercicios')
      .update({ 
        concluido: true,
        carga: cargaUsada,
        data_execucao: new Date().toISOString()
      })
      .eq('id', exercicioId)

    await supabase.from('historico').insert({
      usuario_id: user.id,
      tipo: 'treino',
      dados: { exercicio_id: exercicioId, carga: cargaUsada },
      data: new Date().toISOString()
    })

    carregarDados()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-purple-600" />
              Meus Treinos
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Treinos personalizados com IA
            </p>
          </div>
          <Button onClick={() => router.push('/')}>
            Voltar
          </Button>
        </div>

        {!treino ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Você ainda não tem um treino
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Gere seu primeiro treino personalizado com IA baseado no seu perfil e objetivos
            </p>
            <Button
              onClick={gerarNovoTreino}
              disabled={gerando}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {gerando ? 'Gerando treino...' : 'Gerar Treino com IA'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Treino Atual - {treino.divisao}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Objetivo: {treino.objetivo} • {treino.frequencia_semanal}x por semana
                  </p>
                </div>
                <Button
                  onClick={gerarNovoTreino}
                  disabled={gerando}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Treino
                </Button>
              </div>
            </Card>

            <Tabs defaultValue={Object.keys(exercicios)[0]} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(exercicios).length}, 1fr)` }}>
                {Object.keys(exercicios).map(dia => (
                  <TabsTrigger key={dia} value={dia}>
                    Treino {dia}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(exercicios).map(([dia, exs]: [string, any]) => (
                <TabsContent key={dia} value={dia} className="space-y-4">
                  {exs.map((ex: any) => (
                    <ExercicioCard
                      key={ex.id}
                      exercicio={ex}
                      onConcluir={concluirExercicio}
                      plano={perfil?.plano || 'gratuito'}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

function ExercicioCard({ exercicio, onConcluir, plano }: any) {
  const [carga, setCarga] = useState(exercicio.carga)
  const [concluido, setConcluido] = useState(exercicio.concluido || false)
  const podeRegistrar = temPermissao(plano, 'registroCarga')

  const handleConcluir = () => {
    if (!podeRegistrar) {
      alert('Você precisa de um plano pago para registrar cargas!')
      return
    }
    onConcluir(exercicio.id, carga)
    setConcluido(true)
  }

  return (
    <Card className={`p-6 ${concluido ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {exercicio.nome}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exercicio.grupo_muscular}
          </p>
        </div>
        {concluido && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">Concluído</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Séries</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{exercicio.series}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Repetições</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{exercicio.repeticoes}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Descanso</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{exercicio.descanso}s</p>
        </div>
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Carga (kg)
          </label>
          <Input
            type="number"
            value={carga}
            onChange={(e) => setCarga(parseFloat(e.target.value))}
            disabled={concluido || !podeRegistrar}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleConcluir}
          disabled={concluido || !podeRegistrar}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {podeRegistrar ? (
            concluido ? 'Concluído' : 'Concluir'
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Bloqueado
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
