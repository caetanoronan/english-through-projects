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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function title(content) {
  return {
    title: [
      {
        type: "text",
        text: { content }
      }
    ]
  };
}

function richText(content) {
  return {
    rich_text: [
      {
        type: "text",
        text: { content }
      }
    ]
  };
}

function select(name) {
  return { select: { name } };
}

function url(value) {
  return value ? { url: value } : { url: null };
}

function date(start) {
  return {
    date: {
      start
    }
  };
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}

function buildChildren(note) {
  const lines = [
    note.note,
    note.link ? `Lyrics/source: ${note.link}` : "",
    note.audioLink ? `Audio/video: ${note.audioLink}` : ""
  ].filter(Boolean);

  return lines.map((line) => ({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: line } }]
    }
  }));
}

function buildPayload(note, parent) {
  const properties = {
    Title: title(note.title),
    Note: richText(note.note),
    Category: select(note.category),
    Source: select("App"),
    Status: select("New"),
    "Created Date": date(note.date)
  };

  if (note.link) {
    properties.Link = url(note.link);
  }

  if (note.audioLink) {
    properties["Audio Link"] = url(note.audioLink);
  }

  return {
    parent,
    properties,
    children: buildChildren(note)
  };
}

function buildChildPagePayload(note, parent) {
  return {
    parent,
    properties: {
      title: title(note.title)
    },
    children: buildChildren(note)
  };
}

async function sendToNotion(token, note, parent) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify(buildPayload(note, parent))
  });
  const data = await response.json();

  return { response, data };
}

async function sendChildPageToNotion(token, note, parent) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify(buildChildPagePayload(note, parent))
  });
  const data = await response.json();

  return { response, data };
}

async function createNotePage(input) {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_NOTES_DATA_SOURCE_ID || process.env.NOTION_NOTES_DATABASE_ID;

  if (!token) {
    return { ok: false, status: 500, message: "NOTION_TOKEN nao configurado no backend." };
  }

  if (!dataSourceId) {
    return { ok: false, status: 500, message: "NOTION_NOTES_DATA_SOURCE_ID nao configurado no backend." };
  }

  const note = {
    title: cleanText(input.title, 140) || "English Through Projects note",
    note: cleanText(input.note, 2000),
    category: cleanText(input.category, 60) || "General",
    link: cleanText(input.link, 1000),
    audioLink: cleanText(input.audioLink, 1000),
    date: cleanText(input.date, 10) || new Date().toISOString().slice(0, 10)
  };

  if (!note.note && !note.link && !note.audioLink) {
    return { ok: false, status: 400, message: "Note, link ou audioLink e obrigatorio." };
  }

  let { response, data } = await sendToNotion(token, note, { data_source_id: dataSourceId });

  if (!response.ok && [400, 404].includes(response.status)) {
    const fallback = await sendToNotion(token, note, { database_id: dataSourceId });
    response = fallback.response;
    data = fallback.data;
  }

  if (!response.ok && response.status === 400 && /is a page, not a database/i.test(data.message || "")) {
    const pageFallback = await sendChildPageToNotion(token, note, { page_id: dataSourceId });
    response = pageFallback.response;
    data = pageFallback.data;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Erro ao criar note no Notion."
    };
  }

  return { ok: true, status: 201, pageUrl: data.url };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Metodo nao permitido." });
    return;
  }

  try {
    const result = await createNotePage(parseBody(req.body));
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Erro inesperado ao enviar note.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
