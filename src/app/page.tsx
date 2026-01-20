'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dumbbell, Apple, TrendingUp, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GymTrack</h1>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Sair
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <TrendingUp className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                <p className="text-blue-100">Acompanhe sua evolução</p>
              </Card>
            </Link>

            <Link href="/treinos">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Dumbbell className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Treinos</h3>
                <p className="text-purple-100">Treinos personalizados com IA</p>
              </Card>
            </Link>

            <Link href="/dieta">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-500 to-green-600 text-white">
                <Apple className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Dieta</h3>
                <p className="text-green-100">Plano alimentar inteligente</p>
              </Card>
            </Link>
          </div>

          <Card className="p-8 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bem-vindo ao GymTrack! 🎉</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Seu aplicativo fitness 100% gratuito com treinos e dietas personalizados por IA.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">🏋️ Treinos Inteligentes</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Treinos personalizados que se adaptam à sua evolução
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">🥗 Dieta Personalizada</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Planos alimentares com IA e receitas inteligentes
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2">📊 Dashboards Visuais</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Acompanhe sua evolução com gráficos detalhados
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            GymTrack
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Seu Personal Trainer e Nutricionista com Inteligência Artificial - 100% Gratuito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8">
                <LogIn className="w-5 h-5 mr-2" />
                Entrar
              </Button>
            </Link>
            <Link href="/auth/cadastro">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <Dumbbell className="w-16 h-16 mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-3">Treinos com IA</h3>
            <p className="text-white/80">
              Treinos personalizados que se adaptam automaticamente à sua evolução e objetivos
            </p>
          </Card>

          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <Apple className="w-16 h-16 mb-4 text-green-300" />
            <h3 className="text-2xl font-bold mb-3">Dieta Inteligente</h3>
            <p className="text-white/80">
              Planos alimentares personalizados com receitas e lista de compras automática
            </p>
          </Card>

          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <TrendingUp className="w-16 h-16 mb-4 text-blue-300" />
            <h3 className="text-2xl font-bold mb-3">Evolução Visual</h3>
            <p className="text-white/80">
              Dashboards detalhados com gráficos de progresso e alertas inteligentes
            </p>
          </Card>
        </div>

        <Card className="p-12 bg-white dark:bg-gray-800 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Tudo 100% Gratuito! 🎉
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">✓ Treinos Personalizados</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Treinos gerados por IA baseados no seu perfil, objetivos e nível de experiência
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">✓ Dietas Completas</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Planos alimentares com receitas detalhadas e lista de compras automática
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">✓ Registro de Evolução</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Acompanhe suas cargas, medidas e progresso com dashboards visuais
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">✓ Sem Anúncios</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Experiência completa sem interrupções ou limitações
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
