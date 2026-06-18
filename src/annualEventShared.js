import { storyState } from "./state.js";
import { houseActivityKeywords } from "../assets/keywords/houseActivityKeywords.js";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function ordinalHouse(house = "") {
  const number = Number(house);

  if (!number) return "";
  if (number === 1) return "1st House";
  if (number === 2) return "2nd House";
  if (number === 3) return "3rd House";

  return `${number}th House`;
}

export function getHouseOptions(selectedHouse = "") {
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

export function getEventResponse(event) {
  const eventId = event.id;

  if (!storyState.annualJourney.responses[eventId]) {
    if (event.type === "transitionHouse" || event.type === "eclipsePair" || event.type === "retrogradePair") {
      storyState.annualJourney.responses[eventId] = {
        houses: {
          from: { sun: "", moon: "", rising: "" },
          to: { sun: "", moon: "", rising: "" }
        },
        activities: {
          from: { sun: [], moon: [], rising: [] },
          to: { sun: [], moon: [], rising: [] }
        },
        natalPlanets: {
          from: {},
          to: {}
        },
        reflections: {
          from: { sun: "", moon: "", rising: "" },
          to: { sun: "", moon: "", rising: "" }
        }
      };
    } else {
      storyState.annualJourney.responses[eventId] = {
        houses: { sun: "", moon: "", rising: "" },
        activities: { sun: [], moon: [], rising: [] },
        natalPlanets: {},
        reflections: { sun: "", moon: "", rising: "" }
      };
    }
  }

  const response =
    storyState.annualJourney.responses[eventId];

  if (
    event.type !== "transitionHouse" &&
    event.type !== "eclipsePair" &&
    event.type !== "retrogradePair" &&
    !response.natalPlanets
  ) {
    response.natalPlanets = {};
  }

  return response;
}

export function renderScene({
  app,
  event,
  advanceStory,
  render
}) {
  const narrative = event.narrative
    .map(
      paragraph =>
        `<p>${escapeHtml(paragraph)}</p>`
    )
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
      if (
        storyState.annualJourney.currentEventIndex > 0
      ) {
        storyState.annualJourney.currentEventIndex -= 1;
        storyState.currentAnchorId =
          "annualEventComplete";
      } else {
        storyState.currentAnchorId =
          "characterReflection";
      }

      render();
    });

  document
    .getElementById("continueAnnualScene")
    .addEventListener("click", () => {
      advanceStory();
      render();
    });
}

export function renderLookupTable(event) {
  if (event.type === "transitionHouse" || event.type === "eclipsePair" || event.type === "retrogradePair") {
    const rows = Object.entries(event.houseLookup)
      .map(([sign, houses]) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(sign)}
          </td>
          <td style="padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(ordinalHouse(houses.from))}
          </td>
          <td style="padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(ordinalHouse(houses.to))}
          </td>
        </tr>
      `)
      .join("");

    return `
      <h3>${escapeHtml(event.lookupTitle)}</h3>

      <table
        style="
          width: 100%;
          max-width: 850px;
          border-collapse: collapse;
          margin-bottom: 24px;
        "
      >
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border: 1px solid #cccccc;">
              ${escapeHtml(event.lookupColumns.sign)}
            </th>
            <th style="text-align: left; padding: 8px; border: 1px solid #cccccc;">
              ${escapeHtml(event.lookupColumns.fromHouse)}
            </th>
            <th style="text-align: left; padding: 8px; border: 1px solid #cccccc;">
              ${escapeHtml(event.lookupColumns.toHouse)}
            </th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  const rows = Object.entries(event.houseLookup)
    .map(([sign, house]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #cccccc;">
          ${escapeHtml(sign)}
        </td>
        <td style="padding: 8px; border: 1px solid #cccccc;">
          ${escapeHtml(ordinalHouse(house))}
        </td>
      </tr>
    `)
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
          <th style="text-align: left; padding: 8px; border: 1px solid #cccccc;">
            ${escapeHtml(event.lookupColumns.sign)}
          </th>
          <th style="text-align: left; padding: 8px; border: 1px solid #cccccc;">
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

export function renderActivityGroup({
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
            selectedActivities[0] === activity
              ? "checked"
              : "";

          return `
            <label>
              <input
                type="radio"
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

export function getSelectedActivities(
  lens,
  house
) {
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
