import { storyState } from "./state.js";
import { storyYear2026 } from "../assets/storyYears/2026/annualEvents.js";
import { houseActivityKeywords } from "../assets/keywords/houseActivityKeywords.js";
import { planetKeywords } from "../assets/keywords/planetKeywords.js";
import { houseNarrativeFocus } from "../assets/narratives/houseNarrativeFocus.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ordinalHouse(house = "") {
  const number = Number(house);

  if (!number) {
    return "";
  }

  if (number === 1) return "1st House";
  if (number === 2) return "2nd House";
  if (number === 3) return "3rd House";

  return `${number}th House`;
}

function escapeRegExp(value = "") {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function lowercaseFirst(value = "") {
  if (!value) return "";

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function joinNaturally(items = []) {
  const cleanItems = items.filter(Boolean);

  if (cleanItems.length === 0) {
    return "";
  }

  if (cleanItems.length === 1) {
    return cleanItems[0];
  }

  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }

  return `${cleanItems
    .slice(0, -1)
    .join(", ")}, and ${cleanItems.at(-1)}`;
}

function prepareAnnualAction(value = "", prompt = "") {
  let response = String(value).trim();

  if (prompt) {
    const promptPattern = new RegExp(
      `^${escapeRegExp(prompt)}[\\s,:;.!?–—-]*`,
      "i"
    );

    response = response.replace(promptPattern, "");
  }

  response = response
    .replace(/\bI am\b/gi, "you are")
    .replace(/\bI'm\b/gi, "you're")
    .replace(/\bmyself\b/gi, "yourself")
    .replace(/\bmine\b/gi, "yours")
    .replace(/\bmy\b/gi, "your")
    .replace(/\bme\b/gi, "you")
    .replace(/\bI\b/gi, "you")
    .replace(/[.!?]+$/, "")
    .trim();

  response = response
    .replace(/^you\s+/i, "")
    .replace(/^will\s+/i, "")
    .trim();

  return lowercaseFirst(response);
}

function buildNatalPlanetParagraph(event, response) {
  const planetEntries = Object.entries(
    response.natalPlanets || {}
  );

  if (planetEntries.length === 0) {
    return "";
  }

  const planetSentences = planetEntries.map(
    ([planet, qualities]) => {
      const qualityLanguage = joinNaturally(
        qualities.map(keyword =>
          keyword.toLowerCase()
        )
      );

      return `Your natal ${planet} in ${event.eventSign} brings a ${qualityLanguage} tone to this chapter.`;
    }
  );

  return planetSentences.join(" ");
}

function buildAnnualEventStory(event, response) {
  const name = storyState.identity.name;

  const sunHouse = response.houses.sun;
  const moonHouse = response.houses.moon;
  const risingHouse = response.houses.rising;

  const sunFocus =
    houseNarrativeFocus[sunHouse] ||
    "this area of your life";

  const moonFocus =
    houseNarrativeFocus[moonHouse] ||
    "this area of your inner life";

  const risingFocus =
    houseNarrativeFocus[risingHouse] ||
    "the circumstances through which you meet the world";

  const sunAction = prepareAnnualAction(
    response.reflections.sun,
    event.reflectionPrompts.sun.prompt
  );

  const moonAction = prepareAnnualAction(
    response.reflections.moon,
    event.reflectionPrompts.moon.prompt
  );

  const risingAction = prepareAnnualAction(
    response.reflections.rising,
    event.reflectionPrompts.rising.prompt
  );

  const paragraphs = [
    `${name}, Pluto’s movement through your solar ${ordinalHouse(
      sunHouse
    )} turns your attention toward ${sunFocus}. In this part of your life, greater vitality and meaning may come as you ${sunAction}.`,

    `In your lunar ${ordinalHouse(
      moonHouse
    )}, Pluto’s work becomes more intimate, touching ${moonFocus}. You nurture yourself as you ${moonAction}.`,

    `Through your natal ${ordinalHouse(
      risingHouse
    )}, transformation enters the circumstances through which you meet the world, especially ${risingFocus}. Your life begins to shift as you ${risingAction}.`
  ];

  const natalPlanetParagraph =
    buildNatalPlanetParagraph(event, response);

  if (natalPlanetParagraph) {
    paragraphs.push(natalPlanetParagraph);
  }

  return paragraphs.join("\n\n");
}

function getCurrentEvent() {
  return storyYear2026.events[
    storyState.annualJourney.currentEventIndex
  ];
}

function getEventResponse(eventId) {
  if (!storyState.annualJourney.responses[eventId]) {
    storyState.annualJourney.responses[eventId] = {
      houses: {
        sun: "",
        moon: "",
        rising: ""
      },

      activities: {
        sun: [],
        moon: [],
        rising: []
      },

      natalPlanets: {},

      reflections: {
        sun: "",
        moon: "",
        rising: ""
      }
    };
  }

  const response =
    storyState.annualJourney.responses[eventId];

  if (!response.natalPlanets) {
    response.natalPlanets = {};
  }

  return response;
}

function getHouseOptions(selectedHouse = "") {
  const options = [
    '<option value="">Select a house</option>'
  ];

  for (let house = 1; house <= 12; house += 1) {
    const value = String(house);

    const selected =
      value === selectedHouse ? "selected" : "";

    options.push(
      `<option value="${value}" ${selected}>${ordinalHouse(
        value
      )}</option>`
    );
  }

  return options.join("");
}

function renderScene({
  app,
  event,
  advanceStory,
  render
}) {
  const narrative = event.narrative
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.title)}</h2>

    ${narrative}

    <button id="backToCharacterReflection">
      Back
    </button>

    <button id="continueAnnualScene">
      Continue
    </button>
  `;

  document
    .getElementById("backToCharacterReflection")
    .addEventListener("click", () => {
      storyState.currentAnchorId =
        "characterReflection";

      render();
    });

  document
    .getElementById("continueAnnualScene")
    .addEventListener("click", () => {
      advanceStory();
      render();
    });
}

function renderLookupTable(event) {
  const identity = storyState.identity;

  const participantSigns = new Set([
    identity.sunSign,
    identity.moonSign,
    identity.risingSign
  ]);

  const rows = Object.entries(event.houseLookup)
    .map(([sign, house]) => {
      const isParticipantSign =
        participantSigns.has(sign);

      const emphasis = isParticipantSign
        ? 'style="font-weight: 700;"'
        : "";

      return `
        <tr ${emphasis}>
          <td style="padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(sign)}
          </td>

          <td style="padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(ordinalHouse(house))}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <h3>${escapeHtml(event.lookupTitle)}</h3>

    <table
      style="
        width: 100%;
        max-width: 650px;
        border-collapse: collapse;
        margin-bottom: 24px;
      "
    >
      <thead>
        <tr>
          <th
            style="
              text-align: left;
              padding: 8px;
              border: 1px solid #cccccc;
            "
          >
            ${escapeHtml(event.lookupColumns.sign)}
          </th>

          <th
            style="
              text-align: left;
              padding: 8px;
              border: 1px solid #cccccc;
            "
          >
            ${escapeHtml(event.lookupColumns.house)}
          </th>
        </tr>
      </thead>

      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderContext({
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

    <ul>
      ${instructions}
    </ul>

    <p>
      ${escapeHtml(event.contextLanguage.sun.prefix)}
      <strong>${escapeHtml(identity.sunSign)}</strong>,
      so Pluto is traveling through my solar

      <select id="sunHouseInput">
        ${getHouseOptions(response.houses.sun)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.moon.prefix)}
      <strong>${escapeHtml(identity.moonSign)}</strong>,
      so Pluto is traveling through my lunar

      <select id="moonHouseInput">
        ${getHouseOptions(response.houses.moon)}
      </select>.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.rising.prefix)}
      <strong>${escapeHtml(identity.risingSign)}</strong>,
      so Pluto is traveling through my natal

      <select id="risingHouseInput">
        ${getHouseOptions(response.houses.rising)}
      </select>.
    </p>

    <p id="annualContextError" style="display: none;">
      Please select all three houses before continuing.
    </p>

    <button id="backToAnnualScene">
      Back
    </button>

    <button id="continueAnnualContext">
      Continue
    </button>
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

