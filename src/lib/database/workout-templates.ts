// Banco de dados de templates de treinos para geração personalizada pela IA

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest?: string;
  notes?: string;
}

export interface WorkoutSession {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  goal: 'hipertrofia' | 'forca' | 'resistencia' | 'emagrecimento' | 'condicionamento';
  level: 'iniciante' | 'intermediario' | 'avancado';
  split: string;
  frequency: {
    min: number;
    max: number;
  };
  principles: string[];
  sessions: WorkoutSession[];
  description: string;
}

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'hypertrophy-fullbody-beginner',
    name: 'Hipertrofia - Corpo Inteiro (Iniciante)',
    goal: 'hipertrofia',
    level: 'iniciante',
    split: 'Corpo Inteiro',
    frequency: { min: 3, max: 4 },
    principles: ['Sobrecarga Progressiva', 'Deload Periódico', 'Forma Correta'],
    description: 'Treino de corpo inteiro ideal para iniciantes focando em hipertrofia muscular com exercícios compostos.',
    sessions: [
      {
        day: 'Dia A',
        focus: 'Corpo Inteiro',
        exercises: [
          { id: 'ex1', name: 'Agachamento', sets: 3, reps: '8-10', rest: '90s', notes: 'Foco na profundidade' },
          { id: 'ex2', name: 'Supino Reto', sets: 3, reps: '8-10', rest: '90s', notes: 'Controle na descida' },
          { id: 'ex3', name: 'Pulldown', sets: 3, reps: '10-12', rest: '60s', notes: 'Puxar até o peito' },
          { id: 'ex4', name: 'Desenvolvimento de Ombros', sets: 3, reps: '10', rest: '60s', notes: 'Amplitude completa' },
          { id: 'ex5', name: 'Prancha', sets: 3, reps: '30-60s', rest: '45s', notes: 'Manter core ativado' }
        ]
      },
      {
        day: 'Dia B',
        focus: 'Corpo Inteiro',
        exercises: [
          { id: 'ex6', name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s', notes: 'Pés na largura dos ombros' },
          { id: 'ex7', name: 'Supino Inclinado', sets: 3, reps: '8-10', rest: '90s', notes: 'Inclinação 30-45°' },
          { id: 'ex8', name: 'Remada Curvada', sets: 3, reps: '10-12', rest: '60s', notes: 'Costas retas' },
          { id: 'ex9', name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '45s', notes: 'Cotovelos levemente flexionados' },
          { id: 'ex10', name: 'Abdominal Crunch', sets: 3, reps: '15-20', rest: '45s', notes: 'Contrair no topo' }
        ]
      }
    ]
  },
  {
    id: 'hypertrophy-upperlower-intermediate',
    name: 'Hipertrofia - Superior/Inferior (Intermediário)',
    goal: 'hipertrofia',
    level: 'intermediario',
    split: 'Superior-Inferior',
    frequency: { min: 4, max: 5 },
    principles: ['Sobrecarga Progressiva', 'Deload a cada 6-8 semanas', 'Volume Progressivo'],
    description: 'Divisão superior/inferior para praticantes intermediários com foco em hipertrofia e volume de treino.',
    sessions: [
      {
        day: 'Superior A',
        focus: 'Peito e Costas',
        exercises: [
          { id: 'ex11', name: 'Supino Reto', sets: 4, reps: '8-10', rest: '90s', notes: 'Exercício principal' },
          { id: 'ex12', name: 'Remada Curvada', sets: 4, reps: '8-10', rest: '90s', notes: 'Pegada pronada' },
          { id: 'ex13', name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12', rest: '75s', notes: 'Amplitude completa' },
          { id: 'ex14', name: 'Pulldown', sets: 3, reps: '10-12', rest: '60s', notes: 'Variação de pegada' },
          { id: 'ex15', name: 'Crucifixo', sets: 3, reps: '12-15', rest: '60s', notes: 'Alongamento no peito' },
          { id: 'ex16', name: 'Remada Unilateral', sets: 3, reps: '10-12', rest: '60s', notes: 'Cada lado' }
        ]
      },
      {
        day: 'Inferior A',
        focus: 'Pernas Completo',
        exercises: [
          { id: 'ex17', name: 'Agachamento', sets: 4, reps: '8-10', rest: '120s', notes: 'Profundidade completa' },
          { id: 'ex18', name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s', notes: 'Pés médios' },
          { id: 'ex19', name: 'Stiff', sets: 3, reps: '10-12', rest: '90s', notes: 'Posterior de coxa' },
          { id: 'ex20', name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: '60s', notes: 'Contração no topo' },
          { id: 'ex21', name: 'Cadeira Flexora', sets: 3, reps: '12-15', rest: '60s', notes: 'Controle na descida' },
          { id: 'ex22', name: 'Panturrilha em Pé', sets: 4, reps: '15-20', rest: '45s', notes: 'Amplitude máxima' }
        ]
      },
      {
        day: 'Superior B',
        focus: 'Ombros e Braços',
        exercises: [
          { id: 'ex23', name: 'Desenvolvimento com Barra', sets: 4, reps: '8-10', rest: '90s', notes: 'Exercício principal' },
          { id: 'ex24', name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '60s', notes: 'Deltoide lateral' },
          { id: 'ex25', name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: '60s', notes: 'Deltoide anterior' },
          { id: 'ex26', name: 'Rosca Direta', sets: 3, reps: '10-12', rest: '60s', notes: 'Bíceps' },
          { id: 'ex27', name: 'Tríceps Testa', sets: 3, reps: '10-12', rest: '60s', notes: 'Cotovelos fixos' },
          { id: 'ex28', name: 'Rosca Martelo', sets: 3, reps: '12-15', rest: '45s', notes: 'Braquial' }
        ]
      },
      {
        day: 'Inferior B',
        focus: 'Pernas Ênfase Posterior',
        exercises: [
          { id: 'ex29', name: 'Levantamento Terra', sets: 4, reps: '6-8', rest: '120s', notes: 'Exercício principal' },
          { id: 'ex30', name: 'Agachamento Búlgaro', sets: 3, reps: '10-12', rest: '90s', notes: 'Cada perna' },
          { id: 'ex31', name: 'Cadeira Flexora', sets: 4, reps: '10-12', rest: '60s', notes: 'Posterior enfatizado' },
          { id: 'ex32', name: 'Cadeira Adutora', sets: 3, reps: '12-15', rest: '60s', notes: 'Parte interna' },
          { id: 'ex33', name: 'Cadeira Abdutora', sets: 3, reps: '12-15', rest: '60s', notes: 'Glúteo médio' },
          { id: 'ex34', name: 'Panturrilha Sentado', sets: 4, reps: '15-20', rest: '45s', notes: 'Sóleo' }
        ]
      }
    ]
  },
  {
    id: 'hypertrophy-ppl-advanced',
    name: 'Hipertrofia - PPL (Avançado)',
    goal: 'hipertrofia',
    level: 'avancado',
    split: 'Push-Pull-Legs',
    frequency: { min: 5, max: 6 },
    principles: ['Sobrecarga Progressiva', 'Deload a cada 8 semanas', 'Volume Alto', 'Intensidade Controlada'],
    description: 'Divisão Push-Pull-Legs para praticantes avançados com alto volume e frequência de treino.',
    sessions: [
      {
        day: 'Push A (Peito Ênfase)',
        focus: 'Peito, Ombros e Tríceps',
        exercises: [
          { id: 'ex35', name: 'Supino Reto', sets: 4, reps: '6-8', rest: '120s', notes: 'Carga alta' },
          { id: 'ex36', name: 'Supino Inclinado', sets: 4, reps: '8-10', rest: '90s', notes: 'Peito superior' },
          { id: 'ex37', name: 'Desenvolvimento com Halteres', sets: 3, reps: '10-12', rest: '75s', notes: 'Ombros' },
          { id: 'ex38', name: 'Crucifixo Inclinado', sets: 3, reps: '12-15', rest: '60s', notes: 'Alongamento' },
          { id: 'ex39', name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '60s', notes: 'Deltoide lateral' },
          { id: 'ex40', name: 'Tríceps Pulley', sets: 3, reps: '12-15', rest: '45s', notes: 'Cabeça lateral' },
          { id: 'ex41', name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: '60s', notes: 'Cabeça longa' }
        ]
      },
      {
        day: 'Pull A (Costas Ênfase)',
        focus: 'Costas e Bíceps',
        exercises: [
          { id: 'ex42', name: 'Levantamento Terra', sets: 4, reps: '5-6', rest: '150s', notes: 'Exercício principal' },
          { id: 'ex43', name: 'Barra Fixa', sets: 4, reps: '8-10', rest: '90s', notes: 'Pegada pronada' },
          { id: 'ex44', name: 'Remada Curvada', sets: 4, reps: '8-10', rest: '90s', notes: 'Pegada supinada' },
          { id: 'ex45', name: 'Pulldown Pegada Fechada', sets: 3, reps: '10-12', rest: '60s', notes: 'Dorsal inferior' },
          { id: 'ex46', name: 'Remada Cavalinho', sets: 3, reps: '12-15', rest: '60s', notes: 'Trapézio médio' },
          { id: 'ex47', name: 'Rosca Direta', sets: 4, reps: '8-10', rest: '60s', notes: 'Bíceps' },
          { id: 'ex48', name: 'Rosca Martelo', sets: 3, reps: '10-12', rest: '45s', notes: 'Braquial' }
        ]
      },
      {
        day: 'Legs A (Quadríceps Ênfase)',
        focus: 'Pernas Completo',
        exercises: [
          { id: 'ex49', name: 'Agachamento', sets: 5, reps: '6-8', rest: '150s', notes: 'Exercício principal' },
          { id: 'ex50', name: 'Leg Press', sets: 4, reps: '10-12', rest: '90s', notes: 'Pés baixos' },
          { id: 'ex51', name: 'Cadeira Extensora', sets: 4, reps: '12-15', rest: '60s', notes: 'Drop set final' },
          { id: 'ex52', name: 'Stiff', sets: 3, reps: '10-12', rest: '90s', notes: 'Posterior' },
          { id: 'ex53', name: 'Cadeira Flexora', sets: 3, reps: '12-15', rest: '60s', notes: 'Posterior isolado' },
          { id: 'ex54', name: 'Panturrilha em Pé', sets: 4, reps: '12-15', rest: '45s', notes: 'Gastrocnêmio' },
          { id: 'ex55', name: 'Panturrilha Sentado', sets: 3, reps: '15-20', rest: '45s', notes: 'Sóleo' }
        ]
      },
      {
        day: 'Push B (Ombros Ênfase)',
        focus: 'Ombros, Peito e Tríceps',
        exercises: [
          { id: 'ex56', name: 'Desenvolvimento com Barra', sets: 4, reps: '6-8', rest: '120s', notes: 'Exercício principal' },
          { id: 'ex57', name: 'Elevação Lateral', sets: 4, reps: '12-15', rest: '60s', notes: 'Deltoide lateral' },
          { id: 'ex58', name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12', rest: '90s', notes: 'Peito superior' },
          { id: 'ex59', name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: '60s', notes: 'Deltoide anterior' },
          { id: 'ex60', name: 'Crucifixo Inverso', sets: 3, reps: '12-15', rest: '60s', notes: 'Deltoide posterior' },
          { id: 'ex61', name: 'Tríceps Testa', sets: 3, reps: '10-12', rest: '60s', notes: 'Cabeça longa' },
          { id: 'ex62', name: 'Tríceps Corda', sets: 3, reps: '12-15', rest: '45s', notes: 'Cabeça lateral' }
        ]
      },
      {
        day: 'Pull B (Largura Ênfase)',
        focus: 'Costas Largura e Bíceps',
        exercises: [
          { id: 'ex63', name: 'Barra Fixa Pegada Aberta', sets: 4, reps: '8-10', rest: '90s', notes: 'Largura dorsal' },
          { id: 'ex64', name: 'Pulldown', sets: 4, reps: '10-12', rest: '75s', notes: 'Pegada larga' },
          { id: 'ex65', name: 'Remada Unilateral', sets: 4, reps: '10-12', rest: '60s', notes: 'Cada lado' },
          { id: 'ex66', name: 'Pullover', sets: 3, reps: '12-15', rest: '60s', notes: 'Alongamento dorsal' },
          { id: 'ex67', name: 'Encolhimento', sets: 3, reps: '12-15', rest: '60s', notes: 'Trapézio superior' },
          { id: 'ex68', name: 'Rosca 21', sets: 3, reps: '21', rest: '60s', notes: '7+7+7' },
          { id: 'ex69', name: 'Rosca Concentrada', sets: 3, reps: '12-15', rest: '45s', notes: 'Pico de contração' }
        ]
      },
      {
        day: 'Legs B (Posterior Ênfase)',
        focus: 'Pernas Posterior',
        exercises: [
          { id: 'ex70', name: 'Levantamento Terra Romeno', sets: 4, reps: '8-10', rest: '120s', notes: 'Posterior enfatizado' },
          { id: 'ex71', name: 'Agachamento Búlgaro', sets: 4, reps: '10-12', rest: '90s', notes: 'Cada perna' },
          { id: 'ex72', name: 'Cadeira Flexora', sets: 4, reps: '10-12', rest: '60s', notes: 'Drop set final' },
          { id: 'ex73', name: 'Leg Press Pés Altos', sets: 3, reps: '12-15', rest: '90s', notes: 'Glúteo e posterior' },
          { id: 'ex74', name: 'Cadeira Adutora', sets: 3, reps: '15-20', rest: '45s', notes: 'Parte interna' },
          { id: 'ex75', name: 'Cadeira Abdutora', sets: 3, reps: '15-20', rest: '45s', notes: 'Glúteo médio' },
          { id: 'ex76', name: 'Panturrilha no Leg Press', sets: 4, reps: '15-20', rest: '45s', notes: 'Variação' }
        ]
      }
    ]
  },
  {
    id: 'strength-fullbody-beginner',
    name: 'Força - Corpo Inteiro (Iniciante)',
    goal: 'forca',
    level: 'iniciante',
    split: 'Corpo Inteiro',
    frequency: { min: 3, max: 3 },
    principles: ['Sobrecarga Progressiva Linear', 'Deload a cada 4 semanas', 'Foco em Compostos'],
    description: 'Programa de força para iniciantes focado em exercícios compostos e progressão linear.',
    sessions: [
      {
        day: 'Dia A',
        focus: 'Força Geral',
        exercises: [
          { id: 'ex77', name: 'Agachamento', sets: 5, reps: '5', rest: '180s', notes: 'Carga progressiva' },
          { id: 'ex78', name: 'Supino Reto', sets: 5, reps: '5', rest: '180s', notes: 'Carga progressiva' },
          { id: 'ex79', name: 'Remada Curvada', sets: 3, reps: '8', rest: '120s', notes: 'Trabalho auxiliar' },
          { id: 'ex80', name: 'Prancha', sets: 3, reps: '45-60s', rest: '60s', notes: 'Core' }
        ]
      },
      {
        day: 'Dia B',
        focus: 'Força Geral',
        exercises: [
          { id: 'ex81', name: 'Levantamento Terra', sets: 5, reps: '5', rest: '180s', notes: 'Carga progressiva' },
          { id: 'ex82', name: 'Desenvolvimento com Barra', sets: 5, reps: '5', rest: '180s', notes: 'Carga progressiva' },
          { id: 'ex83', name: 'Barra Fixa', sets: 3, reps: '5-8', rest: '120s', notes: 'Assistida se necessário' },
          { id: 'ex84', name: 'Abdominal', sets: 3, reps: '15', rest: '60s', notes: 'Core' }
        ]
      }
    ]
  },
  {
    id: 'endurance-circuit-intermediate',
    name: 'Resistência - Circuito (Intermediário)',
    goal: 'resistencia',
    level: 'intermediario',
    split: 'Circuito',
    frequency: { min: 4, max: 5 },
    principles: ['Densidade de Treino', 'Intervalos Curtos', 'Volume Alto'],
    description: 'Treino em circuito para desenvolvimento de resistência muscular e cardiovascular.',
    sessions: [
      {
        day: 'Circuito A',
        focus: 'Corpo Inteiro',
        exercises: [
          { id: 'ex85', name: 'Agachamento com Peso Corporal', sets: 3, reps: '20', rest: '30s', notes: 'Circuito' },
          { id: 'ex86', name: 'Flexão', sets: 3, reps: '15-20', rest: '30s', notes: 'Circuito' },
          { id: 'ex87', name: 'Avanço', sets: 3, reps: '15', rest: '30s', notes: 'Cada perna' },
          { id: 'ex88', name: 'Remada com Halteres', sets: 3, reps: '15', rest: '30s', notes: 'Circuito' },
          { id: 'ex89', name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', notes: 'Cardio' },
          { id: 'ex90', name: 'Prancha', sets: 3, reps: '45s', rest: '60s', notes: 'Final do circuito' }
        ]
      },
      {
        day: 'Circuito B',
        focus: 'Metabólico',
        exercises: [
          { id: 'ex91', name: 'Burpees', sets: 3, reps: '15', rest: '30s', notes: 'Corpo inteiro' },
          { id: 'ex92', name: 'Kettlebell Swing', sets: 3, reps: '20', rest: '30s', notes: 'Explosivo' },
          { id: 'ex93', name: 'Box Jump', sets: 3, reps: '12', rest: '30s', notes: 'Pliométrico' },
          { id: 'ex94', name: 'Battle Ropes', sets: 3, reps: '30s', rest: '30s', notes: 'Cardio' },
          { id: 'ex95', name: 'Farmer Walk', sets: 3, reps: '40m', rest: '30s', notes: 'Pegada e core' },
          { id: 'ex96', name: 'Bicicleta', sets: 3, reps: '30s', rest: '60s', notes: 'Abdominal' }
        ]
      }
    ]
  },
  {
    id: 'weightloss-hiit-beginner',
    name: 'Emagrecimento - HIIT (Iniciante)',
    goal: 'emagrecimento',
    level: 'iniciante',
    split: 'HIIT',
    frequency: { min: 3, max: 4 },
    principles: ['Alta Intensidade', 'Intervalos', 'Déficit Calórico'],
    description: 'Treino HIIT para emagrecimento com foco em queima calórica e preservação muscular.',
    sessions: [
      {
        day: 'HIIT A',
        focus: 'Cardio e Força',
        exercises: [
          { id: 'ex97', name: 'Corrida/Caminhada Intervalada', sets: 8, reps: '30s/30s', rest: '0s', notes: 'Alta/Baixa intensidade' },
          { id: 'ex98', name: 'Agachamento', sets: 3, reps: '15', rest: '45s', notes: 'Peso moderado' },
          { id: 'ex99', name: 'Flexão', sets: 3, reps: '10-15', rest: '45s', notes: 'Joelhos se necessário' },
          { id: 'ex100', name: 'Prancha', sets: 3, reps: '30s', rest: '45s', notes: 'Core' }
        ]
      },
      {
        day: 'HIIT B',
        focus: 'Metabólico',
        exercises: [
          { id: 'ex101', name: 'Jumping Jacks', sets: 4, reps: '45s', rest: '15s', notes: 'Aquecimento ativo' },
          { id: 'ex102', name: 'Burpees Modificados', sets: 3, reps: '10', rest: '45s', notes: 'Sem salto se necessário' },
          { id: 'ex103', name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', notes: 'Ritmo constante' },
          { id: 'ex104', name: 'Avanço Alternado', sets: 3, reps: '20', rest: '45s', notes: 'Total' },
          { id: 'ex105', name: 'Bicicleta Abdominal', sets: 3, reps: '30s', rest: '30s', notes: 'Core' }
        ]
      }
    ]
  }
];

// Função para buscar templates baseado no perfil do usuário
export function getWorkoutTemplatesByProfile(
  goal: string,
  level: string,
  frequency: number
): WorkoutTemplate[] {
  return workoutTemplates.filter(template => {
    const matchesGoal = template.goal === goal.toLowerCase();
    const matchesLevel = template.level === level.toLowerCase();
    const matchesFrequency = frequency >= template.frequency.min && frequency <= template.frequency.max;
    
    return matchesGoal && matchesLevel && matchesFrequency;
  });
}

// Função para obter um template específico por ID
export function getWorkoutTemplateById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find(template => template.id === id);
}

// Função para obter todos os objetivos disponíveis
export function getAvailableGoals(): string[] {
  return Array.from(new Set(workoutTemplates.map(t => t.goal)));
}

// Função para obter todos os níveis disponíveis
export function getAvailableLevels(): string[] {
  return Array.from(new Set(workoutTemplates.map(t => t.level)));
}
