const storageKey = "englishThroughProjects";
const themeKey = "englishThroughProjectsTheme";
const onlineVocabularyEndpoint = window.APP_VOCABULARY_ENDPOINT || "https://english-through-projects.vercel.app/api/vocabulary";
const todayKey = new Date().toISOString().slice(0, 10);

let words = [];
let readings = [];
let flashcards = [];
let songs = [];

const fallbackData = {
  words: [
    {
      term: "dataset",
      tag: "Programming",
      meaning: "A structured collection of data used for analysis.",
      translation: "conjunto de dados",
      example: "This dataset contains shoreline measurements from 2024.",
    },
  ],
  readings: [
    {
      title: "Coastal Monitoring",
      text: "Coastal monitoring combines field observations, satellite imagery, and spatial analysis to understand how shorelines change over time.",
    },
  ],
  flashcards: [
    {
      front: "sampling",
      back: "Amostragem: the process of selecting observations or locations for analysis.",
      category: "Research",
    },
  ],
  songs: [
    {
      title: "Coastal Morning",
      style: "Folk / acoustic",
      focus: "Clear vowels and slow rhythm",
      lines: ["I walk beside the water", "The morning tide is low"],
      vocabulary: ["shoreline", "tide"],
    },
  ],
};

const defaultState = {
  date: todayKey,
  tasks: {},
  wordIndex: 0,
  readingIndex: 0,
  musicIndex: 0,
  cardIndex: 0,
  knownCards: [],
  userWords: [],
  pendingSyncWords: [],
  dailySentence: "",
  musicNotes: "",
  generalNotes: "",
};

let state = loadState();

async function startApp() {
  await loadContent();
  setupTheme();
  setupTabs();
  setupEvents();
  saveState();
}

