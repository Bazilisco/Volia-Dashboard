import { Smile, Meh, Frown } from 'lucide-react';
import { useMemo } from 'react';

interface SatisfactionGaugeProps {
  positiveValue: number;
  neutralValue: number;
  negativeValue: number;
}

export const SatisfactionGauge = ({ positiveValue, neutralValue, negativeValue }: SatisfactionGaugeProps) => {
  const { score, angle, emoji } = useMemo(() => {
    const total = positiveValue + neutralValue + negativeValue;
    if (total === 0) return { score: 50, angle: 0, emoji: 'neutral' };
    
    // Calcula score de 0 a 100 (positivo=100, neutro=50, negativo=0)
    const calculatedScore = ((positiveValue * 100 + neutralValue * 50 + negativeValue * 0) / total);
    
    // Converte score para ângulo (-90 a 90 graus)
    const calculatedAngle = (calculatedScore - 50) * 1.8;
    
    // Define emoji baseado no score
    let selectedEmoji = 'neutral';
    if (calculatedScore >= 60) selectedEmoji = 'positive';
    else if (calculatedScore <= 40) selectedEmoji = 'negative';
    
    return { score: calculatedScore, angle: calculatedAngle, emoji: selectedEmoji };
  }, [positiveValue, neutralValue, negativeValue]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div className="relative w-full max-w-xs">
        {/* Arc Background */}
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Negative Arc - Red pastel */}
          <path
            d="M 20 100 A 80 80 0 0 1 66.66 33.33"
            fill="none"
            stroke="rgba(239, 68, 68, 0.2)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Neutral Arc - Yellow pastel */}
          <path
            d="M 66.66 33.33 A 80 80 0 0 1 133.33 33.33"
            fill="none"
            stroke="rgba(234, 179, 8, 0.2)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Positive Arc - Green pastel */}
          <path
            d="M 133.33 33.33 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Pointer */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="6" fill="white" />
          </g>
        </svg>

        {/* Emoji Indicators */}
        <div className="absolute top-0 left-0 w-full h-full flex items-end justify-between px-2 pb-2">
          {/* Negative Emoji */}
          <div className={`flex flex-col items-center transition-all duration-300 ${emoji === 'negative' ? 'scale-125' : 'scale-100 opacity-50'}`}>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center backdrop-blur-sm">
              <Frown className="w-6 h-6 text-red-300" />
            </div>
          </div>

          {/* Neutral Emoji */}
          <div className={`flex flex-col items-center transition-all duration-300 ${emoji === 'neutral' ? 'scale-125' : 'scale-100 opacity-50'}`}>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center backdrop-blur-sm">
              <Meh className="w-6 h-6 text-yellow-300" />
            </div>
          </div>

          {/* Positive Emoji */}
          <div className={`flex flex-col items-center transition-all duration-300 ${emoji === 'positive' ? 'scale-125' : 'scale-100 opacity-50'}`}>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
              <Smile className="w-6 h-6 text-green-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="mt-6 text-center">
        <p className="text-4xl font-bold font-mono-data mb-1">{score.toFixed(1)}%</p>
        <p className="text-sm text-muted-foreground">Índice de Satisfação</p>
      </div>
    </div>
  );
};
