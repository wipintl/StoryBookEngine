import { storyState } from "./state.js";
import {
  escapeHtml,
  getHouseOptions,
  renderLookupTable
} from "./annualEventShared.js";

function renderSingleHouseContext({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const identity = storyState.identity;
  const planetName = event.planetName || "Pluto";

  const introduction = event.contextIntroduction
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const instructions = event.contextInstructions
    .map(instruction => `<li>${escapeHtml(instruction)}</li>`)
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.contextTitle)}</h2>
    ${introduction}
    ${renderLookupTable(event)}
    <h3>Enter Your Houses</h3>
    <ul>${instructions}</ul>

    <p>
      ${escapeHtml(event.contextLanguage.sun.prefix)}
      <strong>${escapeHtml(identity.sunSign)}</strong>,
      so ${escapeHtml(planetName)} is traveling through my solar
      <select id="sunHouseInput">
        ${getHouseOptions(response.houses.sun)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.moon.prefix)}
      <strong>${escapeHtml(identity.moonSign)}</strong>,
      so ${escapeHtml(planetName)} is traveling through my lunar
      <select id="moonHouseInput">
        ${getHouseOptions(response.houses.moon)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.rising.prefix)}
      <strong>${escapeHtml(identity.risingSign)}</strong>,
      so ${escapeHtml(planetName)} is traveling through my natal
      <select id="risingHouseInput">
        ${getHouseOptions(response.houses.rising)}
      </select>.
    </p>

    <p id="annualContextError" style="display: none;">
      Please select all three houses before continuing.
    </p>

    <button id="backToAnnualScene">Back</button>
    <button id="continueAnnualContext">Continue</button>
  `;

  function saveHouses() {
    response.houses.sun =
      document.getElementById("sunHouseInput").value;

    response.houses.moon =
      document.getElementById("moonHouseInput").value;

    response.houses.rising =
      document.getElementById("risingHouseInput").value;
  }

  document
    .getElementById("backToAnnualScene")
    .addEventListener("click", () => {
      saveHouses();
      storyState.currentAnchorId =
        "annualEventScene";
      render();
    });

  document
    .getElementById("continueAnnualContext")
    .addEventListener("click", () => {
      saveHouses();

      const allComplete =
        response.houses.sun &&
        response.houses.moon &&
        response.houses.rising;

      if (!allComplete) {
        document.getElementById(
          "annualContextError"
        ).style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}

function renderTransitionHouseContext({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const identity = storyState.identity;
  const planetName = event.planetName;

  const introduction = event.contextIntroduction
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const instructions = event.contextInstructions
    .map(instruction => `<li>${escapeHtml(instruction)}</li>`)
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.contextTitle)}</h2>
    ${introduction}
    ${renderLookupTable(event)}
    <h3>Enter Your Houses</h3>
    <ul>${instructions}</ul>

    <p>
      ${escapeHtml(event.contextLanguage.sun.prefix)}
      <strong>${escapeHtml(identity.sunSign)}</strong>,
      so ${escapeHtml(planetName)} is moving from my solar
      <select id="sunFromHouseInput">
        ${getHouseOptions(response.houses.from.sun)}
      </select>
      to my solar
      <select id="sunToHouseInput">
        ${getHouseOptions(response.houses.to.sun)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.moon.prefix)}
      <strong>${escapeHtml(identity.moonSign)}</strong>,
      so ${escapeHtml(planetName)} is moving from my lunar
      <select id="moonFromHouseInput">
        ${getHouseOptions(response.houses.from.moon)}
      </select>
      to my lunar
      <select id="moonToHouseInput">
        ${getHouseOptions(response.houses.to.moon)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.rising.prefix)}
      <strong>${escapeHtml(identity.risingSign)}</strong>,
      so ${escapeHtml(planetName)} is moving from my natal
      <select id="risingFromHouseInput">
        ${getHouseOptions(response.houses.from.rising)}
      </select>
      to my natal
      <select id="risingToHouseInput">
        ${getHouseOptions(response.houses.to.rising)}
      </select>.
    </p>

    <p id="annualContextError" style="display: none;">
      Please select all six houses before continuing.
    </p>

    <button id="backToAnnualScene">Back</button>
    <button id="continueAnnualContext">Continue</button>
  `;

  function saveHouses() {
    response.houses.from.sun =
      document.getElementById("sunFromHouseInput").value;

    response.houses.to.sun =
      document.getElementById("sunToHouseInput").value;

    response.houses.from.moon =
      document.getElementById("moonFromHouseInput").value;

    response.houses.to.moon =
      document.getElementById("moonToHouseInput").value;

    response.houses.from.rising =
      document.getElementById("risingFromHouseInput").value;

    response.houses.to.rising =
      document.getElementById("risingToHouseInput").value;
  }

  document
    .getElementById("backToAnnualScene")
    .addEventListener("click", () => {
      saveHouses();
      storyState.currentAnchorId =
        "annualEventScene";
      render();
    });

  document
    .getElementById("continueAnnualContext")
    .addEventListener("click", () => {
      saveHouses();

      const allComplete =
        response.houses.from.sun &&
        response.houses.to.sun &&
        response.houses.from.moon &&
        response.houses.to.moon &&
        response.houses.from.rising &&
        response.houses.to.rising;

      if (!allComplete) {
        document.getElementById(
          "annualContextError"
        ).style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}


function renderEclipsePairContext({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const identity = storyState.identity;

  const introduction = event.contextIntroduction
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const instructions = event.contextInstructions
    .map(instruction => `<li>${escapeHtml(instruction)}</li>`)
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.contextTitle)}</h2>
    ${introduction}
    ${renderLookupTable(event)}

    <h3>Enter Your Houses</h3>
    <ul>${instructions}</ul>

    <p>
      ${escapeHtml(event.contextLanguage.sun.prefix)}
      <strong>${escapeHtml(identity.sunSign)}</strong>,
      so the lunar eclipse is in my solar
      <select id="sunToHouseInput">
        ${getHouseOptions(response.houses.to.sun)}
      </select>
      and the solar eclipse is in my solar
      <select id="sunFromHouseInput">
        ${getHouseOptions(response.houses.from.sun)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.moon.prefix)}
      <strong>${escapeHtml(identity.moonSign)}</strong>,
      so the lunar eclipse is in my lunar
      <select id="moonToHouseInput">
        ${getHouseOptions(response.houses.to.moon)}
      </select>
      and the solar eclipse is in my lunar
      <select id="moonFromHouseInput">
        ${getHouseOptions(response.houses.from.moon)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.rising.prefix)}
      <strong>${escapeHtml(identity.risingSign)}</strong>,
      so the lunar eclipse is in my natal
      <select id="risingToHouseInput">
        ${getHouseOptions(response.houses.to.rising)}
      </select>
      and the solar eclipse is in my natal
      <select id="risingFromHouseInput">
        ${getHouseOptions(response.houses.from.rising)}
      </select>.
    </p>

    <p id="annualContextError" style="display: none;">
      Please select all six houses before continuing.
    </p>

    <button id="backToAnnualScene">Back</button>
    <button id="continueAnnualContext">Continue</button>
  `;

  function saveHouses() {
    response.houses.from.sun =
      document.getElementById("sunFromHouseInput").value;
    response.houses.to.sun =
      document.getElementById("sunToHouseInput").value;
    response.houses.from.moon =
      document.getElementById("moonFromHouseInput").value;
    response.houses.to.moon =
      document.getElementById("moonToHouseInput").value;
    response.houses.from.rising =
      document.getElementById("risingFromHouseInput").value;
    response.houses.to.rising =
      document.getElementById("risingToHouseInput").value;
  }

  document
    .getElementById("backToAnnualScene")
    .addEventListener("click", () => {
      saveHouses();
      storyState.currentAnchorId =
        "annualEventScene";
      render();
    });

  document
    .getElementById("continueAnnualContext")
    .addEventListener("click", () => {
      saveHouses();

      const allComplete =
        response.houses.from.sun &&
        response.houses.to.sun &&
        response.houses.from.moon &&
        response.houses.to.moon &&
        response.houses.from.rising &&
        response.houses.to.rising;

      if (!allComplete) {
        document.getElementById(
          "annualContextError"
        ).style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}

export function renderAnnualEventContext(options) {
  if (options.event.type === "eclipsePair") {
    renderEclipsePairContext(options);
    return;
  }

  if (options.event.type === "transitionHouse") {
    renderTransitionHouseContext(options);
    return;
  }

  renderSingleHouseContext(options);
}
