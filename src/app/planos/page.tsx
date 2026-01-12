'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PLANOS, getPlanosDisponiveis } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Check, Crown, Zap, Sparkles, CreditCard } from 'lucide-react'

export default function PlanosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState(false)

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
    setLoading(false)
  }

  const contratarPlano = async (planoId: string) => {
    setProcessando(true)

    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Atualizar plano do usuário
    await supabase
      .from('usuarios')
      .update({ plano: planoId })
      .eq('id', user.id)

    // Criar registro de assinatura
    await supabase.from('assinaturas').insert({
      usuario_id: user.id,
      plano: planoId,
      status: 'ativa',
      data_inicio: new Date().toISOString(),
      valor: PLANOS[planoId as keyof typeof PLANOS].valor
    })

    setProcessando(false)
    alert('Plano contratado com sucesso! 🎉')
    router.push('/')
  }

  const planos = getPlanosDisponiveis()
  const planoAtual = perfil?.plano || 'gratuito'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-orange-600" />
              Planos e Assinaturas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Escolha o plano ideal para você
            </p>
          </div>
          <Button onClick={() => router.push('/')}>
            Voltar
          </Button>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Seu plano atual</p>
              <p className="text-2xl font-bold capitalize">{planoAtual}</p>
            </div>
            <Crown className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planos.map((plano) => {
            const isAtual = plano.id === planoAtual
            const isGratuito = plano.id === 'gratuito'
            const isBasic = plano.id === 'basic'
            const isIntermediario = plano.id === 'intermediario'
            const isAvancado = plano.id === 'avancado'

            let Icon = Check
            let corGradiente = 'from-gray-500 to-gray-600'
            let corBorda = 'border-gray-200 dark:border-gray-700'
            let corFundo = 'bg-white dark:bg-gray-800'

            if (isBasic) {
              Icon = Zap
              corGradiente = 'from-blue-500 to-blue-600'
              corBorda = 'border-blue-500'
              corFundo = 'bg-blue-50 dark:bg-blue-900/20'
            } else if (isIntermediario) {
              Icon = Sparkles
              corGradiente = 'from-purple-500 to-purple-600'
              corBorda = 'border-purple-500'
              corFundo = 'bg-purple-50 dark:bg-purple-900/20'
            } else if (isAvancado) {
              Icon = Crown
              corGradiente = 'from-orange-500 to-pink-500'
              corBorda = 'border-orange-500'
              corFundo = 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20'
            }

            return (
              <Card
                key={plano.id}
                className={`p-6 border-2 ${corBorda} ${corFundo} ${isAvancado ? 'relative' : ''}`}
              >
                {isAvancado && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      RECOMENDADO
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 bg-gradient-to-br ${corGradiente} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plano.nome}
                </h3>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    R$ {plano.valor.toFixed(2)}
                  </span>
                  {!isGratuito && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">/mês</span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plano.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isAtual ? (
                  <Button
                    disabled
                    className="w-full"
                    variant="outline"
                  >
                    Plano Atual
                  </Button>
                ) : (
                  <Button
                    onClick={() => contratarPlano(plano.id)}
                    disabled={processando}
                    className={`w-full ${isAvancado ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' : ''}`}
                  >
                    {processando ? 'Processando...' : isGratuito ? 'Downgrade' : 'Contratar'}
                  </Button>
                )}
              </Card>
            )
          })}
        </div>

        <Card className="p-8 mt-8 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Como funciona o upgrade/downgrade?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ao fazer upgrade, você tem acesso imediato aos novos recursos. No downgrade, os recursos premium são removidos no próximo ciclo de cobrança.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Formas de pagamento aceitas?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aceitamos cartão de crédito, PIX e boleto bancário para pagamentos recorrentes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