async function loadContent() {
  const [baseWords, baseReadings, baseFlashcards, baseSongs] = await Promise.all([
    loadJson("data/vocabulary.json", fallbackData.words),
    loadJson("data/readings.json", fallbackData.readings),
    loadJson("data/flashcards.json", fallbackData.flashcards),
    loadJson("data/music.json", fallbackData.songs),
  ]);

  words = [...baseWords, ...state.userWords];
  readings = baseReadings;
  songs = baseSongs;
  flashcards = words.map((word) => ({
    front: word.term,
    back: `${word.translation || "Sem traducao"}: ${word.meaning}`,
    category: word.tag || "Personal",
  }));

  if (!flashcards.length) {
    flashcards = baseFlashcards;
  }
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Could not load ${path}`);
    }

    return await response.json();
  } catch (error) {
    showToast("JSON local nao carregou. Use um servidor local ou GitHub Pages.");
    return fallback;
  }
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (!saved) {
    return { ...defaultState };
  }

  if (saved.date !== todayKey) {
    return {
      ...defaultState,
      wordIndex: saved.wordIndex || 0,
      readingIndex: saved.readingIndex || 0,
      musicIndex: saved.musicIndex || 0,
      cardIndex: saved.cardIndex || 0,
      knownCards: saved.knownCards || [],
      userWords: saved.userWords || [],
      pendingSyncWords: saved.pendingSyncWords || [],
      generalNotes: saved.generalNotes || "",
    };
  }

  return {
    ...defaultState,
    ...saved,
    userWords: saved.userWords || [],
    pendingSyncWords: saved.pendingSyncWords || [],
  };
}

function saveState(message) {
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();

  if (message) {
    showToast(message);
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function render() {
  if (!words.length || !readings.length || !flashcards.length || !songs.length) {
    return;
  }

  const word = words[state.wordIndex % words.length];
  const reading = readings[state.readingIndex % readings.length];
  const song = songs[state.musicIndex % songs.length];
  const dueCount = Math.max(flashcards.length - state.knownCards.length, 0);

  document.querySelector("#homeWord").textContent = word.term;
  document.querySelector("#homeDue").textContent = dueCount;
  document.querySelector("#homeFocus").textContent = word.tag;

  document.querySelector("#wordText").textContent = word.term;
  document.querySelector("#wordTag").textContent = word.tag;
  document.querySelector("#wordMeaning").textContent = word.meaning;
  document.querySelector("#wordTranslation").textContent = word.translation || "";
  document.querySelector("#wordExample").textContent = word.example;

  document.querySelector("#readingTitle").textContent = reading.title;
  document.querySelector("#readingText").textContent = reading.text;
  document.querySelector("#musicTitle").textContent = song.title;
  document.querySelector("#musicStyle").textContent = song.style;
  document.querySelector("#musicFocus").textContent = song.focus;
  document.querySelector("#musicActivity").textContent = song.activity || "";
  document.querySelector("#musicVocabulary").textContent = song.vocabulary.join(", ");
  document.querySelector("#musicExpressions").textContent = (song.expressions || []).join(", ");
  document.querySelector("#backupSummary").textContent = `Personal words saved: ${state.userWords.length}`;
  renderMusicLink(song);
  renderSongLines(song);

  document.querySelector("#dailySentence").value = state.dailySentence;
  document.querySelector("#musicNotes").value = state.musicNotes;
  document.querySelector("#generalNotes").value = state.generalNotes;

  document.querySelectorAll("[data-task]").forEach((checkbox) => {
    checkbox.checked = Boolean(state.tasks[checkbox.dataset.task]);
  });

  renderKnownWords();
  renderVocabularyBank();
  renderFlashcard();
}

function renderSongLines(song) {
  const lyricsBox = document.querySelector("#musicLines");
  lyricsBox.innerHTML = "";

  song.lines.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    lyricsBox.append(paragraph);
  });
}

function renderMusicLink(song) {
  const link = document.querySelector("#musicStudyLink");

  if (!song.studyLink) {
    link.hidden = true;
    link.removeAttribute("href");
    return;
  }

  link.hidden = false;
  link.href = song.studyLink;
}

function renderKnownWords() {
  const datalist = document.querySelector("#knownWords");
  datalist.innerHTML = "";

  words.forEach((word) => {
    const option = document.createElement("option");
    option.value = word.term;
    datalist.append(option);
  });
}

function renderVocabularyBank() {
  const tableBody = document.querySelector("#vocabularyTableBody");
  const filter = document.querySelector("#vocabularyFilter");
  const search = normalizeForSpeech(document.querySelector("#vocabularySearch").value);
  const userTerms = new Set(state.userWords.map((word) => word.term.toLowerCase()));
  const themes = [...new Set(words.map((word) => word.tag || "Personal"))].sort();
  const selectedTheme = filter.value || "all";

  syncVocabularyFilter(filter, themes, selectedTheme);
  tableBody.innerHTML = "";

  const filteredWords = words.filter((word) => {
    const sourceText = [
      word.term,
      word.tag,
      word.translation,
      word.meaning,
      word.example,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !search || normalizeForSpeech(sourceText).includes(search);
    const matchesTheme = selectedTheme === "all" || word.tag === selectedTheme;

    return matchesSearch && matchesTheme;
  });

  document.querySelector("#vocabularyCount").textContent = `${filteredWords.length} words`;

  filteredWords.forEach((word) => {
    const row = document.createElement("tr");
    const source = userTerms.has(word.term.toLowerCase()) ? "Personal" : "Base";

    row.innerHTML = `
      <td><strong>${escapeHtml(word.term)}</strong></td>
      <td>${escapeHtml(word.tag || "Personal")}</td>
      <td>${escapeHtml(word.translation || "")}</td>
      <td>${escapeHtml(word.meaning || "")}</td>
      <td>${escapeHtml(word.example || "")}</td>
      <td><span class="source-pill">${source}</span></td>
      <td><button class="icon-button" type="button" data-speak="${escapeHtml(word.term)}">Listen</button></td>
    `;

    tableBody.append(row);
  });
}

function syncVocabularyFilter(filter, themes, selectedTheme) {
  const currentOptions = [...filter.options].map((option) => option.value).join("|");
  const nextOptions = ["all", ...themes].join("|");

  if (currentOptions === nextOptions) {
    return;
  }

  filter.innerHTML = '<option value="all">All themes</option>';

  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    filter.append(option);
  });

  filter.value = themes.includes(selectedTheme) ? selectedTheme : "all";
}

function renderFlashcard() {
  const dueCards = flashcards
    .map((card, index) => ({ ...card, index }))
    .filter((card) => !state.knownCards.includes(card.index));
  const nextCard = dueCards.find((card) => card.index >= state.cardIndex) || dueCards[0] || { ...flashcards[0], index: 0 };

  state.cardIndex = nextCard.index;
  document.querySelector("#cardCategory").textContent = nextCard.category;
  document.querySelector("#cardFront").textContent = nextCard.front;
  document.querySelector("#cardBack").textContent = nextCard.back;
  document.querySelector("#cardBack").hidden = true;
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("is-active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("is-active"));

      button.classList.add("is-active");
      document.querySelector(`#${button.dataset.tab}`).classList.add("is-active");
    });
  });
}

