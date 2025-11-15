// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import fetch from "node-fetch"; // <— adicionada para Hostinger + n8n

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------
// GOOGLE AUTH (Sheets)
// -----------------------------------------------------------
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// -----------------------------------------------------------
// FUNÇÃO PARA LER ABA
// -----------------------------------------------------------
async function lerAba(range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return res.data.values || [];
}

// -----------------------------------------------------------
// NORMALIZAÇÃO (apenas para DASHBOARD)
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
    trends: {
      totalTrendData: [],
      positiveTrendData: [],
      neutralTrendData: [],
      negativeTrendData: [],
      trendChange: { total: 0, positivo: 0, neutro: 0, negativo: 0 },
    },
  };
}

function formatDateKey(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// -----------------------------------------------------------
// TENDÊNCIA (mini-gráficos)
// -----------------------------------------------------------
function calcularTrends(allItems) {
  const porDia = {};

  for (const item of allItems) {
    if (!item.data) continue;
    const key = formatDateKey(item.data);
    if (!key) continue;

    if (!porDia[key]) {
      porDia[key] = { total: 0, positivo: 0, neutro: 0, negativo: 0 };
    }

    porDia[key].total++;
    porDia[key][item.sentimento]++;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

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
    const info = porDia[dia] || { total: 0, positivo: 0, neutro: 0, negativo: 0 };
    totalTrendData.push(info.total);
    positiveTrendData.push(info.positivo);
    neutralTrendData.push(info.neutro);
    negativeTrendData.push(info.negativo);
  });

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

  function variation(hojeValor, ontemValor) {
    if (ontemValor === 0) return 0;
    return Math.round(((hojeValor - ontemValor) / ontemValor) * 100);
  }

  return {
    totalTrendData,
    positiveTrendData,
    neutralTrendData,
    negativeTrendData,
    trendChange: {
      total: variation(hojeInfo.total, ontemInfo.total),
      positivo: variation(hojeInfo.positivo, ontemInfo.positivo),
      neutro: variation(hojeInfo.neutro, ontemInfo.neutro),
      negativo: variation(hojeInfo.negativo, ontemInfo.negativo),
    },
  };
}
// -----------------------------------------------------------
// ROTA PRINCIPAL (/api/dashboard)
// -----------------------------------------------------------
app.get("/api/dashboard", async (req, res) => {
  try {
    const comentariosSheet = await lerAba("Comentários!A:Z");
    const storiesSheet = await lerAba("Menção Storie!A:Z");

    // FEED & REELS
    const feed = criarEstrutura();
    const reels = criarEstrutura();
    const tudoComentarios = [];

    if (comentariosSheet.length > 1) {
      const headers = comentariosSheet[0].map((h) => h.trim().toLowerCase());

      const idxSent = headers.indexOf("sentimento");
      const idxCmt = headers.indexOf("conteudo_do_comentario");
      const idxUser = headers.indexOf("username_do_lead");
      const idxTipo = headers.indexOf("tipo_de_publicacao");
      const idxData = headers.indexOf("data");
      const idxHora = headers.indexOf("hora");

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

        tudoComentarios.push(item);

        if (tipo === "FEED") {
          feed.sentimentos[sentimento]++;
          feed.recentes.push(item);
          feed.tudo.push(item);
        }

        if (tipo === "REELS") {
          reels.sentimentos[sentimento]++;
          reels.recentes.push(item);
          reels.tudo.push(item);
        }
      }

      feed.recentes.reverse();
reels.recentes.reverse();

// 🔥 FEED: Apenas 6 últimas
const feedSeisUltimas = feed.recentes.slice(0, 6);
feed.recentes = feedSeisUltimas;

// 🔥 REELS: Apenas 6 últimas
const reelsSeisUltimas = reels.recentes.slice(0, 6);
reels.recentes = reelsSeisUltimas;

// Não mexer! Trends precisam do histórico completo
feed.trends = calcularTrends(feed.tudo);
reels.trends = calcularTrends(reels.tudo);

    }

    // STORY
const story = criarEstrutura();

if (storiesSheet.length > 1) {
  const headers = storiesSheet[0].map((h) => h.trim().toLowerCase());

  const idxSent = headers.indexOf("sentimento");
  const idxResp = headers.indexOf("resposta_ia");
  const idxData = headers.indexOf("data");
  const idxUser = headers.indexOf("username (quando já tivermos salvo)");

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

  // Ordena do mais recente para o mais antigo
  story.recentes.reverse();

  // Faz uma cópia com apenas 6 para o dashboard
  const storySeisUltimas = story.recentes.slice(0, 6);

  // Envia apenas 6 para o front
  story.recentes = storySeisUltimas;

  // Trends continuam usando TUDO
  story.trends = calcularTrends(story.tudo);
}


    // VISÃO GERAL
    const totalPos =
      feed.sentimentos.positivo +
      reels.sentimentos.positivo +
      story.sentimentos.positivo;

    const totalNeu =
      feed.sentimentos.neutro +
      reels.sentimentos.neutro +
      story.sentimentos.neutro;

    const totalNeg =
      feed.sentimentos.negativo +
      reels.sentimentos.negativo +
      story.sentimentos.negativo;

    const totais = {
      total: totalPos + totalNeu + totalNeg,
      positivo: totalPos,
      neutro: totalNeu,
      negativo: totalNeg,
    };

    const percentuais = {
      positivo: totais.total ? Math.round((totalPos / totais.total) * 100) : 0,
      neutro: totais.total ? Math.round((totalNeu / totais.total) * 100) : 0,
      negativo: totais.total ? Math.round((totalNeg / totais.total) * 100) : 0,
    };

    const recentComments = [...tudoComentarios, ...story.tudo]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6);  // somente os 6 mais recentes

    // -----------------------------------------------------------
// TOP 5 ENGAJADORES — REALISTA E EM TEMPO REAL
// -----------------------------------------------------------

// objeto para contagem de interações por usuário
const contador = {};

// função para registrar interações
function registrarInteracao(item) {
  let user = (item.username || "").trim().toLowerCase();

  // ignora vazio
  if (!user || user === "") return;

  // remover possíveis @ duplicados
  if (user.startsWith("@")) user = user.substring(1);

  // normalizar espaços indevidos
  user = user.replace(/\s+/g, "");

  // incrementa
  contador[user] = (contador[user] || 0) + 1;
}

// registrar FEED, REELS, STORY
feed.tudo.forEach(registrarInteracao);
reels.tudo.forEach(registrarInteracao);
story.tudo.forEach(registrarInteracao);

// gerar ranking do mais engajador
const top5Engagers = Object.entries(contador)
  .map(([username, interacoes]) => ({
    username: "@" + username, // devolve com @
    interacoes,
  }))
  .sort((a, b) => b.interacoes - a.interacoes)
  .slice(0, 5);


    res.json({
      status: "ok",
      feed,
      reels,
      story,
      totais,
      percentuais,
      recentComments,
      top5Engagers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});
// -----------------------------------------------------------
// ROTA MONITOR (/monitor/user) – busca por ID ou @username
// -----------------------------------------------------------
app.get("/monitor/user", async (req, res) => {
  try {
    const queryRaw = req.query.q || "";
    const query = String(queryRaw).toLowerCase().trim();

    if (!query) {
      return res.status(400).json({ error: "Parâmetro 'q' é obrigatório" });
    }

    const rows = await lerAba("Comentários!A:Z");
    if (!rows.length) {
      return res.json({ found: false });
    }

    const header = rows[0].map((h) => h.trim().toLowerCase());

    const colId = header.indexOf("id_do_lead");
    const colUser = header.indexOf("username_do_lead");
    const colComent = header.indexOf("conteudo_do_comentario");
    const colDate = header.indexOf("data");
    const colType = header.indexOf("tipo_de_publicacao");
    const colSent = header.indexOf("sentimento");
    const colHora = header.indexOf("hora");

    const results = rows.slice(1).filter((r) => {
      const id = (r[colId] || "").toLowerCase();
      const user = (r[colUser] || "").toLowerCase();

      if (query.startsWith("@")) {
        return user === query.replace("@", "");
      }

      if (query.includes(".")) {
        return user === query;
      }

      return id === query;
    });

    if (results.length === 0) {
      return res.json({ found: false });
    }

    // Contagem EXATA conforme planilha (sem normalizar)
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    const interactions = [];

    results.forEach((r, index) => {
      const sentimentCell = (r[colSent] || "").toLowerCase();

      let sentimentKey = "neutral";
      if (sentimentCell.includes("positivo")) sentimentKey = "positive";
      else if (sentimentCell.includes("negativo")) sentimentKey = "negative";
      else if (sentimentCell.includes("neutro")) sentimentKey = "neutral";

      sentiments[sentimentKey]++;

      interactions.push({
        id: index + 1,
        type: r[colType] || "",
        sentiment: sentimentKey,
        text: r[colComent] || "",
        date: r[colDate] || "",
        time: r[colHora] || "",
      });
    });

    const total =
      sentiments.positive + sentiments.neutral + sentiments.negative || 1;

    const percent = {
      positive: Math.round((sentiments.positive / total) * 100) || 0,
      neutral: Math.round((sentiments.neutral / total) * 100) || 0,
      negative: Math.round((sentiments.negative / total) * 100) || 0,
    };

    // Último engajamento = data da interação mais recente
    const latestDate = results
      .map((r) => r[colDate])
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    res.json({
      found: true,
      instagram_handle: "@" + (results[0][colUser] || ""),
      name: results[0][colUser] || "",
      totalInteractions: total === 1 ? 0 : total, // se só 1 e veio do divisor de segurança, ajusta
      lastEngagement: latestDate || "",
      sentiment: percent,
      interactions,
    });
  } catch (err) {
    console.error("Erro /monitor/user:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});
// -----------------------------------------------------------
// FUNÇÕES AUXILIARES – Hostinger & n8n
// -----------------------------------------------------------
async function getHostingerMetrics() {
  try {
    // Função auxiliar para gerar histórico suave
    const smoothHistory = (base, variance = 0.15, points = 20) => {
      return Array.from({ length: points }).map(() => {
        const variation = base * variance * (Math.random() - 0.5);
        return { value: Number((base + variation).toFixed(2)) };
      });
    };

    return {
      ok: true,
      source: "mock",

      cpu: {
        value: 2.0,
        history: smoothHistory(2.0, 0.3),
      },

      memory: {
        value: 19.0,
        history: smoothHistory(19.0, 0.1),
      },

      disk: {
        usedGB: 13,
        totalGB: 100,
      },

      trafficIn: {
        value: 73.4,
        history: smoothHistory(73.4, 0.25),
      },

      trafficOut: {
        value: 40.1,
        history: smoothHistory(40.1, 0.25),
      },

      bandwidth: {
        usedTB: 0.054,
        totalTB: 8,
      }
    };
  } catch (err) {
    console.error("Erro no mock Hostinger:", err);
    return { ok: false };
  }
}

async function getN8nMetrics() {
  // MOCK REALISTA — baseado no seu painel

  // Dados reais da sua tela
  const prodExecutionsValue = 26565;
  const failedExecutionsValue = 723;
  const failureRateValue = 2.7;
  const avgRuntimeValue = 6.97;

  // Trend suave (10 pontos)
  function smoothHistory(base, variation = 0.1) {
    return Array.from({ length: 10 }).map(() => ({
      value: Number(
        (base + (Math.random() - 0.5) * base * variation).toFixed(2)
      ),
    }));
  }

  // Estimativa simples de tempo salvo
  const timeSavedHours =
    Number(((prodExecutionsValue * 60 - prodExecutionsValue * avgRuntimeValue) / 3600).toFixed(1)) || 0;

  return {
    ok: true,
    source: "mock-n8n",

    prodExecutions: {
      value: prodExecutionsValue,
      changePct: -51.97,
      history: smoothHistory(prodExecutionsValue, 0.15),
    },

    failedExecutions: {
      value: failedExecutionsValue,
      changePct: 96.1,
      history: smoothHistory(failedExecutionsValue, 0.25),
    },

    failureRate: {
      value: failureRateValue,
      changePct: -30.8,
      history: smoothHistory(failureRateValue, 0.15),
    },

    avgRuntimeSeconds: {
      value: avgRuntimeValue,
      changePct: -9.33,
      history: smoothHistory(avgRuntimeValue, 0.1),
    },

    timeSavedHours: {
      value: timeSavedHours,
      changePct: 0,
    },
  };
}
// -----------------------------------------------------------
// ROTA CONSOLE (/api/console) – Hostinger + n8n
// -----------------------------------------------------------
app.get("/api/console", async (req, res) => {
  try {
    const [hostinger, n8n] = await Promise.all([
      getHostingerMetrics(),
      getN8nMetrics(),
    ]);

    res.json({
      status: "ok",
      hostinger,
      n8n,
    });
  } catch (err) {
    console.error("Erro /api/console:", err);
    res.status(500).json({ error: "Erro interno no console" });
  }
});

// -----------------------------------------------------------
// INICIAR SERVIDOR
// -----------------------------------------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
