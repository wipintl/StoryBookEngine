import { storyState } from "./state.js";
import { houseActivityKeywords } from "../assets/keywords/houseActivityKeywords.js";
import { planetKeywords } from "../assets/keywords/planetKeywords.js";
import {
  escapeHtml,
  renderActivityGroup
} from "./annualEventShared.js";

function renderPlanetKeywordOptions(
  planet,
  selectedKeywords
) {
  const keywords = planetKeywords[planet] || [];

  return keywords
    .map((keyword, index) => {
      const checked =
        selectedKeywords.includes(keyword)
          ? "checked"
          : "";

      return `
        <label>
          <input
            type="checkbox"
            name="${planet}Quality"
            value="${index}"
            ${checked}
          >
          ${escapeHtml(keyword)}
        </label>
        <br><br>
      `;
    })
    .join("");
}

function renderNatalPlanetLayer(event, response) {
  if (!event.natalPlanetLayer?.enabled) {
    return "";
  }

  const planets = Object.keys(planetKeywords);

  const planetSections = planets
    .map(planet => {
      const selectedKeywords =
        response.natalPlanets[planet] || [];

      const checked =
        selectedKeywords.length > 0
          ? "checked"
          : "";

      const display =
        selectedKeywords.length > 0
          ? "block"
          : "none";

      return `
        <section
          style="
            border: 1px solid #dddddd;
            padding: 14px;
            margin-bottom: 14px;
          "
        >
          <label>
            <input
              type="checkbox"
              class="natalPlanetToggle"
              data-planet="${planet}"
              ${checked}
            >
            <strong>${escapeHtml(planet)}</strong>
          </label>

          <div
            id="${planet}QualityOptions"
            style="display: ${display}; margin-top: 14px;"
          >
            <p>
              Choose one or more ${escapeHtml(
                planet
              )} qualities:
            </p>

            ${renderPlanetKeywordOptions(
              planet,
              selectedKeywords
            )}
          </div>
        </section>
      `;
    })
    .join("");

  return `
    <section style="margin-top: 36px;">
      <h3>
        ${escapeHtml(event.natalPlanetLayer.title)}
      </h3>

      <p>
        ${escapeHtml(
          event.natalPlanetLayer.introduction
        )}
      </p>

      ${planetSections}
    </section>
  `;
}

