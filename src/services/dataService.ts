/**
 * Serviço de Integração com Planilha
 * 
 * Este arquivo está preparado para integrar com dados de uma planilha.
 * Para conectar com uma planilha real (Google Sheets, Excel, etc.), 
 * substitua as funções mock por chamadas à API correspondente.
 * 
 * Estrutura esperada da planilha:
 * - instagram_handle: @ do Instagram (obrigatório, formato @username)
 * - name: Nome do usuário (opcional)
 * - avatar: Iniciais (opcional, será gerado automaticamente se não fornecido)
 * - interactions: Número de interações (para top engajadores)
 * - trend: Tendência de crescimento (ex: +12%, -2%)
 * - type: Tipo de interação (story, feed, reels)
 * - comment: Texto do comentário
 * - sentiment: Sentimento (positive, neutral, negative)
 * - time: Tempo relativo (ex: "2 min", "agora")
 */

export interface UserComment {
  id: number;
  instagram_handle: string;
  name?: string;
  avatar: string;
  type: 'story' | 'feed' | 'reels';
  comment: string;
  time: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface TopEngager {
  id: number;
  instagram_handle: string;
  name?: string;
  avatar: string;
  interactions: number;
  trend: string;
}

/**
 * Gera avatar (iniciais) a partir do instagram handle
 */
export const generateAvatar = (instagram_handle: string): string => {
  const username = instagram_handle.replace('@', '');
  const parts = username.split(/[._]/);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
};

/**
 * PLACEHOLDER: Buscar comentários da planilha
 * 
 * Para integrar com Google Sheets:
 * 1. Use a Google Sheets API v4
 * 2. Configure as credenciais no Lovable Cloud
 * 3. Substitua esta função pela chamada real
 * 
 * Exemplo de integração:
 * const response = await fetch('SUA_API_ENDPOINT/comments');
 * return response.json();
 */
export const fetchCommentsFromSheet = async (): Promise<UserComment[]> => {
  // TODO: Implementar integração com planilha
  // Esta é uma função mock que retorna dados de exemplo
  
  return [
    { 
      id: 1, 
      instagram_handle: '@ana_silva', 
      name: 'Ana Silva', 
      avatar: 'AS', 
      type: 'story', 
      comment: 'Adorei o conteúdo! Muito inspirador 🔥', 
      time: '2 min', 
      sentiment: 'positive' 
    },
    { 
      id: 2, 
      instagram_handle: '@carlos.mendes', 
      name: 'Carlos Mendes', 
      avatar: 'CM', 
      type: 'feed', 
      comment: 'Qualidade impecável como sempre', 
      time: '5 min', 
      sentiment: 'positive' 
    },
  ];
};

/**
 * PLACEHOLDER: Buscar top engajadores da planilha
 * 
 * Para integrar com planilha:
 * const response = await fetch('SUA_API_ENDPOINT/top-engagers');
 * return response.json();
 */
export const fetchTopEngagersFromSheet = async (): Promise<TopEngager[]> => {
  // TODO: Implementar integração com planilha
  
  return [
    { 
      id: 1, 
      instagram_handle: '@ana_silva', 
      name: 'Ana Silva', 
      avatar: 'AS', 
      interactions: 147, 
      trend: '+12%' 
    },
    { 
      id: 2, 
      instagram_handle: '@carlos.mendes', 
      name: 'Carlos Mendes', 
      avatar: 'CM', 
      interactions: 132, 
      trend: '+8%' 
    },
  ];
};

/**
 * Valida o formato do instagram handle
 */
export const validateInstagramHandle = (handle: string): boolean => {
  // Deve começar com @ e ter apenas letras, números, underscores e pontos
  const regex = /^@[a-zA-Z0-9._]+$/;
  return regex.test(handle);
};

/**
 * Normaliza o instagram handle (adiciona @ se não tiver)
 */
export const normalizeInstagramHandle = (handle: string): string => {
  if (!handle) return '';
  return handle.startsWith('@') ? handle : `@${handle}`;
};

/**
 * Estrutura de dados completa do usuário incluindo histórico
 */
export interface UserProfile {
  instagram_handle: string;
  name: string;
  avatar: string;
  totalInteractions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  lastEngagement: string;
  interactions: Array<{
    id: number;
    type: string;
    date: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    text: string;
    time: string;
  }>;
}

/**
 * Base de dados de todos os usuários com histórico completo
 * Em produção, isso virá de uma planilha ou banco de dados
 */
const usersDatabase: Record<string, UserProfile> = {
  '@ana_silva': {
    instagram_handle: '@ana_silva',
    name: 'Ana Silva',
    avatar: 'AS',
    totalInteractions: 147,
    sentiment: {
      positive: 85,
      neutral: 10,
      negative: 5,
    },
    lastEngagement: '2 min atrás',
    interactions: [
      { id: 12, type: 'Story Reply', date: '12.11', sentiment: 'positive', text: 'Adorei o conteúdo! Muito inspirador 🔥', time: '14:32' },
      { id: 11, type: 'Feed', date: '10.11', sentiment: 'positive', text: 'Perfeito! Continue postando conteúdo assim', time: '09:15' },
      { id: 10, type: 'Reels', date: '08.11', sentiment: 'positive', text: 'Esse vídeo ficou incrível! Compartilhei', time: '16:47' },
      { id: 9, type: 'Story Reply', date: '07.11', sentiment: 'neutral', text: 'Interessante, gostaria de ver mais sobre isso', time: '11:23' },
      { id: 8, type: 'Feed', date: '05.11', sentiment: 'positive', text: 'Conteúdo de qualidade como sempre! 👏', time: '20:08' },
      { id: 7, type: 'DM', date: '03.11', sentiment: 'positive', text: 'Muito obrigada pela resposta! Vocês são incríveis', time: '15:42' },
      { id: 6, type: 'Reels', date: '01.11', sentiment: 'positive', text: 'Melhor reels que vi hoje! 🔥', time: '18:55' },
    ],
  },
  '@carlos.mendes': {
    instagram_handle: '@carlos.mendes',
    name: 'Carlos Mendes',
    avatar: 'CM',
    totalInteractions: 132,
    sentiment: {
      positive: 78,
      neutral: 15,
      negative: 7,
    },
    lastEngagement: '5 min atrás',
    interactions: [
      { id: 15, type: 'Feed', date: '12.11', sentiment: 'positive', text: 'Qualidade impecável como sempre', time: '10:20' },
      { id: 14, type: 'Story Reply', date: '11.11', sentiment: 'neutral', text: 'Poderia ter mais detalhes sobre o produto', time: '14:15' },
      { id: 13, type: 'Reels', date: '09.11', sentiment: 'positive', text: 'Excelente edição! Muito profissional', time: '16:30' },
      { id: 12, type: 'Feed', date: '07.11', sentiment: 'positive', text: 'Esse post foi muito útil, obrigado!', time: '09:45' },
      { id: 11, type: 'Story Reply', date: '05.11', sentiment: 'positive', text: 'Adorei essa dica! Vou testar', time: '19:20' },
    ],
  },
  '@maria_santos': {
    instagram_handle: '@maria_santos',
    name: 'Maria Santos',
    avatar: 'MS',
    totalInteractions: 87,
    sentiment: {
      positive: 60,
      neutral: 30,
      negative: 10,
    },
    lastEngagement: '8 min atrás',
    interactions: [
      { id: 18, type: 'Reels', date: '12.11', sentiment: 'neutral', text: 'Podia melhorar a edição', time: '11:50' },
      { id: 17, type: 'Feed', date: '10.11', sentiment: 'positive', text: 'Gostei bastante deste conteúdo', time: '15:30' },
      { id: 16, type: 'Story Reply', date: '08.11', sentiment: 'neutral', text: 'Interessante, mas faltou mais informação', time: '12:15' },
      { id: 15, type: 'Reels', date: '06.11', sentiment: 'positive', text: 'Esse reels ficou muito bom!', time: '17:40' },
      { id: 14, type: 'Feed', date: '04.11', sentiment: 'negative', text: 'Esperava mais desse post', time: '10:25' },
    ],
  },
  '@joaopedro': {
    instagram_handle: '@joaopedro',
    name: 'João Pedro',
    avatar: 'JP',
    totalInteractions: 118,
    sentiment: {
      positive: 88,
      neutral: 8,
      negative: 4,
    },
    lastEngagement: '12 min atrás',
    interactions: [
      { id: 20, type: 'Story Reply', date: '12.11', sentiment: 'positive', text: 'Perfeito! Exatamente o que eu precisava', time: '13:15' },
      { id: 19, type: 'Reels', date: '11.11', sentiment: 'positive', text: 'Melhor conteúdo que vi essa semana! 🚀', time: '16:45' },
      { id: 18, type: 'Feed', date: '09.11', sentiment: 'positive', text: 'Vocês arrasam sempre! Continue assim', time: '11:30' },
      { id: 17, type: 'Story Reply', date: '07.11', sentiment: 'positive', text: 'Amei! Já salvei para ver de novo', time: '14:20' },
      { id: 16, type: 'Reels', date: '05.11', sentiment: 'positive', text: 'Conteúdo top demais! 👏👏👏', time: '19:55' },
    ],
  },
  '@bia_costa': {
    instagram_handle: '@bia_costa',
    name: 'Beatriz Costa',
    avatar: 'BC',
    totalInteractions: 95,
    sentiment: {
      positive: 82,
      neutral: 12,
      negative: 6,
    },
    lastEngagement: '15 min atrás',
    interactions: [
      { id: 22, type: 'Reels', date: '12.11', sentiment: 'positive', text: 'Muito bom! Continue assim 👏', time: '12:40' },
      { id: 21, type: 'Feed', date: '10.11', sentiment: 'positive', text: 'Adorei essa postagem! Muito inspiradora', time: '15:20' },
      { id: 20, type: 'Story Reply', date: '08.11', sentiment: 'positive', text: 'Perfeito! Era isso que eu procurava', time: '10:35' },
      { id: 19, type: 'Reels', date: '06.11', sentiment: 'neutral', text: 'Legal, mas poderia ter mais exemplos', time: '17:15' },
      { id: 18, type: 'Feed', date: '04.11', sentiment: 'positive', text: 'Conteúdo de altíssima qualidade!', time: '14:50' },
    ],
  },
  '@mariana_beauty': {
    instagram_handle: '@mariana_beauty',
    name: 'Mariana Beauty',
    avatar: 'MB',
    totalInteractions: 47,
    sentiment: {
      positive: 85,
      neutral: 10,
      negative: 5,
    },
    lastEngagement: '2 horas atrás',
    interactions: [
      { id: 11, type: 'Comentário', date: '11.22', sentiment: 'positive', text: 'Amei essa base! Muito bom mesmo! A durabilidade é incrível 🎨', time: '14:32' },
      { id: 10, type: 'Story Reply', date: '10.11', sentiment: 'neutral', text: 'Onde compro essa cor?', time: '09:15' },
      { id: 9, type: 'Comentário', date: '09.11', sentiment: 'positive', text: 'Produto maravilhoso! Já é o terceiro que compro', time: '16:47' },
      { id: 8, type: 'DM', date: '08.11', sentiment: 'neutral', text: 'Você fazem entrega para o interior?', time: '11:23' },
      { id: 7, type: 'Comentário', date: '07.11', sentiment: 'positive', text: 'Adorei! Super recomendo 🔥', time: '20:08' },
    ],
  },
};

/**
 * Busca perfil completo do usuário pelo instagram handle
 * Retorna dados da visão geral incluindo histórico e sentimento
 */
export const getUserProfile = (instagram_handle: string): UserProfile | null => {
  const normalized = normalizeInstagramHandle(instagram_handle);
  return usersDatabase[normalized] || null;
};

/**
 * Lista todos os usuários disponíveis no sistema
 */
export const getAllUsers = (): UserProfile[] => {
  return Object.values(usersDatabase);
};
