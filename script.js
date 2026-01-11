// Dictionary Web App
// Features: Word search, pronunciation, dark mode, font selection
// API: dictionaryapi.dev

const input = document.getElementById("searchInput");
const result = document.getElementById("result");
const themeToggle = document.getElementById("theme-toggle");
const fontSelect = document.getElementById("font-select");
const searchBtn = document.getElementById("searchBtn");

// Search on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchMeaning(input.value.trim());
  }
});

// Search on button click
searchBtn.addEventListener("click", () => {
  fetchMeaning(input.value.trim());
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Font selection
fontSelect.addEventListener("change", () => {
  document.body.style.fontFamily = fontSelect.value;
});

// Fetch meaning function
async function fetchMeaning(word) {
  if (!word) return;

  result.innerHTML = "<p>Loading...</p>";

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.title) {
      result.innerHTML =
        "<p>❌ No results found. Please try a different word.</p>";
      return;
    }

    const entry = data[0];
    const noun = entry.meanings.find((m) => m.partOfSpeech === "noun");
    const verb = entry.meanings.find((m) => m.partOfSpeech === "verb");

    const audioObj = entry.phonetics.find((p) => p.audio);
    const audio = audioObj?.audio
      ? audioObj.audio.startsWith("https")
        ? audioObj.audio
        : "https:" + audioObj.audio
      : "";

    result.innerHTML = `
      <div class="top-result">
        <div>
          <h2>${entry.word}</h2>
          <p class="phonetic">${entry.phonetic || ""}</p>
        </div>
        ${
          audio
            ? `<button class="play-btn" onclick="new Audio('${audio}').play()">▶️</button>`
            : ""
        }
      </div>

      ${
        noun
          ? `
        <div class="section">
          <h3 class="part-of-speech">noun</h3>
          <p class="meaning-title">Meaning</p>
          <ul>
            ${noun.definitions
              .map((d) => `<li>${d.definition}</li>`)
              .join("")}
          </ul>
          ${
            noun.synonyms?.length
              ? `<p class="synonyms-label">Synonyms</p>
                 <p class="synonyms-text">${noun.synonyms[0]}</p>`
              : ""
          }
        </div>`
          : ""
      }

      ${
        verb
          ? `
        <div class="section">
          <h3 class="part-of-speech">verb</h3>
          <p class="meaning-title">Meaning</p>
          <ul>
            ${verb.definitions
              .map((d) => `<li>${d.definition}</li>`)
              .join("")}
          </ul>
        </div>`
          : ""
      }

      <p class="source">
        Source:
        <a href="${entry.sourceUrls?.[0] || "#"}" target="_blank">
          ${entry.sourceUrls?.[0] || "N/A"}
        </a>
      </p>
    `;
  } catch (error) {
    result.innerHTML = "<p>⚠️ Something went wrong. Please try again.</p>";
    console.error(error);
  }
}
