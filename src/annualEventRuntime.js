import { storyState } from "./state.js";
import { storyYear2026 } from "../assets/storyYears/2026/annualEvents.js";
import { houseActivityKeywords } from "../assets/keywords/houseActivityKeywords.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

      reflections: {
        sun: "",
        moon: "",
        rising: ""
      }
    };
  }

  return storyState.annualJourney.responses[eventId];
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
      `<option value="${value}" ${selected}>${value}</option>`
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
      storyState.currentAnchorId = "characterReflection";
      render();
    });

  document
    .getElementById("continueAnnualScene")
    .addEventListener("click", () => {
      advanceStory();
      render();
    });
}

function renderContext({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const identity = storyState.identity;

  app.innerHTML = `
    <h2>${escapeHtml(event.contextTitle)}</h2>

    <p>
      ${escapeHtml(event.contextLanguage.sun.prefix)}
      <strong>${escapeHtml(identity.sunSign)}</strong>,
      so Pluto is traveling through my solar
      <select id="sunHouseInput">
        ${getHouseOptions(response.houses.sun)}
      </select>
      House.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.moon.prefix)}
      <strong>${escapeHtml(identity.moonSign)}</strong>,
      so Pluto is traveling through my lunar
      <select id="moonHouseInput">
        ${getHouseOptions(response.houses.moon)}
      </select>
      House.
    </p>

    <p>
      ${escapeHtml(event.contextLanguage.rising.prefix)}
      <strong>${escapeHtml(identity.risingSign)}</strong>,
      so Pluto is traveling through my natal
      <select id="risingHouseInput">
        ${getHouseOptions(response.houses.rising)}
      </select>
      House.
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
      storyState.currentAnchorId = "annualEventScene";
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
    <section>
      <h3>${escapeHtml(heading)}</h3>

      <p>
        House ${escapeHtml(house)}
      </p>

      ${activities
        .map((activity, index) => {
          const checked = selectedActivities.includes(activity)
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

function renderChoices({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  app.innerHTML = `
    <h2>${escapeHtml(event.choicesTitle)}</h2>

    <p>
      ${escapeHtml(event.choicesIntroduction)}
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

    <p id="annualChoicesError" style="display: none;">
      Please select at least one activity for each placement.
    </p>

    <button id="backToAnnualContext">
      Back
    </button>

    <button id="continueAnnualChoices">
      Continue
    </button>
  `;

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
      getSelectedActivities("sun", response.houses.sun);

    response.activities.moon =
      getSelectedActivities("moon", response.houses.moon);

    response.activities.rising =
      getSelectedActivities(
        "rising",
        response.houses.rising
      );
  }

  document
    .getElementById("backToAnnualContext")
    .addEventListener("click", () => {
      saveActivities();
      storyState.currentAnchorId = "annualEventContext";
      render();
    });

  document
    .getElementById("continueAnnualChoices")
    .addEventListener("click", () => {
      saveActivities();

      const allComplete =
        response.activities.sun.length > 0 &&
        response.activities.moon.length > 0 &&
        response.activities.rising.length > 0;

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

function renderReflectionField({
  lens,
  heading,
  prompt,
  selectedActivities,
  value
}) {
  return `
    <section>
      <h3>${escapeHtml(heading)}</h3>

      <p>
        <strong>${escapeHtml(prompt)}</strong>
      </p>

      <p>
        Your selected themes:
        ${escapeHtml(selectedActivities.join(" · "))}
      </p>

      <textarea
        id="${lens}AnnualReflection"
        rows="5"
        style="width: 100%;"
        placeholder="Complete this thought in your own words."
      >${escapeHtml(value)}</textarea>

      <br><br>
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
      heading: event.reflectionPrompts.rising.heading,
      prompt: event.reflectionPrompts.rising.prompt,
      selectedActivities: response.activities.rising,
      value: response.reflections.rising
    })}

    <p id="annualReflectionError" style="display: none;">
      Please respond to all three prompts before continuing.
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
        .getElementById("risingAnnualReflection")
        .value
        .trim();
  }

  document
    .getElementById("backToAnnualChoices")
    .addEventListener("click", () => {
      saveReflections();
      storyState.currentAnchorId = "annualEventChoices";
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

      storyState.outputs.annualEventStories[event.id] = {
        title: event.reflectionTitle,
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
  app.innerHTML = `
    <h2>${escapeHtml(event.reflectionTitle)}</h2>

    <h3>
      ${escapeHtml(event.reflectionPrompts.sun.heading)}
    </h3>
    <p>${escapeHtml(response.reflections.sun)}</p>

    <h3>
      ${escapeHtml(event.reflectionPrompts.moon.heading)}
    </h3>
    <p>${escapeHtml(response.reflections.moon)}</p>

    <h3>
      ${escapeHtml(event.reflectionPrompts.rising.heading)}
    </h3>
    <p>${escapeHtml(response.reflections.rising)}</p>

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
