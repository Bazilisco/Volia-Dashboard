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
