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
  const current = getCurrentAnchor ();
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
      console.log("Name submit clicked");
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
  advanceStory();
  render();
});

render();
