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

function titleToPlainText(value) {
  return (value?.title || []).map((item) => item.plain_text || "").join("").trim();
}

function richTextToPlainText(value) {
  return (value?.rich_text || []).map((item) => item.plain_text || "").join("").trim();
}

function selectToPlainText(value) {
  return value?.select?.name || "";
}

function urlToPlainText(value) {
  return value?.url || "";
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

function splitCommaList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractField(note, label) {
  const labels = ["Style", "Focus", "Vocabulary", "Practice lines"];
  const otherLabels = labels.filter((item) => item.toLowerCase() !== label.toLowerCase()).join("|");
  const match = String(note || "").match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\s+(?:${otherLabels}):|$)`, "i"));

  return match ? match[1].trim() : "";
}

function pageToSong(page) {
  const properties = page.properties || {};
  const category = selectToPlainText(findProperty(properties, "Category"));

  if (!["Music", "Lyrics"].includes(category)) {
    return null;
  }

  const title = titleToPlainText(findProperty(properties, "Title"));
  const note = richTextToPlainText(findProperty(properties, "Note"));
  const studyLink = urlToPlainText(findProperty(properties, "Link"));
  const audioLink = urlToPlainText(findProperty(properties, "Audio Link"));
  const cleanedTitle = title.replace(/^Music (link|study)\s*-\s*/i, "").trim() || title;

  if (!cleanedTitle || (!studyLink && !audioLink)) {
    return null;
  }

  return {
    title: cleanedTitle,
    style: extractField(note, "Style") || "Notion music study",
    focus: extractField(note, "Focus") || "Listening and vocabulary",
    activity: "Open the lyrics/source link, listen to the song, then collect useful words and expressions.",
    studyLink,
    audioLink,
    lines: [extractField(note, "Practice lines") || "Practice phrase: listen once, then write useful words from this song."],
    vocabulary: splitCommaList(extractField(note, "Vocabulary")).length
      ? splitCommaList(extractField(note, "Vocabulary"))
      : ["listening", "lyrics", "rhythm"],
    expressions: [],
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

async function retrieveDatabase(token, databaseId) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION
    }
  });
  const data = await response.json();

  return { response, data };
}

async function listMusicStudies() {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_NOTES_DATA_SOURCE_ID || process.env.NOTION_NOTES_DATABASE_ID;

  if (!token) {
    return { ok: false, status: 500, message: "NOTION_TOKEN nao configurado no backend." };
  }

  if (!dataSourceId) {
    return { ok: false, status: 500, message: "NOTION_NOTES_DATA_SOURCE_ID nao configurado no backend." };
  }

  let { response, data } = await queryNotion(token, dataSourceId, "data_sources");

  if (!response.ok && [400, 404].includes(response.status)) {
    const databaseLookup = await retrieveDatabase(token, dataSourceId);

    if (databaseLookup.response.ok && databaseLookup.data.data_sources?.length) {
      const sourceId = databaseLookup.data.data_sources[0].id;
      const sourceFallback = await queryNotion(token, sourceId, "data_sources");

      response = sourceFallback.response;
      data = sourceFallback.data;
    } else {
      response = databaseLookup.response;
      data = databaseLookup.data;
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Erro ao listar musicas do Notion."
    };
  }

  const songs = (data.results || []).map(pageToSong).filter(Boolean);

  return { ok: true, status: 200, songs };
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
    const result = await listMusicStudies();
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Erro inesperado ao listar musicas.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