function setupEvents() {
  document.querySelectorAll("[data-task]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      state.tasks[checkbox.dataset.task] = checkbox.checked;
      saveState("Routine updated");
    });
  });

  document.querySelector("#newWordButton").addEventListener("click", () => {
    state.wordIndex = (state.wordIndex + 1) % words.length;
    saveState("New word loaded");
  });

  document.querySelector("#speakWordButton").addEventListener("click", () => {
    const word = words[state.wordIndex % words.length];
    speakEnglish(`${word.term}. ${word.example}`);
  });

  document.querySelector("#newReadingButton").addEventListener("click", () => {
    state.readingIndex = (state.readingIndex + 1) % readings.length;
    saveState("New reading loaded");
  });

  document.querySelector("#speakReadingButton").addEventListener("click", () => {
    const reading = readings[state.readingIndex % readings.length];
    speakEnglish(`${reading.title}. ${reading.text}`);
  });

  document.querySelector("#recordReadingButton").addEventListener("click", () => {
    startReadingRecognition();
  });

  document.querySelector("#showAnswerButton").addEventListener("click", () => {
    document.querySelector("#cardBack").hidden = false;
  });

  document.querySelector("#speakCardButton").addEventListener("click", () => {
    speakEnglish(document.querySelector("#cardFront").textContent);
  });

  document.querySelector("#knownButton").addEventListener("click", () => {
    if (!state.knownCards.includes(state.cardIndex)) {
      state.knownCards.push(state.cardIndex);
    }
    state.cardIndex = (state.cardIndex + 1) % flashcards.length;
    state.tasks.flashcards = state.knownCards.length > 0;
    saveState("Card marked as known");
  });

  document.querySelector("#reviewButton").addEventListener("click", () => {
    state.knownCards = state.knownCards.filter((index) => index !== state.cardIndex);
    state.cardIndex = (state.cardIndex + 1) % flashcards.length;
    saveState("Card kept for review");
  });

  document.querySelector("#saveSentenceButton").addEventListener("click", () => {
    state.dailySentence = document.querySelector("#dailySentence").value.trim();
    state.tasks.sentence = Boolean(state.dailySentence);
    saveState("Sentence saved");
  });

  document.querySelector("#saveMusicButton").addEventListener("click", () => {
    state.musicNotes = document.querySelector("#musicNotes").value.trim();
    state.tasks.music = Boolean(state.musicNotes);
    saveState("Music notes saved");
  });

  document.querySelector("#newMusicButton").addEventListener("click", () => {
    state.musicIndex = (state.musicIndex + 1) % songs.length;
    saveState("New song loaded");
  });

  document.querySelector("#speakMusicButton").addEventListener("click", () => {
    const song = songs[state.musicIndex % songs.length];
    speakEnglish(song.lines.join(". "));
  });

  document.querySelector("#saveNotesButton").addEventListener("click", () => {
    state.generalNotes = document.querySelector("#generalNotes").value.trim();
    saveState("Notes saved");
  });

  document.querySelector("#checkWordButton").addEventListener("click", () => {
    showSpellingSuggestion();
  });

  document.querySelector("#addTerm").addEventListener("input", () => {
    showSpellingSuggestion(false);
  });

  document.querySelector("#addWordButton").addEventListener("click", () => {
    addWord();
  });

  document.querySelector("#exportWordsButton").addEventListener("click", () => {
    exportVocabulary();
  });

  document.querySelector("#importWordsInput").addEventListener("change", (event) => {
    importVocabulary(event.target.files[0]);
    event.target.value = "";
  });

  document.querySelector("#vocabularySearch").addEventListener("input", () => {
    renderVocabularyBank();
  });

  document.querySelector("#vocabularyFilter").addEventListener("change", () => {
    renderVocabularyBank();
  });

  document.querySelector("#vocabularyTableBody").addEventListener("click", (event) => {
    const button = event.target.closest("[data-speak]");

    if (button) {
      speakEnglish(button.dataset.speak);
    }
  });
}