function renderActivityGroup({
  lens,
  heading,
  house,
  selectedActivities
}) {
  const activities =
    houseActivityKeywords[house] || [];

  return `
    <section style="margin-bottom: 30px;">
      <h3>${escapeHtml(heading)}</h3>

      <p>
        <strong>${escapeHtml(ordinalHouse(house))}</strong>
      </p>

      ${activities
        .map((activity, index) => {
          const checked =
            selectedActivities.includes(activity)
              ? "checked"
              : "";

          return `
            <label>
              <input
                type="checkbox"
                name="${lens}Activity"
                value="${index}"
                ${checked}
              >
              ${escapeHtml(activity)}
            </label>

            <br><br>
          `;
        })
        .join("")}
    </section>
  `;
}

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

function renderChoices({
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
      Please select at least one house activity for
      each placement.
    </p>

    <p id="planetChoicesError" style="display: none;">
      For each natal planet selected, choose at least
      one planet quality.
    </p>

    <button id="backToAnnualContext">
      Back
    </button>

    <button id="continueAnnualChoices">
      Continue
    </button>
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
    ).map(input => activities[Number(input.value)]);
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
            availableKeywords[Number(input.value)]
        );

        savedPlanets[planet] = selectedKeywords;
      });

    response.natalPlanets = savedPlanets;
  }

  function selectedPlanetsAreComplete() {
    return Object.values(
      response.natalPlanets
    ).every(keywords => keywords.length > 0);
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

function renderSelectedNatalPlanets(response) {
  const entries =
    Object.entries(response.natalPlanets);

  if (entries.length === 0) {
    return "";
  }

  const items = entries
    .map(
      ([planet, keywords]) => `
        <li>
          <strong>${escapeHtml(planet)}:</strong>
          ${escapeHtml(keywords.join(", "))}
        </li>
      `
    )
    .join("");

  return `
    <section>
      <h3>Natal planets in Aquarius</h3>

      <ul>
        ${items}
      </ul>
    </section>
  `;
}

function renderReflectionField({
  lens,
  heading,
  prompt,
  selectedActivities,
  value
}) {
  return `
    <section style="margin-bottom: 30px;">
      <h3>${escapeHtml(heading)}</h3>

      <p>
        <strong>${escapeHtml(prompt)}</strong>
      </p>

      <p>
        Your selected themes:
        ${escapeHtml(
          selectedActivities.join(" · ")
        )}
      </p>

      <textarea
        id="${lens}AnnualReflection"
        rows="5"
        style="width: 100%;"
        placeholder="Complete this thought in your own words."
      >${escapeHtml(value)}</textarea>
    </section>
  `;
}

function renderReflection({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  app.innerHTML = `
    <h2>${escapeHtml(event.reflectionTitle)}</h2>

    <p>
      ${escapeHtml(event.reflectionIntroduction)}
    </p>

    ${renderSelectedNatalPlanets(response)}

    ${renderReflectionField({
      lens: "sun",
      heading: event.reflectionPrompts.sun.heading,
      prompt: event.reflectionPrompts.sun.prompt,
      selectedActivities: response.activities.sun,
      value: response.reflections.sun
    })}

    ${renderReflectionField({
      lens: "moon",
      heading: event.reflectionPrompts.moon.heading,
      prompt: event.reflectionPrompts.moon.prompt,
      selectedActivities: response.activities.moon,
      value: response.reflections.moon
    })}

    ${renderReflectionField({
      lens: "rising",
      heading:
        event.reflectionPrompts.rising.heading,
      prompt:
        event.reflectionPrompts.rising.prompt,
      selectedActivities:
        response.activities.rising,
      value: response.reflections.rising
    })}

    <p
      id="annualReflectionError"
      style="display: none;"
    >
      Please respond to all three prompts before
      continuing.
    </p>

    <button id="backToAnnualChoices">
      Back
    </button>

    <button id="submitAnnualReflection">
      Continue
    </button>
  `;

  function saveReflections() {
    response.reflections.sun =
      document
        .getElementById("sunAnnualReflection")
        .value
        .trim();

    response.reflections.moon =
      document
        .getElementById("moonAnnualReflection")
        .value
        .trim();

    response.reflections.rising =
      document
        .getElementById(
          "risingAnnualReflection"
        )
        .value
        .trim();
  }

  document
    .getElementById("backToAnnualChoices")
    .addEventListener("click", () => {
      saveReflections();

      storyState.currentAnchorId =
        "annualEventChoices";

      render();
    });

  document
    .getElementById("submitAnnualReflection")
    .addEventListener("click", () => {
      saveReflections();

      const allComplete =
        response.reflections.sun &&
        response.reflections.moon &&
        response.reflections.rising;

      if (!allComplete) {
        document.getElementById(
          "annualReflectionError"
        ).style.display = "block";

        return;
      }

      const narrative = buildAnnualEventStory(
        event,
        response
      );

      storyState.outputs.annualEventStories[
        event.id
      ] = {
        title: event.reflectionTitle.replace(
          /^Write\s+/i,
          ""
        ),

        narrative,

        houses: {
          ...response.houses
        },

        activities: {
          ...response.activities
        },

        natalPlanets: {
          ...response.natalPlanets
        },

        reflections: {
          ...response.reflections
        }
      };

      advanceStory();
      render();
    });
}

function renderComplete({
  app,
  event,
  response,
  render
}) {
  const savedStory =
    storyState.outputs.annualEventStories[
      event.id
    ];

  const narrative =
    savedStory?.narrative ||
    buildAnnualEventStory(event, response);

  const storyTitle =
    savedStory?.title ||
    event.reflectionTitle.replace(
      /^Write\s+/i,
      ""
    );

  const narrativeParagraphs = narrative
    .split("\n\n")
    .map(
      paragraph =>
        `<p>${escapeHtml(paragraph)}</p>`
    )
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(storyTitle)}</h2>

    ${narrativeParagraphs}

    <button id="backToAnnualReflection">
      Back
    </button>
  `;

  document
    .getElementById("backToAnnualReflection")
    .addEventListener("click", () => {
      storyState.currentAnchorId =
        "annualEventReflection";

      render();
    });
}

export function renderAnnualEventAnchor({
  anchorId,
  app,
  advanceStory,
  render
}) {
  const annualAnchorIds = [
    "annualEventScene",
    "annualEventContext",
    "annualEventChoices",
    "annualEventReflection",
    "annualEventComplete"
  ];

  if (!annualAnchorIds.includes(anchorId)) {
    return false;
  }

  const event = getCurrentEvent();

  if (!event) {
    app.innerHTML = `
      <h2>Storybook</h2>
      <p>No annual event is currently available.</p>
    `;

    return true;
  }

  const response = getEventResponse(event.id);

  if (anchorId === "annualEventScene") {
    renderScene({
      app,
      event,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventContext") {
    renderContext({
      app,
      event,
      response,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventChoices") {
    renderChoices({
      app,
      event,
      response,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventReflection") {
    renderReflection({
      app,
      event,
      response,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventComplete") {
    renderComplete({
      app,
      event,
      response,
      render
    });
  }

  return true;
}
