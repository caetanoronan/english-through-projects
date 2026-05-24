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

function select(name) {
  return { select: { name } };
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

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
}

function buildChildren(word) {
  const lines = [
    `Meaning: ${word.meaning}`,
    `Translation: ${word.translation || "Not provided"}`,
    `Example: ${word.example || "Not provided"}`
  ];

  return lines.map((line) => ({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: line } }]
    }
  }));
}

async function createVocabularyPage(wordInput) {
  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!token) {
    return { ok: false, status: 500, message: "NOTION_TOKEN nao configurado no backend." };
  }

  if (!dataSourceId) {
    return { ok: false, status: 500, message: "NOTION_DATA_SOURCE_ID nao configurado no backend." };
  }

  const word = {
    term: cleanText(wordInput.term, 120),
    tag: cleanText(wordInput.tag, 60) || "Personal",
    meaning: cleanText(wordInput.meaning, 1200),
    translation: cleanText(wordInput.translation, 300),
    example: cleanText(wordInput.example, 800)
  };

  if (!word.term || !word.meaning) {
    return { ok: false, status: 400, message: "Term e meaning sao obrigatorios." };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION
    },
    body: JSON.stringify({
      parent: { data_source_id: dataSourceId },
      properties: {
        Term: title(word.term),
        Tag: select(word.tag),
        Meaning: richText(word.meaning),
        Translation: richText(word.translation),
        Example: richText(word.example),
        Source: select("App"),
        Status: select("New")
      },
      children: buildChildren(word)
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Erro ao criar palavra no Notion."
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
    const result = await createVocabularyPage(parseBody(req.body));
    res.status(result.status).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Erro inesperado ao enviar vocabulario.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
};
