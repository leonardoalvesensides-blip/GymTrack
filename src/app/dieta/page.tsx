'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { calcularMacros, gerarPlanoAlimentar, sugerirReceitas, gerarListaCompras, RECEITAS_BASE } from '@/lib/ai-dieta'
import { temPermissao } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Apple, Sparkles, ShoppingCart, Lock, Download } from 'lucide-react'

export default function DietaPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const [dieta, setDieta] = useState<any>(null)
  const [refeicoes, setRefeicoes] = useState<any[]>([])
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

    const { data: dietaData } = await supabase
      .from('dietas')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (dietaData) {
      setDieta(dietaData)
      
      const { data: refeicoesData } = await supabase
        .from('refeicoes')
        .select('*')
        .eq('dieta_id', dietaData.id)
        .order('tipo')

      setRefeicoes(refeicoesData || [])
    }

    setLoading(false)
  }

  const gerarNovaDieta = async () => {
    if (!perfil) return

    const plano = perfil.plano || 'gratuito'
    
    if (!temPermissao(plano, 'dietaSimples')) {
      alert('Você precisa de um plano pago para gerar dietas com IA. Faça upgrade!')
      router.push('/planos')
      return
    }

    setGerando(true)

    const planoAlimentar = gerarPlanoAlimentar({
      peso: perfil.peso,
      altura: perfil.altura,
      idade: perfil.idade,
      sexo: perfil.sexo,
      objetivo: perfil.objetivo,
      nivel_atividade: 'moderado'
    })

    const { data: novaDieta } = await supabase
      .from('dietas')
      .insert({
        usuario_id: user.id,
        objetivo: perfil.objetivo,
        calorias: planoAlimentar.macros.calorias,
        proteinas: planoAlimentar.macros.proteinas,
        carboidratos: planoAlimentar.macros.carboidratos,
        gorduras: planoAlimentar.macros.gorduras
      })
      .select()
      .single()

    if (novaDieta) {
      for (const refeicao of planoAlimentar.refeicoes) {
        const receita = sugerirReceitas(refeicao.tipo, refeicao)
        
        await supabase.from('refeicoes').insert({
          dieta_id: novaDieta.id,
          tipo: refeicao.tipo,
          nome: receita.nome,
          calorias: receita.calorias,
          proteinas: receita.proteinas,
          carboidratos: receita.carboidratos,
          gorduras: receita.gorduras,
          ingredientes: receita.ingredientes
        })
      }
    }

    setGerando(false)
    carregarDados()
  }

  const exportarListaCompras = () => {
    const plano = perfil?.plano || 'gratuito'
    
    if (!temPermissao(plano, 'listaCompras')) {
      alert('Você precisa do plano Intermediário ou Avançado para gerar lista de compras!')
      router.push('/planos')
      return
    }

    const lista = gerarListaCompras(refeicoes)
    
    let texto = 'LISTA DE COMPRAS - FitAI Pro\n\n'
    lista.forEach(item => {
      texto += `☐ ${item.nome} (${item.quantidade}x)\n`
    })
    
    const blob = new Blob([texto], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lista-compras.txt'
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Apple className="w-8 h-8 text-green-600" />
              Minha Dieta
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Plano alimentar personalizado com IA
            </p>
          </div>
          <Button onClick={() => router.push('/')}>
            Voltar
          </Button>
        </div>

        {!dieta ? (
          <Card className="p-12 text-center bg-white dark:bg-gray-800">
            <Apple className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Você ainda não tem uma dieta
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Gere seu plano alimentar personalizado com IA baseado no seu perfil e objetivos
            </p>
            <Button
              onClick={gerarNovaDieta}
              disabled={gerando}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {gerando ? 'Gerando dieta...' : 'Gerar Dieta com IA'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Plano Alimentar Atual
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Objetivo: {dieta.objetivo}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={exportarListaCompras}
                    variant="outline"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Lista de Compras
                  </Button>
                  <Button
                    onClick={gerarNovaDieta}
                    disabled={gerando}
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nova Dieta
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Calorias</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{dieta.calorias}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">kcal/dia</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-1">Proteínas</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{dieta.proteinas}g</p>
                  <p className="text-xs text-red-600 dark:text-red-400">por dia</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Carboidratos</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{dieta.carboidratos}g</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">por dia</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Gorduras</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{dieta.gorduras}g</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">por dia</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Refeições do Dia
              </h3>
              <div className="space-y-4">
                {refeicoes.map((refeicao, index) => (
                  <RefeicaoCard key={index} refeicao={refeicao} plano={perfil?.plano} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function RefeicaoCard({ refeicao, plano }: any) {
  const [expandido, setExpandido] = useState(false)
  const podeVerDetalhes = temPermissao(plano, 'dietaAvancada')

  const tipoNomes: any = {
    cafe: '☕ Café da Manhã',
    lanche_manha: '🍎 Lanche da Manhã',
    almoco: '🍽️ Almoço',
    lanche_tarde: '🥤 Lanche da Tarde',
    jantar: '🌙 Jantar',
    ceia: '🌜 Ceia'
  }

  return (
    <Card className="p-4 bg-gray-50 dark:bg-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">
            {tipoNomes[refeicao.tipo] || refeicao.tipo}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{refeicao.nome}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">{refeicao.calorias} kcal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400">Proteínas</p>
          <p className="font-bold text-red-600">{refeicao.proteinas}g</p>
        </div>
        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</p>
          <p className="font-bold text-yellow-600">{refeicao.carboidratos}g</p>
        </div>
        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400">Gorduras</p>
          <p className="font-bold text-purple-600">{refeicao.gorduras}g</p>
        </div>
      </div>

      {podeVerDetalhes ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpandido(!expandido)}
          className="w-full"
        >
          {expandido ? 'Ocultar' : 'Ver'} Ingredientes
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          disabled
        >
          <Lock className="w-4 h-4 mr-2" />
          Upgrade para ver receita
        </Button>
      )}

      {expandido && podeVerDetalhes && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Ingredientes:</p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {refeicao.ingredientes?.map((ing: string, i: number) => (
              <li key={i}>• {ing}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
