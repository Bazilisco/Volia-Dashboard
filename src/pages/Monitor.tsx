import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, Filter, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ============================================
// 🔧 MOCK: MODELO DE USERPROFILE
// (Agora o arquivo não quebra. Depois conectamos ao backend.)
// ============================================
interface Interaction {
  id: number;
  type: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  text: string;
  date: string;
  time: string;
}

interface UserProfile {
  instagram_handle: string;
  name: string;
  totalInteractions: number;
  lastEngagement: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  interactions: Interaction[];
}

// ============================================
// 🔧 MOCK: BUSCA LOCAL TEMPORÁRIA
// (Substitui o antigo getUserProfile)
// ============================================
function mockSearchUser(username: string): UserProfile | null {
  const base = username.toLowerCase();

  if (base === '@teste' || base === '@ana_silva') {
    return {
      instagram_handle: username,
      name: "Ana Silva",
      totalInteractions: 128,
      lastEngagement: "2025-11-13",
      sentiment: {
        positive: 72,
        neutral: 20,
        negative: 8,
      },
      interactions: [
        {
          id: 1,
          type: "Feed",
          sentiment: "positive",
          text: "Amei o conteúdo! Muito bom 💜",
          date: "2025-11-12",
          time: "14:22",
        },
        {
          id: 2,
          type: "Reels",
          sentiment: "neutral",
          text: "Interessante 🤔",
          date: "2025-11-12",
          time: "08:11",
        },
        {
          id: 3,
          type: "Story",
          sentiment: "negative",
          text: "Não curti muito essa parte",
          date: "2025-11-11",
          time: "18:47",
        },
      ],
    };
  }

  return null;
}

type FilterType = 'todos' | 'positivos' | 'negativos';

export default function Monitor() {
  const [searchUser, setSearchUser] = useState('');
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchUser.trim()) return;

    const normalized = searchUser.startsWith('@')
      ? searchUser
      : `@${searchUser}`;

    const profile = mockSearchUser(normalized);

    if (profile) {
      setUserData(profile);
      setNotFound(false);
    } else {
      setUserData(null);
      setNotFound(true);
    }
  };

  const getInitials = (username: string) => {
    const name = username.replace('@', '');
    const parts = name.split(/[._]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400 bg-emerald-500/10';
      case 'neutral': return 'text-yellow-400 bg-yellow-500/10';
      case 'negative': return 'text-red-400 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'neutral': return 'Neutro';
      case 'negative': return 'Negativo';
      default: return sentiment;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-4xl font-bold mb-2">Monitor</h1>
          <p className="text-muted-foreground">Timeline de comentários e menções</p>
        </div>

        {/* Busca */}
        <div className="glass rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Busque por @instagram..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </form>

          <p className="text-xs text-muted-foreground mt-2">
            Exemplo: @teste ou @ana_silva
          </p>
        </div>

        {/* Usuário não encontrado */}
        {notFound && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Usuário não encontrado.</AlertDescription>
          </Alert>
        )}

        {/* Usuário encontrado */}
        {userData && (
          <div className="space-y-6">

            {/* Perfil */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl font-semibold">
                    {getInitials(userData.instagram_handle)}
                  </span>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{userData.instagram_handle}</h2>
                  <p className="text-muted-foreground mb-2">{userData.name}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Total de Interações</span>
                      <p className="text-2xl font-bold text-foreground">{userData.totalInteractions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentimentos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm text-muted-foreground">Sentimento Geral</span>
                  <p className="text-3xl font-bold text-emerald-400 mb-1">
                    {userData.sentiment.positive}% Positivo
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Último Engajamento</span>
                  <p className="text-xl font-semibold text-foreground">{userData.lastEngagement}</p>
                </div>
              </div>

              {/* Barras */}
              <div className="mt-6 space-y-3">
                {['positive','neutral','negative'].map((sent) => (
                  <div key={sent}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={getSentimentBadgeColor(sent)}>{getSentimentLabel(sent)}</span>
                      <span>{userData.sentiment[sent]}%</span>
                    </div>
                    <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${userData.sentiment[sent]}%`,
                          backgroundColor:
                            sent === 'positive' ? '#22c55e' :
                            sent === 'neutral' ? '#eab308' :
                            '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interações */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Histórico de Interações</h3>

              {userData.interactions.map((i) => (
                <div
                  key={i.id}
                  className="glass rounded-lg p-4 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <span className="text-lg font-bold text-primary">{i.id}</span>
                      <span className="text-xs text-muted-foreground">{i.date}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">{i.type}</span>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                            getSentimentBadgeColor(i.sentiment)
                          )}
                        >
                          {getSentimentLabel(i.sentiment)}
                        </span>
                      </div>

                      <p className="text-muted-foreground">{i.text}</p>
                    </div>

                    <span className="text-xs text-muted-foreground">{i.time}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