function renderSingleHouseChoices({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const guidance = event.choicesGuidance
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.choicesTitle)}</h2>
    ${guidance}

    <p>
      <strong>
        ${escapeHtml(event.choicesIntroduction)}
      </strong>
    </p>

    ${renderActivityGroup({
      lens: "sun",
      heading: "My Sun",
      house: response.houses.sun,
      selectedActivities: response.activities.sun
    })}

    ${renderActivityGroup({
      lens: "moon",
      heading: "My Moon",
      house: response.houses.moon,
      selectedActivities: response.activities.moon
    })}

    ${renderActivityGroup({
      lens: "rising",
      heading: "My Rising Sign",
      house: response.houses.rising,
      selectedActivities: response.activities.rising
    })}

    ${renderNatalPlanetLayer(event, response)}

    <p id="annualChoicesError" style="display: none;">
      Please select at least one house activity for each placement.
    </p>

    <p id="planetChoicesError" style="display: none;">
      For each natal planet selected, choose at least one planet quality.
    </p>

    <button id="backToAnnualContext">Back</button>
    <button id="continueAnnualChoices">Continue</button>
  `;

  document
    .querySelectorAll(".natalPlanetToggle")
    .forEach(toggle => {
      toggle.addEventListener("change", () => {
        const planet = toggle.dataset.planet;
        const options = document.getElementById(
          `${planet}QualityOptions`
        );

        options.style.display =
          toggle.checked ? "block" : "none";

        if (!toggle.checked) {
          options
            .querySelectorAll('input[type="checkbox"]')
            .forEach(input => {
              input.checked = false;
            });
        }
      });
    });

  function getSelectedActivities(lens, house) {
    const activities =
      houseActivityKeywords[house] || [];

    return Array.from(
      document.querySelectorAll(
        `input[name="${lens}Activity"]:checked`
      )
    ).map(
      input =>
        activities[Number(input.value)]
    );
  }

  function saveActivities() {
    response.activities.sun =
      getSelectedActivities(
        "sun",
        response.houses.sun
      );

    response.activities.moon =
      getSelectedActivities(
        "moon",
        response.houses.moon
      );

    response.activities.rising =
      getSelectedActivities(
        "rising",
        response.houses.rising
      );
  }

  function saveNatalPlanets() {
    const savedPlanets = {};

    document
      .querySelectorAll(
        ".natalPlanetToggle:checked"
      )
      .forEach(toggle => {
        const planet = toggle.dataset.planet;
        const availableKeywords =
          planetKeywords[planet] || [];

        const selectedKeywords = Array.from(
          document.querySelectorAll(
            `input[name="${planet}Quality"]:checked`
          )
        ).map(
          input =>
            availableKeywords[
              Number(input.value)
            ]
        );

        savedPlanets[planet] =
          selectedKeywords;
      });

    response.natalPlanets =
      savedPlanets;
  }

  function selectedPlanetsAreComplete() {
    return Object.values(
      response.natalPlanets
    ).every(
      keywords =>
        keywords.length > 0
    );
  }

  document
    .getElementById("backToAnnualContext")
    .addEventListener("click", () => {
      saveActivities();
      saveNatalPlanets();
      storyState.currentAnchorId =
        "annualEventContext";
      render();
    });

  document
    .getElementById("continueAnnualChoices")
    .addEventListener("click", () => {
      saveActivities();
      saveNatalPlanets();

      const houseChoicesComplete =
        response.activities.sun.length > 0 &&
        response.activities.moon.length > 0 &&
        response.activities.rising.length > 0;

      if (!houseChoicesComplete) {
        document.getElementById(
          "annualChoicesError"
        ).style.display = "block";
        return;
      }

      if (!selectedPlanetsAreComplete()) {
        document.getElementById(
          "planetChoicesError"
        ).style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}

function renderTransitionHouseChoices({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const guidance = event.choicesGuidance
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const planetName = event.planetName;

  app.innerHTML = `
    <h2>${escapeHtml(event.choicesTitle)}</h2>
    ${guidance}

    <section style="margin-bottom: 40px;">
      <h3>
        ${escapeHtml(planetName)} in
        ${escapeHtml(event.fromSign)}
      </h3>

      <p>
        <strong>
          ${escapeHtml(event.fromChoicesIntroduction)}
        </strong>
      </p>

      ${renderActivityGroup({
        lens: "fromSun",
        heading: "My Sun",
        house: response.houses.from.sun,
        selectedActivities: response.activities.from.sun
      })}

      ${renderActivityGroup({
        lens: "fromMoon",
        heading: "My Moon",
        house: response.houses.from.moon,
        selectedActivities: response.activities.from.moon
      })}

      ${renderActivityGroup({
        lens: "fromRising",
        heading: "My Rising Sign",
        house: response.houses.from.rising,
        selectedActivities: response.activities.from.rising
      })}
    </section>

    <section style="margin-bottom: 40px;">
      <h3>
        ${escapeHtml(planetName)} in
        ${escapeHtml(event.toSign)}
      </h3>

      <p>
        <strong>
          ${escapeHtml(event.toChoicesIntroduction)}
        </strong>
      </p>

      ${renderActivityGroup({
        lens: "toSun",
        heading: "My Sun",
        house: response.houses.to.sun,
        selectedActivities: response.activities.to.sun
      })}

      ${renderActivityGroup({
        lens: "toMoon",
        heading: "My Moon",
        house: response.houses.to.moon,
        selectedActivities: response.activities.to.moon
      })}

      ${renderActivityGroup({
        lens: "toRising",
        heading: "My Rising Sign",
        house: response.houses.to.rising,
        selectedActivities: response.activities.to.rising
      })}
    </section>

    <p id="annualChoicesError" style="display: none;">
      Please select at least one activity for all six placements.
    </p>

    <button id="backToAnnualContext">Back</button>
    <button id="continueAnnualChoices">Continue</button>
  `;

  function getSelectedActivities(lens, house) {
    const activities =
      houseActivityKeywords[house] || [];

    return Array.from(
      document.querySelectorAll(
        `input[name="${lens}Activity"]:checked`
      )
    ).map(
      input =>
        activities[Number(input.value)]
    );
  }

  function saveActivities() {
    response.activities.from.sun =
      getSelectedActivities(
        "fromSun",
        response.houses.from.sun
      );

    response.activities.from.moon =
      getSelectedActivities(
        "fromMoon",
        response.houses.from.moon
      );

    response.activities.from.rising =
      getSelectedActivities(
        "fromRising",
        response.houses.from.rising
      );

    response.activities.to.sun =
      getSelectedActivities(
        "toSun",
        response.houses.to.sun
      );

    response.activities.to.moon =
      getSelectedActivities(
        "toMoon",
        response.houses.to.moon
      );

    response.activities.to.rising =
      getSelectedActivities(
        "toRising",
        response.houses.to.rising
      );
  }

  document
    .getElementById("backToAnnualContext")
    .addEventListener("click", () => {
      saveActivities();
      storyState.currentAnchorId =
        "annualEventContext";
      render();
    });

  document
    .getElementById("continueAnnualChoices")
    .addEventListener("click", () => {
      saveActivities();

      const allComplete =
        response.activities.from.sun.length > 0 &&
        response.activities.from.moon.length > 0 &&
        response.activities.from.rising.length > 0 &&
        response.activities.to.sun.length > 0 &&
        response.activities.to.moon.length > 0 &&
        response.activities.to.rising.length > 0;

      if (!allComplete) {
        document.getElementById(
          "annualChoicesError"
        ).style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}

export function renderAnnualEventChoices(options) {
  if (options.event.type === "transitionHouse") {
    renderTransitionHouseChoices(options);
    return;
  }

  renderSingleHouseChoices(options);
}
