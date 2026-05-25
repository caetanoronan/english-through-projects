const NOTION_VERSION = process.env.NOTION_VERSION || "2026-03-11";

const allowedOrigins = [
  "https://caetanoronan.github.io",
  "https://english-through-projects.vercel.app"
];

function isAllowedOrigin(origin) {
  if (!origin) {
    return false;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (/^https:\/\/[^/]+\.github\.io$/.test(origin)) {
    return true;
  }

  if (/^https:\/\/[^/]+\.vercel\.app$/.test(origin)) {
    return true;
  }

  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  return false;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function richTextToPlainText(value) {
  return (value?.rich_text || []).map((item) => item.plain_text || "").join("").trim();
}

function titleToPlainText(value) {
  return (value?.title || []).map((item) => item.plain_text || "").join("").trim();
}

function selectToPlainText(value) {
  return value?.select?.name || "";
}

function findProperty(properties, expectedName) {
  const exact = properties[expectedName];

  if (exact) {
    return exact;
  }

  const normalizedName = expectedName.trim().toLowerCase();
  const entry = Object.entries(properties).find(([name]) => name.trim().toLowerCase() === normalizedName);

  return entry ? entry[1] : undefined;
}

function pageToWord(page) {
  const properties = page.properties || {};
  const term = titleToPlainText(findProperty(properties, "Term"));

  if (!term) {
    return null;
  }

  return {
    term,
    tag: selectToPlainText(findProperty(properties, "Tag")) || "Personal",
    meaning: richTextToPlainText(findProperty(properties, "Meaning")),
    translation: richTextToPlainText(findProperty(properties, "Translation")),
    example: richTextToPlainText(findProperty(properties, "Example")),
    source: "Notion"
  };
}

async function queryNotion(token, dataSourceId, parent) {
  const response = await fetch(`https://api.notion.com/v1/${parent}/${dataSourceId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify({
      page_size: 100,
      sorts: [{ timestamp: "created_time", direction: "descending" }]
    })
  });
  const data = await response.json();

  return { response, data };
}

async function listVocabularyWords() {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!token) {
    return { ok: false, status: 500, message: "NOTION_TOKEN nao configurado no backend." };
  }

  if (!dataSourceId) {
    return { ok: false, status: 500, message: "NOTION_DATA_SOURCE_ID nao configurado no backend." };
  }

  let { response, data } = await queryNotion(token, dataSourceId, "data_sources");

  if (!response.ok && [400, 404].includes(response.status)) {
    const fallback = await queryNotion(token, dataSourceId, "databases");
    response = fallback.response;
    data = fallback.data;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Erro ao listar vocabulario do Notion."
    };
  }

  const words = (data.results || []).map(pageToWord).filter(Boolean);

  return { ok: true, status: 200, words };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, message: "Metodo nao permitido." });
    return;
  }

  try {
    const result = await listVocabularyWords();
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Erro inesperado ao listar vocabulario.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
