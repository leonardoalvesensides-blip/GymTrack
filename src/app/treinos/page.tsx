'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { generatePersonalizedWorkout, type UserProfile, validateUserProfile } from '@/lib/ai/workout-generator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Dumbbell, Plus, Check, AlertCircle } from 'lucide-react'

export default function TreinosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [treino, setTreino] = useState<any>(null)
  const [exercicios, setExercicios] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      let { data: perfilData, error: perfilError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single()

      if (perfilError && perfilError.code === 'PGRST116') {
        const { data: novoPerfil, error: criarError } = await supabase
          .from('usuarios')
          .insert({
            id: user.id,
            email: user.email,
            plano: 'gratuito',
            objetivo: 'hipertrofia',
            nivel_experiencia: 'iniciante'
          })
          .select()
          .single()

        if (criarError) {
          console.error('Erro ao criar perfil:', criarError)
          setError('Erro ao criar perfil. Tente novamente.')
          setLoading(false)
          return
        }

        perfilData = novoPerfil
      } else if (perfilError) {
        console.error('Erro ao buscar perfil:', perfilError)
        setError('Erro ao carregar perfil. Tente novamente.')
        setLoading(false)
        return
      }

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
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados. Tente novamente.')
      setLoading(false)
    }
  }

  const gerarNovoTreino = async () => {
    if (!perfil || !user) {
      setError('Perfil não encontrado. Complete seu perfil primeiro.')
      return
    }

    setGerando(true)
    setError(null)

    try {
      const userProfile: UserProfile = {
        goal: (perfil.objetivo || 'hipertrofia') as any,
        level: (perfil.nivel_experiencia || 'iniciante') as any,
        frequency: 4,
        restrictions: perfil.restricoes_fisicas ? [perfil.restricoes_fisicas] : [],
        age: perfil.idade,
        experience: perfil.meses_treino
      }

      const validation = validateUserProfile(userProfile)
      if (!validation.valid) {
        setError(`Perfil incompleto: ${validation.errors.join(', ')}`)
        setGerando(false)
        return
      }

      const treinoGerado = await generatePersonalizedWorkout(userProfile, user.id)

      if (treino) {
        await supabase
          .from('treinos')
          .update({ status: 'inativo' })
          .eq('id', treino.id)
      }

      const { data: novoTreino, error: treinoError } = await supabase
        .from('treinos')
        .insert({
          usuario_id: user.id,
          objetivo: treinoGerado.template.goal,
          divisao: treinoGerado.template.split,
          frequencia_semanal: treinoGerado.template.frequency.max,
          status: 'ativo',
          template_id: treinoGerado.template.id,
          customizacoes: treinoGerado.customizations
        })
        .select()
        .single()

      if (treinoError) {
        console.error('Erro ao criar treino:', treinoError)
        setError('Erro ao gerar treino. Tente novamente.')
        setGerando(false)
        return
      }

      if (novoTreino) {
        let ordem = 0
        for (const session of treinoGerado.template.sessions) {
          for (const exercise of session.exercises) {
            await supabase.from('exercicios').insert({
              treino_id: novoTreino.id,
              dia: session.day,
              nome: exercise.name,
              grupo_muscular: session.focus,
              series: exercise.sets,
              repeticoes: exercise.reps,
              descanso: exercise.rest ? parseInt(exercise.rest) : 60,
              observacoes: exercise.notes,
              ordem: ordem++,
              carga: 0,
              concluido: false
            })
          }
        }
      }

      setGerando(false)
      await carregarDados()
    } catch (error) {
      console.error('Erro ao gerar treino:', error)
      setError('Erro ao gerar treino. Tente novamente.')
      setGerando(false)
    }
  }

  const concluirExercicio = async (exercicioId: string, cargaUsada: number) => {
    try {
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
    } catch (err) {
      console.error('Erro ao concluir exercício:', err)
      setError('Erro ao registrar exercício. Tente novamente.')
    }
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
              Treinos personalizados baseados no seu perfil
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard')}>
            Voltar
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-500">
            <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {!treino ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Você ainda não tem um treino
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Gere seu primeiro treino personalizado baseado no seu perfil, objetivos e nível de experiência. 
              Nosso sistema utiliza um banco de dados com centenas de exercícios e templates profissionais.
            </p>
            <Button
              onClick={gerarNovoTreino}
              disabled={gerando}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {gerando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gerando treino personalizado...
                </>
              ) : (
                'Gerar Treino Personalizado'
              )}
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
                  {treino.customizacoes && treino.customizacoes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {treino.customizacoes.map((custom: string, idx: number) => (
                        <p key={idx} className="text-xs text-purple-600 dark:text-purple-400">
                          ✓ {custom}
                        </p>
                      ))}
                    </div>
                  )}
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
                    {dia}
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

function ExercicioCard({ exercicio, onConcluir }: any) {
  const [carga, setCarga] = useState(exercicio.carga || 0)
  const [concluido, setConcluido] = useState(exercicio.concluido || false)

  const handleConcluir = () => {
    onConcluir(exercicio.id, carga)
    setConcluido(true)
  }

  return (
    <Card className={`p-6 transition-all ${concluido ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {exercicio.nome}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exercicio.grupo_muscular}
          </p>
          {exercicio.observacoes && (
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              💡 {exercicio.observacoes}
            </p>
          )}
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
            onChange={(e) => setCarga(parseFloat(e.target.value) || 0)}
            disabled={concluido}
            className="w-full"
            min="0"
            step="0.5"
          />
        </div>
        <Button
          onClick={handleConcluir}
          disabled={concluido}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          {concluido ? 'Concluído' : 'Concluir'}
        </Button>
      </div>
    </Card>
  )
}
