import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, Filter, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserProfile, UserProfile } from '@/services/dataService';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FilterType = 'todos' | 'positivos' | 'negativos';

export default function Monitor() {
  const [searchUser, setSearchUser] = useState('');
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUser.trim()) {
      // Busca usuário pelo @ usando dados reais da visão geral
      const normalizedSearch = searchUser.startsWith('@') ? searchUser : `@${searchUser}`;
      const profile = getUserProfile(normalizedSearch);
      
      if (profile) {
        setUserData(profile);
        setNotFound(false);
      } else {
        setUserData(null);
        setNotFound(true);
      }
    }
  };

  const getInitials = (username: string) => {
    const name = username.replace('@', '');
    const parts = name.split(/[._]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-emerald-400 bg-emerald-500/10';
      case 'neutral':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'negative':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Positivo';
      case 'neutral':
        return 'Neutro';
      case 'negative':
        return 'Negativo';
      default:
        return sentiment;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Monitor</h1>
          <p className="text-muted-foreground">Timeline de comentários e menções</p>
        </div>

        {/* Barra de pesquisa */}
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
            Digite o @ de qualquer usuário da visão geral (ex: @ana_silva, @carlos.mendes, @mariana_beauty)
          </p>
        </div>

        {/* Filtros */}
        {userData && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={activeFilter === 'todos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('todos')}
              className={cn(activeFilter === 'todos' && 'bg-primary text-primary-foreground')}
            >
              Todos
            </Button>
            <Button
              variant={activeFilter === 'positivos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('positivos')}
              className={cn(activeFilter === 'positivos' && 'bg-primary text-primary-foreground')}
            >
              Positivos
            </Button>
            <Button
              variant={activeFilter === 'negativos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('negativos')}
              className={cn(activeFilter === 'negativos' && 'bg-primary text-primary-foreground')}
            >
              Negativos
            </Button>
          </div>
        )}

        {/* Estado vazio */}
        {!userData && !notFound && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Insira um @ para começar a busca</h3>
            <p className="text-muted-foreground max-w-md">
              Busque por usuários da visão geral como: @ana_silva, @carlos.mendes, @maria_santos, @joaopedro, @bia_costa, @mariana_beauty
            </p>
          </div>
        )}

        {/* Usuário não encontrado */}
        {notFound && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Usuário não encontrado. Certifique-se de que o @ existe na base de dados da visão geral.
            </AlertDescription>
          </Alert>
        )}

        {/* Dados do usuário */}
        {userData && (
          <div className="space-y-6">
            {/* Card de perfil */}
            <div className="glass rounded-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xl font-semibold">{getInitials(userData.instagram_handle)}</span>
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

              {/* Barras de sentimento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Sentimento Geral</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-3xl font-bold text-emerald-400 mb-1">{userData.sentiment.positive}% Positivo</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Último Engajamento</span>
                  </div>
                  <p className="text-xl font-semibold text-foreground">{userData.lastEngagement}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400">Positivo</span>
                    <span className="text-emerald-400">{userData.sentiment.positive}%</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500"
                      style={{ width: `${userData.sentiment.positive}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-yellow-400">Neutro</span>
                    <span className="text-yellow-400">{userData.sentiment.neutral}%</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500"
                      style={{ width: `${userData.sentiment.neutral}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-red-400">Negativo</span>
                    <span className="text-red-400">{userData.sentiment.negative}%</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${userData.sentiment.negative}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de interações */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Histórico de Interações</h3>
              <div className="space-y-3">
                {userData.interactions
                  .filter((interaction) => {
                    if (activeFilter === 'todos') return true;
                    if (activeFilter === 'positivos') return interaction.sentiment === 'positive';
                    if (activeFilter === 'negativos') return interaction.sentiment === 'negative';
                    return true;
                  })
                  .map((interaction) => (
                  <div
                    key={interaction.id}
                    className="glass rounded-lg p-4 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[40px]">
                        <span className="text-lg font-bold text-primary">{interaction.id}</span>
                        <span className="text-xs text-muted-foreground">{interaction.date}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">{interaction.type}</span>
                          <span 
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                              getSentimentBadgeColor(interaction.sentiment)
                            )}
                          >
                            {getSentimentLabel(interaction.sentiment)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{interaction.text}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{interaction.time}</span>
                    </div>
                  </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
