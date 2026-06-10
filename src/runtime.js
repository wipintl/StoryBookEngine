import { getCurrentAnchor, advanceStory } from "./engine.js";
import { storyState } from "./state.js";
import { zodiacKeywords } from "../assets/keywords/zodiacKeywords.js";

const app = document.getElementById("app");
const nextButton = document.getElementById("nextButton");

function getSignOptions() {
  return Object.keys(zodiacKeywords)
    .map(sign => `<option value="${sign}">${sign}</option>`)
    .join("");
}

function render() {
  const current = getCurrentAnchor();
  console.log("Current Anchor ID:", current.id);

  if (current.id === "identityCollection") {
    app.innerHTML = `
      <h2>What is your name?</h2>
      <input id="nameInput" type="text">
      <button id="submitName">Submit</button>
    `;

    document.getElementById("submitName").addEventListener("click", () => {
      const name = document.getElementById("nameInput").value;
      if (!name) return;

      storyState.identity.name = name;
      advanceStory();
      render();
    });

    return;
  }

  if (current.id === "sunSignSelection") {
    app.innerHTML = `
      <h2>What is your Sun Sign?</h2>
      <select id="sunSignInput">
        <option value="">Select one</option>
        ${getSignOptions()}
      </select>
      <button id="submitSunSign">Submit</button>
    `;

    document.getElementById("submitSunSign").addEventListener("click", () => {
      const sunSign = document.getElementById("sunSignInput").value;
      if (!sunSign) return;

      storyState.identity.sunSign = sunSign;
      advanceStory();
      render();
    });

    return;
  }

  if (current.id === "moonSignSelection") {
    app.innerHTML = `
      <h2>What is your Moon Sign?</h2>
      <select id="moonSignInput">
        <option value="">Select one</option>
        ${getSignOptions()}
      </select>
      <button id="submitMoonSign">Submit</button>
    `;

    document.getElementById("submitMoonSign").addEventListener("click", () => {
      const moonSign = document.getElementById("moonSignInput").value;
      if (!moonSign) return;

      storyState.identity.moonSign = moonSign;
      advanceStory();
      render();
    });

    return;
  }

  if (current.id === "risingSignSelection") {
    app.innerHTML = `
      <h2>What is your Rising Sign?</h2>
      <select id="risingSignInput">
        <option value="">Select one</option>
        ${getSignOptions()}
      </select>
      <button id="submitRisingSign">Submit</button>
    `;

    document.getElementById("submitRisingSign").addEventListener("click", () => {
      const risingSign = document.getElementById("risingSignInput").value;
      if (!risingSign) return;

      storyState.identity.risingSign = risingSign;
      advanceStory();
      render();
    });

    return;
  }

  if (current.id === "sunKeywordSelection") {
    const keywords =
      zodiacKeywords[storyState.identity.sunSign] || [];

    const keywordButtons = keywords
      .map(keyword =>
        `<button class="keywordButton" data-keyword="${keyword}">
          ${keyword}
        </button>`
      )
      .join("");

    app.innerHTML = `
      <h2>Select Your Sun Keyword</h2>
      ${keywordButtons}
    `;

    document.querySelectorAll(".keywordButton")
      .forEach(button => {
        button.addEventListener("click", () => {
          storyState.selections.sunKeyword =
            button.dataset.keyword;

          advanceStory();
          render();
        });
      });

    return;
  }

  if (current.id === "moonKeywordSelection") {
    const keywords =
      zodiacKeywords[storyState.identity.moonSign] || [];

    const keywordButtons = keywords
      .map(keyword =>
        `<button class="keywordButton" data-keyword="${keyword}">
          ${keyword}
        </button>`
      )
      .join("");

    app.innerHTML = `
      <h2>Select Your Moon Keyword</h2>
      ${keywordButtons}
    `;

    document.querySelectorAll(".keywordButton")
      .forEach(button => {
        button.addEventListener("click", () => {
          storyState.selections.moonKeyword =
            button.dataset.keyword;

          advanceStory();
          render();
        });
      });

    return;
  }

  if (current.id === "risingKeywordSelection") {
  const keywords =
    zodiacKeywords[storyState.identity.risingSign] || [];

  const keywordButtons = keywords
    .map(keyword =>
      `<button class="keywordButton" data-keyword="${keyword}">
        ${keyword}
      </button>`
    )
    .join("");

  app.innerHTML = `
    <h2>Select Your Rising Keyword</h2>
    ${keywordButtons}
  `;

  document.querySelectorAll(".keywordButton")
    .forEach(button => {
      button.addEventListener("click", () => {
        storyState.selections.risingKeyword =
          button.dataset.keyword;

        advanceStory();
        render();
      });
    });

  return;
}

if (current.id === "characterSketch") {

  app.innerHTML = `
    <h2>Your Character Sketch</h2>

    <p><strong>Name:</strong> ${storyState.identity.name}</p>
    <p><strong>Sun:</strong> ${storyState.identity.sunSign} — ${storyState.selections.sunKeyword}</p>
    <p><strong>Moon:</strong> ${storyState.identity.moonSign} — ${storyState.selections.moonKeyword}</p>
    <p><strong>Rising:</strong> ${storyState.identity.risingSign} — ${storyState.selections.risingKeyword}</p>
  `;

  return;
}

app.innerHTML = `
  <h2>Current Anchor</h2>
  <p>${current.id}</p>
  <p>${current.purpose}</p>
  <hr>
  <p>Name: ${storyState.identity.name || "(none)"}</p>
  <p>Sun Sign: ${storyState.identity.sunSign || "(none)"}</p>
  <p>Moon Sign: ${storyState.identity.moonSign || "(none)"}</p>
`;
}

nextButton.addEventListener("click", () => {
  const current = getCurrentAnchor();

  if (
    current.id === "identityCollection" ||
    current.id === "sunSignSelection" ||
    current.id === "moonSignSelection" ||
    current.id === "risingSignSelection" ||
    current.id === "sunKeywordSelection" ||
    current.id === "moonKeywordSelection" ||
    current.id === "risingKeywordSelection"
  ) {
    return;
  }

  advanceStory();
  render();
});

render();
