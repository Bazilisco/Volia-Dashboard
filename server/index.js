// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------
// GOOGLE AUTH
// -----------------------------------------------------------
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// -----------------------------------------------------------
// LEITURA DAS ABAS
// -----------------------------------------------------------
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;


async function lerAba(range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  return res.data.values || [];
}

// -----------------------------------------------------------
// NORMALIZAÇÕES (igual Apps Script)
// -----------------------------------------------------------
function normalizarSentimento(s) {
  s = (s || "").toLowerCase();
  if (s.includes("pos")) return "positivo";
  if (s.includes("neu")) return "neutro";
  if (s.includes("neg")) return "negativo";
  return "neutro";
}

function criarEstrutura() {
  return {
    sentimentos: { positivo: 0, neutro: 0, negativo: 0 },
    recentes: [],
    tudo: [],
  };
}

// helper para formatar data YYYY-MM-DD
function formatDateKey(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// -----------------------------------------------------------
// FUNÇÃO: GERAR TENDÊNCIA ÚLTIMOS 7 DIAS + VARIAÇÃO HOJE/ONTEM
// -----------------------------------------------------------
function calcularTrends(allItems) {
  // mapa: "YYYY-MM-DD" -> contagens
  const porDia = {};

  for (const item of allItems) {
    if (!item.data) continue;
    const key = formatDateKey(item.data);
    if (!key) continue;

    if (!porDia[key]) {
      porDia[key] = {
        total: 0,
        positivo: 0,
        neutro: 0,
        negativo: 0,
      };
    }

    porDia[key].total += 1;
    if (item.sentimento === "positivo") porDia[key].positivo += 1;
    else if (item.sentimento === "negativo") porDia[key].negativo += 1;
    else porDia[key].neutro += 1;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // gerar últimos 7 dias (do mais antigo pro mais recente)
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    dias.push(formatDateKey(d));
  }

  const totalTrendData = [];
  const positiveTrendData = [];
  const neutralTrendData = [];
  const negativeTrendData = [];

  dias.forEach((dia) => {
    const info = porDia[dia] || {
      total: 0,
      positivo: 0,
      neutro: 0,
      negativo: 0,
    };

    totalTrendData.push(info.total);
    positiveTrendData.push(info.positivo);
    neutralTrendData.push(info.neutro);
    negativeTrendData.push(info.negativo);
  });

  // variação de hoje vs ontem
  const hojeKey = formatDateKey(hoje);
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);
  const ontemKey = formatDateKey(ontem);

  const hojeInfo = porDia[hojeKey] || {
    total: 0,
    positivo: 0,
    neutro: 0,
    negativo: 0,
  };
  const ontemInfo = porDia[ontemKey] || {
    total: 0,
    positivo: 0,
    neutro: 0,
    negativo: 0,
  };

  function calcChange(hojeVal, ontemVal) {
    if (!ontemVal || ontemVal === 0) return 0;
    return Math.round(((hojeVal - ontemVal) / ontemVal) * 100);
  }

  const trendChange = {
    total: calcChange(hojeInfo.total, ontemInfo.total),
    positivo: calcChange(hojeInfo.positivo, ontemInfo.positivo),
    neutro: calcChange(hojeInfo.neutro, ontemInfo.neutro),
    negativo: calcChange(hojeInfo.negativo, ontemInfo.negativo),
  };

  return {
    totalTrendData,
    positiveTrendData,
    neutralTrendData,
    negativeTrendData,
    trendChange,
  };
}

