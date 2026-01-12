'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { temPermissao } from '@/lib/permissions'
import { gerarAlertasInteligentes } from '@/lib/ai-treino'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { TrendingUp, Activity, Calendar, Award, AlertCircle, Lock, Download } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [historico, setHistorico] = useState<any[]>([])
  const [alertas, setAlertas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

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

    const { data: historicoData } = await supabase
      .from('historico')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    setHistorico(historicoData || [])

    const plano = perfilData?.plano || 'gratuito'
    if (temPermissao(plano, 'alertasInteligentes')) {
      const alertasGerados = gerarAlertasInteligentes(historicoData || [])
      setAlertas(alertasGerados)
    }

    setLoading(false)
  }

  const exportarRelatorio = () => {
    const plano = perfil?.plano || 'gratuito'
    
    if (!temPermissao(plano, 'exportacaoRelatorios')) {
      alert('Você precisa do plano Avançado para exportar relatórios!')
      router.push('/planos')
      return
    }

    let relatorio = 'RELATÓRIO DE EVOLUÇÃO - GymTrack\n\n'
    relatorio += `Nome: ${perfil.nome}\n`
    relatorio += `Objetivo: ${perfil.objetivo}\n`
    relatorio += `Plano: ${perfil.plano}\n\n`
    relatorio += `HISTÓRICO DE TREINOS:\n`
    
    const treinosRealizados = historico.filter(h => h.tipo === 'treino')
    relatorio += `Total de treinos: ${treinosRealizados.length}\n\n`
    
    const blob = new Blob([relatorio], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-gymtrack.txt'
    a.click()
  }

  const dadosGrafico = historico
    .filter(h => h.tipo === 'treino')
    .slice(0, 7)
    .reverse()
    .map((h, i) => ({
      dia: `Dia ${i + 1}`,
      carga: h.dados?.carga || 0
    }))

  const podeVerDashboardDetalhado = temPermissao(perfil?.plano || 'gratuito', 'dashboardsDetalhados')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Acompanhe sua evolução
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportarRelatorio} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => router.push('/')}>
              Voltar
            </Button>
          </div>
        </div>

        {alertas.length > 0 && (
          <Card className="p-4 mb-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">
                  Alertas Inteligentes
                </h3>
                <ul className="space-y-1">
                  {alertas.map((alerta, i) => (
                    <li key={i} className="text-sm text-orange-700 dark:text-orange-300">
                      {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Activity className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Treinos Realizados</p>
            <p className="text-3xl font-bold">
              {historico.filter(h => h.tipo === 'treino').length}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <Calendar className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Dias Ativos</p>
            <p className="text-3xl font-bold">
              {new Set(historico.map(h => new Date(h.created_at).toDateString())).size}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Objetivo</p>
            <p className="text-xl font-bold capitalize">
              {perfil?.objetivo || 'Não definido'}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Plano Atual</p>
            <p className="text-xl font-bold capitalize">
              {perfil?.plano || 'Gratuito'}
            </p>
          </Card>
        </div>

        {podeVerDashboardDetalhado ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Evolução de Carga (Últimos 7 Treinos)
              </h3>
              {dadosGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="carga" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  Sem dados suficientes ainda. Continue treinando!
                </p>
              )}
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Frequência Semanal
              </h3>
              {dadosGrafico.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="carga" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  Sem dados suficientes ainda. Continue treinando!
                </p>
              )}
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Histórico Recente
              </h3>
              <div className="space-y-3">
                {historico.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">
                        {item.tipo}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {item.dados?.carga && (
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{item.dados.carga}kg</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Dashboards Detalhados Bloqueados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Faça upgrade para o plano Intermediário ou Avançado para acessar gráficos detalhados e análises completas
            </p>
            <Button
              onClick={() => router.push('/planos')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Ver Planos
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