function setupTheme() {
  const savedTheme = localStorage.getItem(themeKey) || "light";
  const themeButton = document.querySelector("#themeBtn");

  document.documentElement.dataset.theme = savedTheme;
  themeButton.textContent = savedTheme === "dark" ? "Light mode" : "Dark mode";

  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(themeKey, nextTheme);
    themeButton.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
  });
}

function addWord() {
  const newWord = {
    term: normalizeSpaces(document.querySelector("#addTerm").value),
    tag: normalizeSpaces(document.querySelector("#addTag").value) || "Personal",
    meaning: normalizeSpaces(document.querySelector("#addMeaning").value),
    translation: normalizeSpaces(document.querySelector("#addTranslation").value),
    example: normalizeSpaces(document.querySelector("#addExample").value),
  };

  if (!newWord.term || !newWord.meaning) {
    showToast("Preencha pelo menos palavra e significado.");
    return;
  }

  const alreadyExists = words.some((word) => word.term.toLowerCase() === newWord.term.toLowerCase());

  if (alreadyExists) {
    showToast("Essa palavra ja existe no vocabulario.");
    return;
  }

  state.userWords.push(newWord);
  words.push(newWord);
  flashcards.push({
    front: newWord.term,
    back: `${newWord.translation || "Sem traducao"}: ${newWord.meaning}`,
    category: newWord.tag,
  });

  document.querySelector("#addTerm").value = "";
  document.querySelector("#addTag").value = "";
  document.querySelector("#addMeaning").value = "";
  document.querySelector("#addTranslation").value = "";
  document.querySelector("#addExample").value = "";
  document.querySelector("#wordSuggestion").textContent = "";

  state.wordIndex = words.length - 1;
  saveState("Word added to your local vocabulary");
  syncVocabularyWord(newWord);
}

async function syncVocabularyWord(word) {
  try {
    const response = await fetch(onlineVocabularyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(word),
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Online sync failed");
    }

    showToast("Word synced with Notion");
  } catch (error) {
    const alreadyPending = state.pendingSyncWords.some(
      (pendingWord) => pendingWord.term.toLowerCase() === word.term.toLowerCase(),
    );

    if (!alreadyPending) {
      state.pendingSyncWords.push(word);
      localStorage.setItem(storageKey, JSON.stringify(state));
    }

    showToast("Saved locally. Notion sync pending.");
  }
}

