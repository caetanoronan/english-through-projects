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

function select(name) {
  return { select: { name } };
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

function buildDatabasePayload(sentence, parent) {
  return {
    parent,
    properties: {
      Sentence: title(sentence.preview),
      FullText: richText(sentence.text),
      Theme: select(sentence.theme),
      Source: select("App"),
      Status: select("New")
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: sentence.text } }]
        }
      }
    ]
  };
}

function buildChildPagePayload(sentence, parent) {
  return {
    parent,
    properties: {
      title: title(sentence.preview)
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Today's Sentence" } }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: sentence.text } }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: `Theme: ${sentence.theme}` } }]
        }
      }
    ]
  };
}

async function sendPayloadToNotion(token, payload) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();

  return { response, data };
}

async function sendDatabaseEntryToNotion(token, sentence, parent) {
  return sendPayloadToNotion(token, buildDatabasePayload(sentence, parent));
}

async function sendChildPageToNotion(token, sentence, parent) {
  return sendPayloadToNotion(token, buildChildPagePayload(sentence, parent));
}

async function createSentencePage(input) {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_SENTENCES_DATA_SOURCE_ID || process.env.NOTION_SENTENCE_DATA_SOURCE_ID;

  if (!token) {
    return { ok: false, status: 500, message: "NOTION_TOKEN nao configurado no backend." };
  }

  if (!dataSourceId) {
    return { ok: false, status: 500, message: "NOTION_SENTENCES_DATA_SOURCE_ID nao configurado no backend." };
  }

  const text = cleanText(input.text, 2000);

  if (!text) {
    return { ok: false, status: 400, message: "Sentence text e obrigatorio." };
  }

  const sentence = {
    text,
    preview: text.slice(0, 90),
    theme: cleanText(input.theme, 60) || "Daily Practice"
  };
  let { response, data } = await sendDatabaseEntryToNotion(token, sentence, { data_source_id: dataSourceId });

  if (!response.ok && [400, 404].includes(response.status)) {
    const fallback = await sendDatabaseEntryToNotion(token, sentence, { database_id: dataSourceId });
    response = fallback.response;
    data = fallback.data;
  }

  if (!response.ok && response.status === 400 && /is a page, not a database/i.test(data.message || "")) {
    const pageFallback = await sendChildPageToNotion(token, sentence, { page_id: dataSourceId });
    response = pageFallback.response;
    data = pageFallback.data;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Erro ao criar sentence no Notion."
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
    const result = await createSentencePage(parseBody(req.body));
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Erro inesperado ao enviar sentence.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
