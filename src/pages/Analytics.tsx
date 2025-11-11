import { DashboardLayout } from '@/components/DashboardLayout';
import { GlassCard } from '@/components/GlassCard';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Analytics() {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<string>('');
  const [keywords, setKeywords] = useState<Array<{ word: string; count: number }>>([]);

  // Função para integrar com a API do Gemini
  const generateWeeklySummary = async () => {
    setIsLoadingSummary(true);
    
    // TODO: Integrar com a API do Gemini aqui
    // Exemplo de estrutura:
    /*
    try {
      const response = await fetch('SUA_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // seus dados aqui
        }),
      });
      
      const data = await response.json();
      setWeeklySummary(data.summary);
      setKeywords(data.keywords);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
    }
    */
    
    // Mock temporário para demonstração
    setTimeout(() => {
      setWeeklySummary('Aguardando integração com API do Gemini...');
      setKeywords([
        { word: 'engajamento', count: 45 },
        { word: 'alcance', count: 38 },
        { word: 'conteúdo', count: 32 },
        { word: 'crescimento', count: 28 },
        { word: 'audiência', count: 24 },
      ]);
      setIsLoadingSummary(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Análises inteligentes com IA</p>
        </div>

        {/* Resumo Semanal Inteligente */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Resumo Semanal Inteligente</h3>
                <p className="text-sm text-muted-foreground">Análise gerada por IA</p>
              </div>
            </div>
            <Button 
              onClick={generateWeeklySummary}
              disabled={isLoadingSummary}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoadingSummary ? 'Gerando...' : 'Gerar Resumo'}
            </Button>
          </div>

          <div className="glass-strong rounded-lg p-6 min-h-[200px]">
            {weeklySummary ? (
              <div className="space-y-4">
                <p className="text-foreground leading-relaxed">{weeklySummary}</p>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    💡 Dica: Integre a API do Gemini na função <code className="px-2 py-1 bg-muted/50 rounded">generateWeeklySummary()</code>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center space-y-2">
                  <Sparkles className="w-12 h-12 mx-auto opacity-50" />
                  <p>Clique em "Gerar Resumo" para obter uma análise inteligente</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Palavras-chave Mais Mencionadas */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Palavras-chave Mais Mencionadas</h3>
              <p className="text-sm text-muted-foreground">Termos mais relevantes da semana</p>
            </div>
          </div>

          {keywords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {keywords.map((keyword, index) => (
                <div 
                  key={index}
                  className="glass-strong rounded-lg p-4 hover:scale-105 transition-transform"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold font-mono-data text-primary">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {keyword.count}×
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {keyword.word}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center space-y-2">
                <TrendingUp className="w-12 h-12 mx-auto opacity-50" />
                <p>Gere o resumo para ver as palavras-chave</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              💡 As palavras-chave serão retornadas pela API do Gemini no formato: <code className="px-2 py-1 bg-muted/50 rounded">{`[{ word: string, count: number }]`}</code>
            </p>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
