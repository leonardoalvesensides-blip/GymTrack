// Sistema de geração de treinos personalizados com IA

import { workoutTemplates, type WorkoutTemplate, getWorkoutTemplatesByProfile } from './workout-templates';

export interface UserProfile {
  goal: 'hipertrofia' | 'forca' | 'resistencia' | 'emagrecimento' | 'condicionamento';
  level: 'iniciante' | 'intermediario' | 'avancado';
  frequency: number; // dias por semana
  restrictions?: string[]; // lesões, limitações
  preferences?: string[]; // preferências de exercícios
  equipment?: string[]; // equipamentos disponíveis
  age?: number;
  experience?: number; // meses de treino
}

export interface GeneratedWorkout {
  id: string;
  userId: string;
  template: WorkoutTemplate;
  customizations: string[];
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused';
}

// Função principal para gerar treino personalizado com IA
export async function generatePersonalizedWorkout(
  profile: UserProfile,
  userId: string
): Promise<GeneratedWorkout> {
  // 1. Buscar templates compatíveis com o perfil
  const compatibleTemplates = getWorkoutTemplatesByProfile(
    profile.goal,
    profile.level,
    profile.frequency
  );

  if (compatibleTemplates.length === 0) {
    throw new Error('Nenhum template compatível encontrado para o perfil fornecido');
  }

  // 2. Selecionar o melhor template baseado em critérios adicionais
  let selectedTemplate = compatibleTemplates[0];

  // Lógica de seleção inteligente
  if (profile.experience && profile.experience < 6 && profile.level === 'iniciante') {
    // Priorizar treinos de corpo inteiro para iniciantes
    const fullBodyTemplate = compatibleTemplates.find(t => t.split.includes('Corpo Inteiro'));
    if (fullBodyTemplate) selectedTemplate = fullBodyTemplate;
  }

  if (profile.frequency >= 5 && profile.level === 'avancado') {
    // Priorizar PPL para avançados com alta frequência
    const pplTemplate = compatibleTemplates.find(t => t.split.includes('PPL') || t.split.includes('Push'));
    if (pplTemplate) selectedTemplate = pplTemplate;
  }

  // 3. Aplicar customizações baseadas em restrições e preferências
  const customizations: string[] = [];

  if (profile.restrictions && profile.restrictions.length > 0) {
    customizations.push(`Adaptado para: ${profile.restrictions.join(', ')}`);
    // Aqui você pode adicionar lógica para substituir exercícios específicos
  }

  if (profile.equipment && profile.equipment.length > 0) {
    customizations.push(`Equipamentos disponíveis: ${profile.equipment.join(', ')}`);
  }

  if (profile.age && profile.age > 50) {
    customizations.push('Adaptado para faixa etária 50+: aquecimento estendido, ênfase em mobilidade');
  }

  // 4. Criar o treino gerado
  const generatedWorkout: GeneratedWorkout = {
    id: `workout_${Date.now()}_${userId}`,
    userId,
    template: selectedTemplate,
    customizations,
    createdAt: new Date(),
    status: 'active'
  };

  return generatedWorkout;
}

// Função para gerar prompt para IA (OpenAI) com contexto completo
export function generateAIPrompt(profile: UserProfile, template: WorkoutTemplate): string {
  return `
Você é um personal trainer especializado. Crie um treino personalizado baseado nas seguintes informações:

PERFIL DO USUÁRIO:
- Objetivo: ${profile.goal}
- Nível: ${profile.level}
- Frequência: ${profile.frequency} dias por semana
- Restrições: ${profile.restrictions?.join(', ') || 'Nenhuma'}
- Preferências: ${profile.preferences?.join(', ') || 'Nenhuma'}
- Equipamentos: ${profile.equipment?.join(', ') || 'Academia completa'}
- Idade: ${profile.age || 'Não informada'}
- Experiência: ${profile.experience ? `${profile.experience} meses` : 'Não informada'}

TEMPLATE BASE:
Nome: ${template.name}
Divisão: ${template.split}
Princípios: ${template.principles.join(', ')}

SESSÕES DO TEMPLATE:
${template.sessions.map(session => `
${session.day} - ${session.focus}:
${session.exercises.map(ex => `- ${ex.name}: ${ex.sets}x${ex.reps} (${ex.rest || '60s'} descanso) ${ex.notes ? '- ' + ex.notes : ''}`).join('\n')}
`).join('\n')}

INSTRUÇÕES:
1. Adapte os exercícios se houver restrições ou limitações de equipamento
2. Ajuste séries, repetições e descanso baseado no nível e objetivo
3. Adicione dicas de execução e progressão
4. Sugira aquecimento e alongamento apropriados
5. Inclua orientações de progressão semanal

Forneça o treino personalizado em formato estruturado e detalhado.
`;
}

