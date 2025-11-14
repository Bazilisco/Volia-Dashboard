import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboard.service";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await getDashboardData();

        // 🔥 Criar mini-tendências leves (não pesam nada)
        const trendFeed = gerarTrend(response.totais.positivo);
        const trendReels = gerarTrend(response.totais.neutro);
        const trendStory = gerarTrend(response.totais.negativo);

        setData({
          ...response,
          trends: {
            feed: trendFeed,
            reels: trendReels,
            story: trendStory,
          }
        });
      } catch (e) {
        console.error("Erro ao carregar dashboard:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { loading, data };
}


// ----------------------------------------------------
// 🔥 Função para gerar mini-gráficos super leves
// mantendo suavidade e fluidez no dashboard
// ----------------------------------------------------
function gerarTrend(valorBase: number) {
  const points = [];
  let v = valorBase * 0.7;

  for (let i = 0; i < 7; i++) {
    v += Math.random() * (valorBase * 0.05);
    points.push(Math.round(v));
  }

  return points;
}
