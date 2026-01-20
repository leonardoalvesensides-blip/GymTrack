// Banco de dados de templates de treino profissionais

export interface Exercise {
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
  duration: string;
  principles: string[];
  sessions: WorkoutSession[];
}

// Templates de treino profissionais
export const workoutTemplates: WorkoutTemplate[] = [
  // 1. INICIANTE - CORPO INTEIRO (3x semana)
  {
    id: 'beginner_fullbody_3x',
    name: 'Corpo Inteiro Iniciante',
    goal: 'hipertrofia',
    level: 'iniciante',
    split: 'Corpo Inteiro ABC',
    frequency: { min: 3, max: 3 },
    duration: '8-12 semanas',
    principles: [
      'Foco em exercícios compostos',
      'Aprendizado de técnica',
      'Volume moderado',
      'Progressão linear'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Corpo Inteiro - Ênfase Superior',
        exercises: [
          { name: 'Agachamento Livre', sets: 3, reps: '10-12', rest: '90s', notes: 'Foco na técnica' },
          { name: 'Supino Reto', sets: 3, reps: '10-12', rest: '90s', notes: 'Controle da descida' },
          { name: 'Remada Curvada', sets: 3, reps: '10-12', rest: '90s', notes: 'Costas retas' },
          { name: 'Desenvolvimento com Halteres', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Rosca Direta', sets: 2, reps: '12-15', rest: '60s' },
          { name: 'Tríceps Pulley', sets: 2, reps: '12-15', rest: '60s' },
          { name: 'Prancha', sets: 3, reps: '30-45s', rest: '60s' }
        ]
      },
      {
        day: 'B',
        focus: 'Corpo Inteiro - Ênfase Inferior',
        exercises: [
          { name: 'Leg Press 45°', sets: 3, reps: '12-15', rest: '90s', notes: 'Amplitude completa' },
          { name: 'Stiff', sets: 3, reps: '10-12', rest: '90s', notes: 'Alongamento posterior' },
          { name: 'Supino Inclinado', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Puxada Frontal', sets: 3, reps: '10-12', rest: '90s', notes: 'Pegada média' },
          { name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Rosca Martelo', sets: 2, reps: '12-15', rest: '60s' },
          { name: 'Tríceps Testa', sets: 2, reps: '12-15', rest: '60s' }
        ]
      },
      {
        day: 'C',
        focus: 'Corpo Inteiro - Balanceado',
        exercises: [
          { name: 'Agachamento no Smith', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Mesa Flexora', sets: 3, reps: '12-15', rest: '90s' },
          { name: 'Crucifixo Inclinado', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Remada Baixa', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Desenvolvimento Máquina', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Rosca Concentrada', sets: 2, reps: '12-15', rest: '60s' },
          { name: 'Tríceps Corda', sets: 2, reps: '12-15', rest: '60s' }
        ]
      }
    ]
  },

  // 2. INTERMEDIÁRIO - UPPER/LOWER (4x semana)
  {
    id: 'intermediate_upperlower_4x',
    name: 'Upper/Lower Intermediário',
    goal: 'hipertrofia',
    level: 'intermediario',
    split: 'Upper/Lower',
    frequency: { min: 4, max: 4 },
    duration: '12-16 semanas',
    principles: [
      'Volume progressivo',
      'Intensidade moderada-alta',
      'Variação de estímulos',
      'Recuperação adequada'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Membros Superiores - Força',
        exercises: [
          { name: 'Supino Reto', sets: 4, reps: '6-8', rest: '120s', notes: 'Carga alta' },
          { name: 'Remada Curvada', sets: 4, reps: '6-8', rest: '120s', notes: 'Pegada pronada' },
          { name: 'Desenvolvimento Militar', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Puxada Frontal', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Supino Inclinado Halteres', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Rosca Direta Barra', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        day: 'B',
        focus: 'Membros Inferiores - Força',
        exercises: [
          { name: 'Agachamento Livre', sets: 4, reps: '6-8', rest: '150s', notes: 'Carga progressiva' },
          { name: 'Stiff', sets: 4, reps: '8-10', rest: '120s', notes: 'Posterior completo' },
          { name: 'Leg Press 45°', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Mesa Flexora', sets: 3, reps: '12-15', rest: '90s' },
          { name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: '90s' },
          { name: 'Panturrilha em Pé', sets: 4, reps: '15-20', rest: '60s' },
          { name: 'Abdominal Supra', sets: 3, reps: '15-20', rest: '60s' }
        ]
      },
      {
        day: 'C',
        focus: 'Membros Superiores - Hipertrofia',
        exercises: [
          { name: 'Supino Inclinado', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Crucifixo Reto', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Remada Baixa', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Pulldown Neutro', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Elevação Lateral', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Rosca Alternada', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Tríceps Pulley Corda', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        day: 'D',
        focus: 'Membros Inferiores - Hipertrofia',
        exercises: [
          { name: 'Agachamento Frontal', sets: 4, reps: '10-12', rest: '120s' },
          { name: 'Levantamento Terra', sets: 3, reps: '8-10', rest: '150s', notes: 'Técnica perfeita' },
          { name: 'Hack Machine', sets: 3, reps: '12-15', rest: '90s' },
          { name: 'Mesa Flexora', sets: 4, reps: '12-15', rest: '90s' },
          { name: 'Afundo Búlgaro', sets: 3, reps: '10-12', rest: '90s', notes: 'Cada perna' },
          { name: 'Panturrilha Sentado', sets: 4, reps: '15-20', rest: '60s' },
          { name: 'Prancha Lateral', sets: 3, reps: '30-45s', rest: '60s', notes: 'Cada lado' }
        ]
      }
    ]
  },

  // 3. AVANÇADO - PPL (6x semana)
  {
    id: 'advanced_ppl_6x',
    name: 'Push/Pull/Legs Avançado',
    goal: 'hipertrofia',
    level: 'avancado',
    split: 'PPL (Push/Pull/Legs)',
    frequency: { min: 6, max: 6 },
    duration: '12-20 semanas',
    principles: [
      'Volume alto',
      'Intensidade progressiva',
      'Técnicas avançadas',
      'Periodização'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Push - Peito/Ombro/Tríceps (Força)',
        exercises: [
          { name: 'Supino Reto', sets: 5, reps: '4-6', rest: '180s', notes: 'Carga máxima' },
          { name: 'Supino Inclinado', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Desenvolvimento Militar', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Crucifixo Inclinado', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Elevação Lateral', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Tríceps Paralelas', sets: 4, reps: '8-10', rest: '90s', notes: 'Peso adicional' },
          { name: 'Tríceps Testa', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        day: 'B',
        focus: 'Pull - Costas/Bíceps (Força)',
        exercises: [
          { name: 'Levantamento Terra', sets: 5, reps: '4-6', rest: '180s', notes: 'Força máxima' },
          { name: 'Remada Curvada', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Puxada Frontal', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Remada Baixa', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Pullover', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Rosca Direta Barra', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Rosca Martelo', sets: 3, reps: '10-12', rest: '60s' }
        ]
      },
      {
        day: 'C',
        focus: 'Legs - Pernas Completo (Força)',
        exercises: [
          { name: 'Agachamento Livre', sets: 5, reps: '4-6', rest: '180s', notes: 'Profundidade total' },
          { name: 'Leg Press 45°', sets: 4, reps: '8-10', rest: '120s', notes: 'Carga alta' },
          { name: 'Stiff', sets: 4, reps: '8-10', rest: '120s' },
          { name: 'Mesa Flexora', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Cadeira Extensora', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Afundo Caminhando', sets: 3, reps: '12-15', rest: '90s', notes: 'Halteres' },
          { name: 'Panturrilha em Pé', sets: 5, reps: '15-20', rest: '60s' }
        ]
      },
      {
        day: 'D',
        focus: 'Push - Peito/Ombro/Tríceps (Hipertrofia)',
        exercises: [
          { name: 'Supino Inclinado Halteres', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Crucifixo Reto', sets: 4, reps: '12-15', rest: '60s', notes: 'Drop set última série' },
          { name: 'Desenvolvimento Halteres', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Elevação Lateral Cabo', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Tríceps Francês', sets: 4, reps: '10-12', rest: '60s' },
          { name: 'Tríceps Corda', sets: 3, reps: '15-20', rest: '45s', notes: 'Contração máxima' }
        ]
      },
      {
        day: 'E',
        focus: 'Pull - Costas/Bíceps (Hipertrofia)',
        exercises: [
          { name: 'Barra Fixa', sets: 4, reps: '8-12', rest: '90s', notes: 'Peso adicional se possível' },
          { name: 'Remada Cavalinho', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Pulldown Pegada Aberta', sets: 4, reps: '12-15', rest: '60s' },
          { name: 'Remada Unilateral', sets: 3, reps: '12-15', rest: '60s', notes: 'Cada lado' },
          { name: 'Face Pull', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Rosca 21', sets: 3, reps: '21', rest: '90s', notes: '7+7+7' },
          { name: 'Rosca Concentrada', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        day: 'F',
        focus: 'Legs - Pernas Completo (Hipertrofia)',
        exercises: [
          { name: 'Agachamento Frontal', sets: 4, reps: '10-12', rest: '120s' },
          { name: 'Hack Machine', sets: 4, reps: '12-15', rest: '90s' },
          { name: 'Levantamento Terra Romeno', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Mesa Flexora', sets: 4, reps: '12-15', rest: '60s', notes: 'Drop set última' },
          { name: 'Cadeira Extensora', sets: 4, reps: '15-20', rest: '60s', notes: 'Contração pico' },
          { name: 'Afundo Búlgaro', sets: 3, reps: '12-15', rest: '90s' },
          { name: 'Panturrilha Sentado', sets: 4, reps: '20-25', rest: '45s' }
        ]
      }
    ]
  },

  // 4. FORÇA - POWERLIFTING (4x semana)
  {
    id: 'strength_powerlifting_4x',
    name: 'Força Powerlifting',
    goal: 'forca',
    level: 'avancado',
    split: 'Powerlifting (Agachamento/Supino/Terra)',
    frequency: { min: 4, max: 4 },
    duration: '12-16 semanas',
    principles: [
      'Foco nos 3 grandes',
      'Baixas repetições',
      'Alta intensidade',
      'Periodização linear'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Agachamento - Dia Pesado',
        exercises: [
          { name: 'Agachamento Livre', sets: 5, reps: '3-5', rest: '240s', notes: '85-90% 1RM' },
          { name: 'Agachamento Pausa', sets: 3, reps: '5', rest: '180s', notes: '70% 1RM, pausa 3s' },
          { name: 'Leg Press', sets: 4, reps: '8-10', rest: '120s' },
          { name: 'Mesa Flexora', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: '60s' },
          { name: 'Abdominal com Peso', sets: 4, reps: '10-15', rest: '60s' }
        ]
      },
      {
        day: 'B',
        focus: 'Supino - Dia Pesado',
        exercises: [
          { name: 'Supino Reto', sets: 5, reps: '3-5', rest: '240s', notes: '85-90% 1RM' },
          { name: 'Supino Pausa', sets: 3, reps: '5', rest: '180s', notes: '70% 1RM, pausa 2s' },
          { name: 'Supino Inclinado', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Desenvolvimento Militar', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Tríceps Paralelas', sets: 4, reps: '6-8', rest: '90s', notes: 'Peso adicional' },
          { name: 'Remada Baixa', sets: 3, reps: '10-12', rest: '90s', notes: 'Estabilização' }
        ]
      },
      {
        day: 'C',
        focus: 'Levantamento Terra - Dia Pesado',
        exercises: [
          { name: 'Levantamento Terra', sets: 5, reps: '3-5', rest: '240s', notes: '85-90% 1RM' },
          { name: 'Terra Deficit', sets: 3, reps: '5', rest: '180s', notes: '70% 1RM' },
          { name: 'Remada Curvada', sets: 4, reps: '6-8', rest: '120s' },
          { name: 'Puxada Frontal', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Stiff', sets: 3, reps: '8-10', rest: '90s' },
          { name: 'Hiperextensão', sets: 3, reps: '12-15', rest: '60s', notes: 'Peso adicional' }
        ]
      },
      {
        day: 'D',
        focus: 'Acessórios e Volume',
        exercises: [
          { name: 'Agachamento Frontal', sets: 4, reps: '8-10', rest: '120s' },
          { name: 'Supino Inclinado Halteres', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Remada Cavalinho', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Desenvolvimento Halteres', sets: 3, reps: '10-12', rest: '90s' },
          { name: 'Rosca Direta', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Tríceps Francês', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Prancha', sets: 3, reps: '60s', rest: '60s' }
        ]
      }
    ]
  },

  // 5. EMAGRECIMENTO - CIRCUITO (5x semana)
  {
    id: 'fatloss_circuit_5x',
    name: 'Emagrecimento Circuito',
    goal: 'emagrecimento',
    level: 'intermediario',
    split: 'Circuito Metabólico',
    frequency: { min: 4, max: 5 },
    duration: '8-12 semanas',
    principles: [
      'Alta densidade',
      'Baixo descanso',
      'Exercícios compostos',
      'Gasto calórico elevado'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Circuito Corpo Inteiro - Alta Intensidade',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '15-20', rest: '30s', notes: 'Explosão máxima' },
          { name: 'Agachamento Jump', sets: 4, reps: '15-20', rest: '30s' },
          { name: 'Flexão', sets: 4, reps: '15-20', rest: '30s' },
          { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: '30s', notes: 'Ritmo acelerado' },
          { name: 'Remada Curvada', sets: 3, reps: '15-20', rest: '45s', notes: 'Carga moderada' },
          { name: 'Prancha Dinâmica', sets: 3, reps: '45s', rest: '30s' }
        ]
      },
      {
        day: 'B',
        focus: 'Circuito Inferior + Core',
        exercises: [
          { name: 'Agachamento Livre', sets: 4, reps: '15-20', rest: '45s', notes: 'Carga moderada' },
          { name: 'Afundo Alternado', sets: 4, reps: '20-24', rest: '30s', notes: '10-12 cada' },
          { name: 'Stiff', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Leg Press', sets: 3, reps: '20-25', rest: '45s', notes: 'Ritmo controlado' },
          { name: 'Abdominal Bicicleta', sets: 4, reps: '30-40', rest: '30s' },
          { name: 'Elevação de Pernas', sets: 3, reps: '15-20', rest: '30s' }
        ]
      },
      {
        day: 'C',
        focus: 'Circuito Superior + Cardio',
        exercises: [
          { name: 'Supino Reto', sets: 4, reps: '15-20', rest: '45s', notes: 'Carga moderada' },
          { name: 'Remada Baixa', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Desenvolvimento Halteres', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Puxada Frontal', sets: 3, reps: '15-20', rest: '45s' },
          { name: 'Battle Rope', sets: 4, reps: '30s', rest: '30s', notes: 'Intensidade máxima' },
          { name: 'Box Jump', sets: 3, reps: '12-15', rest: '45s' }
        ]
      },
      {
        day: 'D',
        focus: 'Circuito Metabólico Full',
        exercises: [
          { name: 'Kettlebell Swing', sets: 4, reps: '20-25', rest: '30s', notes: 'Explosão quadril' },
          { name: 'Thruster', sets: 4, reps: '15-20', rest: '45s', notes: 'Agachamento + desenvolvimento' },
          { name: 'Renegade Row', sets: 3, reps: '12-16', rest: '45s', notes: '6-8 cada lado' },
          { name: 'Jump Squat', sets: 4, reps: '15-20', rest: '30s' },
          { name: 'Prancha com Toque', sets: 3, reps: '20-30', rest: '30s' },
          { name: 'Sprint Estacionário', sets: 4, reps: '30s', rest: '30s', notes: 'Joelhos altos' }
        ]
      },
      {
        day: 'E',
        focus: 'Circuito Resistência + Core',
        exercises: [
          { name: 'Agachamento Sumô', sets: 4, reps: '20-25', rest: '45s' },
          { name: 'Flexão Diamante', sets: 4, reps: '12-15', rest: '45s' },
          { name: 'Afundo Reverso', sets: 4, reps: '20-24', rest: '30s' },
          { name: 'Remada Unilateral', sets: 3, reps: '15-20', rest: '45s', notes: 'Cada lado' },
          { name: 'Russian Twist', sets: 4, reps: '30-40', rest: '30s', notes: 'Com peso' },
          { name: 'Burpee com Flexão', sets: 3, reps: '12-15', rest: '45s' }
        ]
      }
    ]
  },

  // 6. CONDICIONAMENTO - ATLÉTICO (4x semana)
  {
    id: 'conditioning_athletic_4x',
    name: 'Condicionamento Atlético',
    goal: 'condicionamento',
    level: 'intermediario',
    split: 'Funcional Atlético',
    frequency: { min: 4, max: 5 },
    duration: '10-14 semanas',
    principles: [
      'Movimentos funcionais',
      'Potência e explosão',
      'Mobilidade',
      'Performance atlética'
    ],
    sessions: [
      {
        day: 'A',
        focus: 'Potência Inferior + Explosão',
        exercises: [
          { name: 'Power Clean', sets: 5, reps: '3-5', rest: '120s', notes: 'Técnica perfeita' },
          { name: 'Box Jump Alto', sets: 4, reps: '5-8', rest: '90s', notes: 'Máxima altura' },
          { name: 'Agachamento Jump', sets: 4, reps: '8-10', rest: '90s', notes: 'Peso corporal' },
          { name: 'Sprint 40m', sets: 6, reps: '1', rest: '120s', notes: 'Máxima velocidade' },
          { name: 'Afundo Búlgaro', sets: 3, reps: '10-12', rest: '60s' },
          { name: 'Nordic Curl', sets: 3, reps: '6-8', rest: '90s', notes: 'Excêntrico controlado' }
        ]
      },
      {
        day: 'B',
        focus: 'Força Superior + Core',
        exercises: [
          { name: 'Supino Reto', sets: 4, reps: '6-8', rest: '120s', notes: 'Força base' },
          { name: 'Barra Fixa', sets: 4, reps: '8-12', rest: '90s', notes: 'Peso adicional' },
          { name: 'Desenvolvimento Push Press', sets: 4, reps: '6-8', rest: '90s', notes: 'Explosão' },
          { name: 'Remada Curvada', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Landmine Press', sets: 3, reps: '10-12', rest: '60s', notes: 'Rotacional' },
          { name: 'Pallof Press', sets: 3, reps: '12-15', rest: '60s', notes: 'Anti-rotação' }
        ]
      },
      {
        day: 'C',
        focus: 'Agilidade + Mobilidade',
        exercises: [
          { name: 'Cone Drill', sets: 5, reps: '5', rest: '90s', notes: 'Mudança de direção' },
          { name: 'Lateral Shuffle', sets: 4, reps: '10m', rest: '60s', notes: 'Cada lado' },
          { name: 'Agachamento Pistol', sets: 3, reps: '6-8', rest: '90s', notes: 'Cada perna' },
          { name: 'Turkish Get Up', sets: 3, reps: '5', rest: '90s', notes: 'Cada lado' },
          { name: 'Medicine Ball Slam', sets: 4, reps: '10-12', rest: '60s', notes: 'Potência core' },
          { name: 'Yoga Flow', sets: 2, reps: '5min', rest: '60s', notes: 'Mobilidade geral' }
        ]
      },
      {
        day: 'D',
        focus: 'Condicionamento Metabólico',
        exercises: [
          { name: 'Assault Bike', sets: 5, reps: '30s', rest: '90s', notes: 'Máxima intensidade' },
          { name: 'Kettlebell Swing', sets: 4, reps: '20-25', rest: '60s', notes: 'Explosão quadril' },
          { name: 'Battle Rope', sets: 4, reps: '30s', rest: '60s', notes: 'Ondas alternadas' },
          { name: 'Farmer Walk', sets: 4, reps: '40m', rest: '90s', notes: 'Carga pesada' },
          { name: 'Sled Push', sets: 4, reps: '20m', rest: '120s', notes: 'Sprint máximo' },
          { name: 'Burpee Box Jump', sets: 3, reps: '10-12', rest: '90s' }
        ]
      }
    ]
  }
];

// Função para buscar templates por perfil
export function getWorkoutTemplatesByProfile(
  goal: string,
  level: string,
  frequency: number
): WorkoutTemplate[] {
  return workoutTemplates.filter(template => {
    const matchesGoal = template.goal === goal;
    const matchesLevel = template.level === level;
    const matchesFrequency = frequency >= template.frequency.min && frequency <= template.frequency.max;
    
    return matchesGoal && matchesLevel && matchesFrequency;
  });
}

// Função para buscar template por ID
export function getWorkoutTemplateById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find(template => template.id === id);
}

// Função para listar todos os templates
export function getAllWorkoutTemplates(): WorkoutTemplate[] {
  return workoutTemplates;
}

// Função para buscar templates por objetivo
export function getWorkoutTemplatesByGoal(goal: string): WorkoutTemplate[] {
  return workoutTemplates.filter(template => template.goal === goal);
}

// Função para buscar templates por nível
export function getWorkoutTemplatesByLevel(level: string): WorkoutTemplate[] {
  return workoutTemplates.filter(template => template.level === level);
}