// Função para validar perfil do usuário
export function validateUserProfile(profile: Partial<UserProfile>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!profile.goal) {
    errors.push('Objetivo é obrigatório');
  }

  if (!profile.level) {
    errors.push('Nível é obrigatório');
  }

  if (!profile.frequency || profile.frequency < 1 || profile.frequency > 7) {
    errors.push('Frequência deve ser entre 1 e 7 dias por semana');
  }

  const validGoals = ['hipertrofia', 'forca', 'resistencia', 'emagrecimento', 'condicionamento'];
  if (profile.goal && !validGoals.includes(profile.goal)) {
    errors.push('Objetivo inválido');
  }

  const validLevels = ['iniciante', 'intermediario', 'avancado'];
  if (profile.level && !validLevels.includes(profile.level)) {
    errors.push('Nível inválido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Função para sugerir ajustes no treino baseado em feedback
export function suggestWorkoutAdjustments(
  workout: GeneratedWorkout,
  feedback: {
    difficulty?: 'muito_facil' | 'facil' | 'adequado' | 'dificil' | 'muito_dificil';
    timeAvailable?: number; // minutos
    enjoyment?: number; // 1-5
    completionRate?: number; // 0-100%
  }
): string[] {
  const suggestions: string[] = [];

  if (feedback.difficulty === 'muito_facil') {
    suggestions.push('Aumentar carga em 5-10%');
    suggestions.push('Adicionar 1-2 séries nos exercícios principais');
    suggestions.push('Reduzir tempo de descanso em 15-30s');
  }

  if (feedback.difficulty === 'muito_dificil') {
    suggestions.push('Reduzir carga em 10-15%');
    suggestions.push('Remover 1 série dos exercícios auxiliares');
    suggestions.push('Aumentar tempo de descanso em 30s');
  }

  if (feedback.timeAvailable && feedback.timeAvailable < 60) {
    suggestions.push('Considerar treino em circuito para otimizar tempo');
    suggestions.push('Focar em exercícios compostos');
    suggestions.push('Reduzir exercícios isolados');
  }

  if (feedback.enjoyment && feedback.enjoyment < 3) {
    suggestions.push('Variar exercícios mantendo o mesmo grupo muscular');
    suggestions.push('Adicionar exercícios preferidos do usuário');
    suggestions.push('Considerar mudança de divisão de treino');
  }

  if (feedback.completionRate && feedback.completionRate < 70) {
    suggestions.push('Simplificar o treino removendo exercícios menos essenciais');
    suggestions.push('Reduzir volume total');
    suggestions.push('Verificar se frequência está adequada à rotina');
  }

  return suggestions;
}

// Função para gerar relatório de progresso
export function generateProgressReport(
  workouts: GeneratedWorkout[],
  period: 'week' | 'month' | 'quarter'
): {
  totalWorkouts: number;
  completionRate: number;
  mostFrequentGoal: string;
  averageFrequency: number;
  recommendations: string[];
} {
  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const totalWorkouts = workouts.length;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts.length / totalWorkouts) * 100 : 0;

  const goals = workouts.map(w => w.template.goal);
  const mostFrequentGoal = goals.sort((a, b) =>
    goals.filter(g => g === a).length - goals.filter(g => g === b).length
  ).pop() || 'hipertrofia';

  const frequencies = workouts.map(w => w.template.frequency.max);
  const averageFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length || 0;

  const recommendations: string[] = [];

  if (completionRate < 60) {
    recommendations.push('Considere reduzir a frequência semanal para melhorar aderência');
  }

  if (completionRate > 90) {
    recommendations.push('Excelente aderência! Considere aumentar a intensidade ou volume');
  }

  if (averageFrequency < 3) {
    recommendations.push('Tente aumentar para pelo menos 3 treinos por semana para melhores resultados');
  }

  return {
    totalWorkouts,
    completionRate,
    mostFrequentGoal,
    averageFrequency,
    recommendations
  };
}
