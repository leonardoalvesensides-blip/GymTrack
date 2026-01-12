'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { User, Target, Activity, AlertCircle } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [etapa, setEtapa] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Dados do perfil
  const [idade, setIdade] = useState('')
  const [sexo, setSexo] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [nivelExperiencia, setNivelExperiencia] = useState('')
  
  // Objetivos
  const [objetivo, setObjetivo] = useState('')
  
  // Restrições
  const [restricoes, setRestricoes] = useState('')

  const handleProximo = () => {
    if (etapa < 3) {
      setEtapa(etapa + 1)
    }
  }

  const handleVoltar = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1)
    }
  }

  const handleConcluir = async () => {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('usuarios').update({
        idade: parseInt(idade),
        sexo,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        nivel_experiencia: nivelExperiencia,
        objetivo,
        restricoes_fisicas: restricoes
      }).eq('id', user.id)
    }
    
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configure seu perfil
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Etapa {etapa} de 3
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(etapa / 3) * 100}%` }}
            />
          </div>
        </div>

        {etapa === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Perfil Físico</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conte-nos sobre você</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Ex: 25"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={sexo} onValueChange={setSexo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  placeholder="Ex: 175"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nivel">Nível de Experiência</Label>
              <Select value={nivelExperiencia} onValueChange={setNivelExperiencia}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante - Nunca treinei ou treino há menos de 6 meses</SelectItem>
                  <SelectItem value="intermediario">Intermediário - Treino há 6 meses a 2 anos</SelectItem>
                  <SelectItem value="avancado">Avançado - Treino há mais de 2 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Seu Objetivo</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">O que você quer alcançar?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setObjetivo('hipertrofia')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  objetivo === 'hipertrofia'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-4xl mb-2">💪</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Hipertrofia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ganhar massa muscular</p>
              </button>

              <button
                onClick={() => setObjetivo('emagrecimento')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  objetivo === 'emagrecimento'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <div className="text-4xl mb-2">🔥</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Emagrecimento</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perder gordura corporal</p>
              </button>

              <button
                onClick={() => setObjetivo('resistencia')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  objetivo === 'resistencia'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">🏃</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Resistência</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Melhorar condicionamento</p>
              </button>

              <button
                onClick={() => setObjetivo('reabilitacao')}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  objetivo === 'reabilitacao'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                }`}
              >
                <div className="text-4xl mb-2">🏥</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Reabilitação</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recuperação e fortalecimento</p>
              </button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Restrições Físicas</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alguma lesão ou limitação?</p>
              </div>
            </div>

            <div>
              <Label htmlFor="restricoes">Descreva suas restrições (opcional)</Label>
              <Textarea
                id="restricoes"
                placeholder="Ex: Dor no joelho direito, problema na lombar, etc."
                value={restricoes}
                onChange={(e) => setRestricoes(e.target.value)}
                rows={6}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Essas informações ajudarão a IA a criar treinos mais seguros para você
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleVoltar}
            disabled={etapa === 1}
          >
            Voltar
          </Button>

          {etapa < 3 ? (
            <Button
              onClick={handleProximo}
              disabled={
                (etapa === 1 && (!idade || !sexo || !peso || !altura || !nivelExperiencia)) ||
                (etapa === 2 && !objetivo)
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleConcluir}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              {loading ? 'Finalizando...' : 'Concluir'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
