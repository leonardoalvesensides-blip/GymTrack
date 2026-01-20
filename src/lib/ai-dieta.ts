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

// Receitas base organizadas por objetivo
export const RECEITAS_POR_OBJETIVO = {
  hipertrofia: {
    cafe: [
      {
        nome: 'Omelete Proteica com Aveia',
        ingredientes: ['4 ovos inteiros', '40g aveia', '1 banana', 'Mel', 'Canela'],
        preparo: 'Bata os ovos, adicione aveia e canela. Frite em frigideira antiaderente. Sirva com banana fatiada e mel.',
        calorias: 520,
        proteinas: 32,
        carboidratos: 52,
        gorduras: 16
      },
      {
        nome: 'Panqueca de Banana Proteica',
        ingredientes: ['3 ovos', '2 bananas', '40g aveia', '1 scoop whey', 'Pasta de amendoim'],
        preparo: 'Bata tudo no liquidificador. Frite em frigideira antiaderente. Sirva com pasta de amendoim.',
        calorias: 580,
        proteinas: 38,
        carboidratos: 60,
        gorduras: 18
      }
    ],
    almoco: [
      {
        nome: 'Frango Grelhado com Arroz Integral e Batata Doce',
        ingredientes: ['200g peito de frango', '120g arroz integral', '200g batata doce', 'Brócolis', 'Azeite'],
        preparo: 'Grelhe o frango temperado. Cozinhe o arroz e a batata doce. Refogue o brócolis no azeite.',
        calorias: 680,
        proteinas: 55,
        carboidratos: 78,
        gorduras: 14
      },
      {
        nome: 'Carne Magra com Macarrão Integral',
        ingredientes: ['180g patinho moído', '120g macarrão integral', 'Molho de tomate caseiro', 'Salada verde'],
        preparo: 'Refogue a carne com temperos. Cozinhe o macarrão. Misture com molho de tomate. Sirva com salada.',
        calorias: 650,
        proteinas: 58,
        carboidratos: 72,
        gorduras: 12
      }
    ],
    jantar: [
      {
        nome: 'Salmão Grelhado com Quinoa',
        ingredientes: ['180g salmão', '100g quinoa', 'Aspargos', 'Azeite', 'Limão'],
        preparo: 'Grelhe o salmão com limão. Cozinhe a quinoa. Grelhe os aspargos com azeite.',
        calorias: 550,
        proteinas: 48,
        carboidratos: 42,
        gorduras: 20
      }
    ],
    lanche: [
      {
        nome: 'Shake Hipercalórico',
        ingredientes: ['1 scoop whey', '1 banana', '30g aveia', '20g pasta amendoim', '300ml leite'],
        preparo: 'Bata tudo no liquidificador até ficar homogêneo.',
        calorias: 420,
        proteinas: 35,
        carboidratos: 45,
        gorduras: 12
      }
    ]
  },
  emagrecimento: {
    cafe: [
      {
        nome: 'Omelete Light com Vegetais',
        ingredientes: ['3 claras', '1 ovo inteiro', 'Tomate', 'Espinafre', 'Cogumelos'],
        preparo: 'Bata os ovos. Adicione vegetais picados. Frite em frigideira antiaderente sem óleo.',
        calorias: 180,
        proteinas: 22,
        carboidratos: 8,
        gorduras: 6
      },
      {
        nome: 'Iogurte Grego com Frutas Vermelhas',
        ingredientes: ['150g iogurte grego 0%', 'Frutas vermelhas', 'Chia', 'Adoçante'],
        preparo: 'Misture o iogurte com frutas vermelhas e chia. Adoce a gosto.',
        calorias: 160,
        proteinas: 18,
        carboidratos: 15,
        gorduras: 3
      }
    ],
    almoco: [
      {
        nome: 'Frango Grelhado com Salada Completa',
        ingredientes: ['150g peito de frango', 'Mix de folhas', 'Tomate cereja', 'Pepino', 'Azeite (1 colher)'],
        preparo: 'Grelhe o frango temperado. Monte a salada com vegetais frescos. Tempere com azeite e limão.',
        calorias: 320,
        proteinas: 42,
        carboidratos: 12,
        gorduras: 12
      },
      {
        nome: 'Peixe com Legumes no Vapor',
        ingredientes: ['180g tilápia', 'Brócolis', 'Couve-flor', 'Cenoura', 'Temperos naturais'],
        preparo: 'Cozinhe o peixe e legumes no vapor. Tempere com ervas e limão.',
        calorias: 280,
        proteinas: 38,
        carboidratos: 18,
        gorduras: 6
      }
    ],
    jantar: [
      {
        nome: 'Sopa de Legumes com Frango',
        ingredientes: ['100g frango desfiado', 'Abóbora', 'Chuchu', 'Cenoura', 'Temperos'],
        preparo: 'Cozinhe todos os ingredientes. Bata metade no liquidificador para dar cremosidade.',
        calorias: 220,
        proteinas: 28,
        carboidratos: 20,
        gorduras: 4
      }
    ],
    lanche: [
      {
        nome: 'Whey Protein com Água',
        ingredientes: ['1 scoop whey', '250ml água gelada'],
        preparo: 'Misture o whey com água no shaker.',
        calorias: 120,
        proteinas: 24,
        carboidratos: 3,
        gorduras: 1
      }
    ]
  },
  resistencia: {
    cafe: [
      {
        nome: 'Mingau de Aveia com Banana',
        ingredientes: ['50g aveia', '1 banana', '200ml leite desnatado', 'Mel', 'Canela'],
        preparo: 'Cozinhe a aveia com leite. Adicione banana picada, mel e canela.',
        calorias: 380,
        proteinas: 16,
        carboidratos: 62,
        gorduras: 8
      }
    ],
    almoco: [
      {
        nome: 'Frango com Arroz e Feijão',
        ingredientes: ['150g frango', '100g arroz integral', '80g feijão', 'Salada', 'Azeite'],
        preparo: 'Grelhe o frango. Cozinhe arroz e feijão. Monte o prato com salada.',
        calorias: 580,
        proteinas: 48,
        carboidratos: 68,
        gorduras: 12
      }
    ],
    jantar: [
      {
        nome: 'Massa Integral com Atum',
        ingredientes: ['100g macarrão integral', '120g atum', 'Molho de tomate', 'Vegetais'],
        preparo: 'Cozinhe a massa. Misture com atum e molho de tomate. Adicione vegetais.',
        calorias: 480,
        proteinas: 38,
        carboidratos: 58,
        gorduras: 10
      }
    ],
    lanche: [
      {
        nome: 'Banana com Pasta de Amendoim',
        ingredientes: ['1 banana grande', '15g pasta de amendoim', 'Aveia'],
        preparo: 'Corte a banana, passe pasta de amendoim e polvilhe aveia.',
        calorias: 240,
        proteinas: 8,
        carboidratos: 38,
        gorduras: 8
      }
    ]
  }
}

export function sugerirReceitas(tipo: string, macrosAlvo: any, objetivo: ObjetivoDieta = 'hipertrofia') {
  const receitasObjetivo = RECEITAS_POR_OBJETIVO[objetivo] || RECEITAS_POR_OBJETIVO.hipertrofia
  
  let tipoReceita = tipo
  if (tipo === 'lanche_manha' || tipo === 'lanche_tarde' || tipo === 'ceia') {
    tipoReceita = 'lanche'
  }
  
  const receitas = receitasObjetivo[tipoReceita as keyof typeof receitasObjetivo] || receitasObjetivo.lanche
  
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