// -----------------------------------------------------------
// ROTA PRINCIPAL DO DASHBOARD
// -----------------------------------------------------------
app.get("/api/dashboard", async (req, res) => {
  try {
    // Ler abas
    const comentariosSheet = await lerAba("Comentários!A:Z");
    const storiesSheet = await lerAba("Menção Storie!A:Z");

    // ------------------------
    // Ler Comentários (Feed/Reels)
    // ------------------------
    const comentarios = (() => {
      if (!comentariosSheet.length) {
        return { feed: criarEstrutura(), reels: criarEstrutura(), tudo: [] };
      }

      const headers = comentariosSheet[0].map((h) => h.trim().toLowerCase());
      const idxSent = headers.indexOf("sentimento");
      const idxCmt = headers.indexOf("conteudo_do_comentario");
      const idxUser = headers.indexOf("username_do_lead");
      const idxTipo = headers.indexOf("tipo_de_publicacao");
      const idxData = headers.indexOf("data");
      const idxHora = headers.indexOf("hora");

      const feed = criarEstrutura();
      const reels = criarEstrutura();
      const tudo = [];

      for (let i = 1; i < comentariosSheet.length; i++) {
        const row = comentariosSheet[i];

        const tipo = (row[idxTipo] || "").toUpperCase();
        const sentimento = normalizarSentimento(row[idxSent]);

        const item = {
          username: row[idxUser] || "",
          comentario: row[idxCmt] || "",
          data: row[idxData] || "",
          hora: row[idxHora] || "",
          sentimento,
          tipo,
        };

        tudo.push(item);

        if (tipo === "FEED") {
          feed.sentimentos[sentimento]++;
          feed.recentes.push(item);
        }
        if (tipo === "REELS") {
          reels.sentimentos[sentimento]++;
          reels.recentes.push(item);
        }
      }

      feed.recentes.reverse();
      reels.recentes.reverse();

      return { feed, reels, tudo };
    })();

    // ------------------------
    // Ler Menção Storie
    // ------------------------
    const stories = (() => {
      if (!storiesSheet.length) {
        const storyEmpty = criarEstrutura();
        return storyEmpty;
      }

      const headers = storiesSheet[0].map((h) => h.trim().toLowerCase());

      const idxSent = headers.indexOf("sentimento");
      const idxResp = headers.indexOf("resposta_ia");
      const idxData = headers.indexOf("data");
      const idxUser = headers.indexOf("username (quando já tivermos salvo)");

      const story = criarEstrutura();

      for (let i = 1; i < storiesSheet.length; i++) {
        const row = storiesSheet[i];

        const sentimento = normalizarSentimento(row[idxSent]);

        const item = {
          username: row[idxUser] || "",
          comentario: row[idxResp] || "",
          data: row[idxData] || "",
          sentimento,
          tipo: "STORY",
        };

        story.sentimentos[sentimento]++;
        story.recentes.push(item);
        story.tudo.push(item);
      }

      story.recentes.reverse();

      return story;
    })();

    // ------------------------
    // MONTAR DASHBOARD (igual Apps Script)
    // ------------------------
    const totalPos =
      comentarios.feed.sentimentos.positivo +
      comentarios.reels.sentimentos.positivo +
      stories.sentimentos.positivo;

    const totalNeu =
      comentarios.feed.sentimentos.neutro +
      comentarios.reels.sentimentos.neutro +
      stories.sentimentos.neutro;

    const totalNeg =
      comentarios.feed.sentimentos.negativo +
      comentarios.reels.sentimentos.negativo +
      stories.sentimentos.negativo;

    const totalGeral = totalPos + totalNeu + totalNeg || 0;

    const percentuais = totalGeral
      ? {
          positivo: Math.round((totalPos / totalGeral) * 100),
          neutro: Math.round((totalNeu / totalGeral) * 100),
          negativo: Math.round((totalNeg / totalGeral) * 100),
        }
      : { positivo: 0, neutro: 0, negativo: 0 };

    const recentComments = [...comentarios.tudo, ...stories.tudo]
      .sort(
        (a, b) =>
          new Date(b.data + " " + (b.hora || "00:00")).getTime() -
          new Date(a.data + " " + (a.hora || "00:00")).getTime()
      )
      .slice(0, 20);

    const mapa = {};
    [...comentarios.tudo, ...stories.tudo].forEach((item) => {
      const u = item.username || "desconhecido";
      mapa[u] = (mapa[u] || 0) + 1;
    });

    const top5Engagers = Object.keys(mapa)
      .map((u) => ({ username: u, interacoes: mapa[u] }))
      .sort((a, b) => b.interacoes - a.interacoes)
      .slice(0, 5);

    // ------------------------
    // TENDÊNCIA + VARIAÇÃO HOJE/ONTEM
    // ------------------------
    const {
      totalTrendData,
      positiveTrendData,
      neutralTrendData,
      negativeTrendData,
      trendChange,
    } = calcularTrends([...comentarios.tudo, ...stories.tudo]);

    return res.json({
      status: "ok",
      totais: {
        total: totalGeral,
        positivo: totalPos,
        neutro: totalNeu,
        negativo: totalNeg,
      },
      percentuais,
      satisfacao: percentuais.positivo,
      recentComments,
      top5Engagers,
      totalTrendData,
      positiveTrendData,
      neutralTrendData,
      negativeTrendData,
      trendChange,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// -----------------------------------------------------------
// INICIAR SERVIDOR
// -----------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
