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
    const keywords = zodiacKeywords[storyState.identity.sunSign] || [];

    app.innerHTML = `
      <h2>Select Your Sun Keyword</h2>
      ${keywords.map(k => `<button class="kw" data-k="${k}">${k}</button>`).join("")}
    `;

    document.querySelectorAll(".kw").forEach(btn => {
      btn.addEventListener("click", () => {
        storyState.selections.sunKeyword = btn.dataset.k;
        advanceStory();
        render();
      });
    });

    return;
  }

  if (current.id === "moonKeywordSelection") {
    const keywords = zodiacKeywords[storyState.identity.moonSign] || [];

    app.innerHTML = `
      <h2>Select Your Moon Keyword</h2>
      ${keywords.map(k => `<button class="kw" data-k="${k}">${k}</button>`).join("")}
    `;

    document.querySelectorAll(".kw").forEach(btn => {
      btn.addEventListener("click", () => {
        storyState.selections.moonKeyword = btn.dataset.k;
        advanceStory();
        render();
      });
    });

    return;
  }

  if (current.id === "risingKeywordSelection") {
    const keywords = zodiacKeywords[storyState.identity.risingSign] || [];

    app.innerHTML = `
      <h2>Select Your Rising Keyword</h2>
      ${keywords.map(k => `<button class="kw" data-k="${k}">${k}</button>`).join("")}
    `;

    document.querySelectorAll(".kw").forEach(btn => {
      btn.addEventListener("click", () => {
        storyState.selections.risingKeyword = btn.dataset.k;
        advanceStory();
        render();
      });
    });

    return;
  }

  if (current.id === "characterSketch") {
    const prompt = `
Create a character sketch in a rich, fluid, authoritative tone.

Name: ${storyState.identity.name}
Sun: ${storyState.identity.sunSign} (${storyState.selections.sunKeyword})
Moon: ${storyState.identity.moonSign} (${storyState.selections.moonKeyword})
Rising: ${storyState.identity.risingSign} (${storyState.selections.risingKeyword})

Blend into one unified voice. Do not list traits. Do not echo keywords.
`;

    console.log(prompt);

    app.innerHTML = `
      <h2>Your Character Sketch</h2>
      <p><em>Generating your narrative...</em></p>
    `;

    return;
  }

  app.innerHTML = `
    <h2>Current Anchor</h2>
    <p>${current.id}</p>
    <p>${current.purpose}</p>
  `;
}

nextButton.addEventListener("click", () => {
  const current = getCurrentAnchor();

  if (current.id === "characterSketch") return;

  advanceStory();
  render();
});

render();
