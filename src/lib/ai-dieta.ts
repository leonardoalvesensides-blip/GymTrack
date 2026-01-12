import { UserProfile } from './supabase'

export type ObjetivoDieta = 'hipertrofia' | 'emagrecimento' | 'resistencia' | 'reabilitacao'

interface ParametrosDieta {
  peso: number
  altura: number
  idade: number
  sexo: 'masculino' | 'feminino' | 'outro'
  objetivo: ObjetivoDieta
  nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'intenso'
  preferencias?: string
  restricoes?: string
}

export function calcularMacros(params: ParametrosDieta) {
  const { peso, altura, idade, sexo, objetivo, nivel_atividade } = params
  
  // Calcular TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
  let tmb = 0
  if (sexo === 'masculino') {
    tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
  } else {
    tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade)
  }
  
  // Multiplicador de atividade
  const multiplicadores: any = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725
  }
  
  let calorias = tmb * multiplicadores[nivel_atividade]
  
  // Ajustar baseado no objetivo
  if (objetivo === 'hipertrofia') {
    calorias += 300 // Superávit calórico
  } else if (objetivo === 'emagrecimento') {
    calorias -= 500 // Déficit calórico
  }
  
  // Calcular macros
  let proteinas = 0
  let carboidratos = 0
  let gorduras = 0
  
  if (objetivo === 'hipertrofia') {
    proteinas = peso * 2.2 // 2.2g por kg
    gorduras = peso * 1 // 1g por kg
    carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4
  } else if (objetivo === 'emagrecimento') {
    proteinas = peso * 2.5 // Mais proteína para preservar massa
    gorduras = peso * 0.8
    carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4
  } else if (objetivo === 'resistencia') {
    proteinas = peso * 1.6
    gorduras = peso * 0.8
    carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4
  } else {
    proteinas = peso * 1.5
    gorduras = peso * 0.9
    carboidratos = (calorias - (proteinas * 4) - (gorduras * 9)) / 4
  }
  
  return {
    calorias: Math.round(calorias),
    proteinas: Math.round(proteinas),
    carboidratos: Math.round(carboidratos),
    gorduras: Math.round(gorduras)
  }
}

export function gerarPlanoAlimentar(params: ParametrosDieta) {
  const macros = calcularMacros(params)
  
  // Distribuir calorias entre refeições
  const distribuicao = {
    cafe: 0.25,
    lanche_manha: 0.10,
    almoco: 0.30,
    lanche_tarde: 0.10,
    jantar: 0.20,
    ceia: 0.05
  }
  
  const refeicoes = Object.entries(distribuicao).map(([tipo, percentual]) => ({
    tipo,
    calorias: Math.round(macros.calorias * percentual),
    proteinas: Math.round(macros.proteinas * percentual),
    carboidratos: Math.round(macros.carboidratos * percentual),
    gorduras: Math.round(macros.gorduras * percentual)
  }))
  
  return {
    macros,
    refeicoes
  }
}

export const RECEITAS_BASE = {
  cafe: [
    {
      nome: 'Omelete com Aveia',
      ingredientes: ['3 ovos', '30g aveia', '1 banana', 'Canela'],
      calorias: 400,
      proteinas: 25,
      carboidratos: 40,
      gorduras: 12
    },
    {
      nome: 'Panqueca de Banana',
      ingredientes: ['2 ovos', '1 banana', '30g aveia', 'Mel'],
      calorias: 350,
      proteinas: 20,
      carboidratos: 45,
      gorduras: 10
    },
    {
      nome: 'Tapioca com Frango',
      ingredientes: ['50g tapioca', '100g frango desfiado', 'Queijo light'],
      calorias: 380,
      proteinas: 30,
      carboidratos: 40,
      gorduras: 8
    }
  ],
  almoco: [
    {
      nome: 'Frango Grelhado com Arroz e Batata Doce',
      ingredientes: ['150g frango', '100g arroz integral', '150g batata doce', 'Salada'],
      calorias: 550,
      proteinas: 45,
      carboidratos: 65,
      gorduras: 10
    },
    {
      nome: 'Salmão com Quinoa',
      ingredientes: ['150g salmão', '100g quinoa', 'Brócolis', 'Azeite'],
      calorias: 600,
      proteinas: 40,
      carboidratos: 50,
      gorduras: 20
    },
    {
      nome: 'Carne Magra com Macarrão Integral',
      ingredientes: ['150g patinho', '100g macarrão integral', 'Molho de tomate', 'Salada'],
      calorias: 580,
      proteinas: 48,
      carboidratos: 60,
      gorduras: 12
    }
  ],
  jantar: [
    {
      nome: 'Peixe Grelhado com Legumes',
      ingredientes: ['150g tilápia', 'Legumes variados', 'Azeite', 'Arroz integral'],
      calorias: 450,
      proteinas: 40,
      carboidratos: 40,
      gorduras: 12
    },
    {
      nome: 'Omelete com Salada',
      ingredientes: ['4 ovos', 'Queijo light', 'Salada verde', 'Azeite'],
      calorias: 400,
      proteinas: 35,
      carboidratos: 15,
      gorduras: 22
    }
  ],
  lanche: [
    {
      nome: 'Whey Protein com Banana',
      ingredientes: ['30g whey', '1 banana', 'Aveia'],
      calorias: 200,
      proteinas: 25,
      carboidratos: 25,
      gorduras: 3
    },
    {
      nome: 'Iogurte Grego com Granola',
      ingredientes: ['150g iogurte grego', '30g granola', 'Frutas vermelhas'],
      calorias: 220,
      proteinas: 18,
      carboidratos: 28,
      gorduras: 6
    },
    {
      nome: 'Pasta de Amendoim com Pão Integral',
      ingredientes: ['2 fatias pão integral', '20g pasta amendoim', 'Banana'],
      calorias: 280,
      proteinas: 12,
      carboidratos: 35,
      gorduras: 10
    }
  ]
}

export function sugerirReceitas(tipo: string, macrosAlvo: any) {
  const receitas = RECEITAS_BASE[tipo as keyof typeof RECEITAS_BASE] || RECEITAS_BASE.lanche
  
  // Encontrar receita mais próxima dos macros alvo
  return receitas.sort((a, b) => {
    const diffA = Math.abs(a.calorias - macrosAlvo.calorias)
    const diffB = Math.abs(b.calorias - macrosAlvo.calorias)
    return diffA - diffB
  })[0]
}

export function gerarListaCompras(refeicoes: any[]) {
  const ingredientes: any = {}
  
  refeicoes.forEach(refeicao => {
    if (refeicao.ingredientes) {
      refeicao.ingredientes.forEach((ing: string) => {
        if (ingredientes[ing]) {
          ingredientes[ing]++
        } else {
          ingredientes[ing] = 1
        }
      })
    }
  })
  
  return Object.entries(ingredientes).map(([nome, quantidade]) => ({
    nome,
    quantidade: quantidade as number
  }))
}