function exportVocabulary() {
  const backup = {
    app: "English Through Projects",
    version: 1,
    exportedAt: new Date().toISOString(),
    words: state.userWords,
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `english-through-projects-vocabulary-${todayKey}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Vocabulary exported");
}

function importVocabulary(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedWords = Array.isArray(parsed) ? parsed : parsed.words;

      if (!Array.isArray(importedWords)) {
        throw new Error("Invalid vocabulary file");
      }

      const validWords = importedWords.map(normalizeImportedWord).filter(Boolean);
      const existingTerms = new Set(words.map((word) => word.term.toLowerCase()));
      const newWords = validWords.filter((word) => {
        const term = word.term.toLowerCase();

        if (existingTerms.has(term)) {
          return false;
        }

        existingTerms.add(term);
        return true;
      });

      if (!newWords.length) {
        showToast("No new words found in this file");
        return;
      }

      state.userWords.push(...newWords);
      words.push(...newWords);
      flashcards.push(
        ...newWords.map((word) => ({
          front: word.term,
          back: `${word.translation || "Sem traducao"}: ${word.meaning}`,
          category: word.tag,
        })),
      );
      state.wordIndex = words.length - newWords.length;
      saveState(`${newWords.length} words imported`);
    } catch (error) {
      showToast("Arquivo de vocabulario invalido.");
    }
  });

  reader.readAsText(file);
}

function normalizeImportedWord(word) {
  if (!word || typeof word !== "object") {
    return null;
  }

  const importedWord = {
    term: normalizeSpaces(String(word.term || "")),
    tag: normalizeSpaces(String(word.tag || "Personal")) || "Personal",
    meaning: normalizeSpaces(String(word.meaning || "")),
    translation: normalizeSpaces(String(word.translation || "")),
    example: normalizeSpaces(String(word.example || "")),
  };

  if (!importedWord.term || !importedWord.meaning) {
    return null;
  }

  return importedWord;
}

function showSpellingSuggestion(showPositiveMessage = true) {
  const input = normalizeSpaces(document.querySelector("#addTerm").value).toLowerCase();
  const suggestionBox = document.querySelector("#wordSuggestion");

  if (!input) {
    suggestionBox.textContent = "";
    return;
  }

  const exact = words.find((word) => word.term.toLowerCase() === input);

  if (exact) {
    suggestionBox.textContent = `Already in vocabulary: ${exact.term}`;
    return;
  }

  const suggestion = findClosestWord(input);

  if (suggestion && suggestion.distance <= 3) {
    suggestionBox.textContent = `Did you mean "${suggestion.term}"?`;
    return;
  }

  suggestionBox.textContent = showPositiveMessage ? "No close match found. Looks like a new word." : "";
}

function findClosestWord(input) {
  return words
    .map((word) => ({
      term: word.term,
      distance: levenshteinDistance(input, word.term.toLowerCase()),
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);

  for (let column = 0; column <= a.length; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      const cost = a[column - 1] === b[row - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

function speakEnglish(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Seu navegador nao suporta leitura em voz alta.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  utterance.pitch = 1;

  const englishVoice = voices.find((voice) => voice.lang.startsWith("en"));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

function startReadingRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showToast("Seu navegador nao suporta reconhecimento de voz.");
    return;
  }

  const reading = readings[state.readingIndex % readings.length];
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  document.querySelector("#speechResult").textContent = "Listening...";
  document.querySelector("#speechScore").textContent = "Match score: --";

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    const score = calculateMatchScore(reading.text, transcript);

    document.querySelector("#speechResult").textContent = transcript;
    document.querySelector("#speechScore").textContent = `Match score: ${score}%`;
    state.tasks.reading = score >= 45;
    saveState("Voice captured");
  });

  recognition.addEventListener("error", () => {
    showToast("Nao foi possivel capturar sua voz. Verifique o microfone.");
    document.querySelector("#speechResult").textContent = "Press Record voice and read the text aloud.";
  });

  recognition.start();
}

function calculateMatchScore(reference, transcript) {
  const referenceWords = normalizeForSpeech(reference).split(" ").filter(Boolean);
  const spokenWords = new Set(normalizeForSpeech(transcript).split(" ").filter(Boolean));
  const matches = referenceWords.filter((word) => spokenWords.has(word)).length;

  if (!referenceWords.length) {
    return 0;
  }

  return Math.round((matches / referenceWords.length) * 100);
}

function normalizeForSpeech(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSpaces(value) {
  return value.trim().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

startApp();
