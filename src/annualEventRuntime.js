import { storyState } from "./state.js";
import { storyYear2026 } from "../assets/storyYears/2026/annualEvents.js";
import {
  escapeHtml,
  getEventResponse,
  renderScene
} from "./annualEventShared.js";
import { renderAnnualEventContext } from "./annualEventContextRuntime.js";
import { renderAnnualEventChoices } from "./annualEventChoicesRuntime.js";
import {
  buildAnnualEventStory,
  renderAnnualEventReflection
} from "./annualEventReflectionRuntime.js";

function getCurrentEvent() {
  return storyYear2026.events[
    storyState.annualJourney.currentEventIndex
  ];
}

function collectTextValues(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap(item => collectTextValues(item));
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap(item => collectTextValues(item));
  }

  return [String(value)].filter(Boolean);
}

function uniqueValues(values = []) {
  return Array.from(
    new Set(
      values
        .map(value => String(value).trim())
        .filter(Boolean)
    )
  );
}

function renderReflectionModeContent({
  response,
  savedStory,
  storyTitle
}) {
  const selectedActivities = uniqueValues(
    collectTextValues(response.activities)
  );

  const selectedNatalPlanets = uniqueValues(
    collectTextValues(response.natalPlanets)
  );

  const writtenReflections = uniqueValues(
    collectTextValues(response.reflections)
  );

  const participantReflection =
    response.participantReflection ||
    savedStory?.participantReflection ||
    "";

  const reflectionTitle = storyTitle.replace(
    /Story$/i,
    "Reflection"
  );

  const activityList = selectedActivities.length
    ? `<ul>${selectedActivities
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : `<p>No activity phrases were selected for this chapter.</p>`;

  const natalPlanetList = selectedNatalPlanets.length
    ? `<ul>${selectedNatalPlanets
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : `<p>No natal planet activations were selected for this chapter.</p>`;

  const reflectionList = writtenReflections.length
    ? `<ul>${writtenReflections
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>`
    : `<p>No written prompt responses have been added yet.</p>`;

  return `
    <h2>${escapeHtml(reflectionTitle)}</h2>

    <p>
      In Reflection-First Mode, the Storybook holds the
      structure of this chapter while leaving more of the
      interpretation to the participant.
    </p>

    <section style="margin-top: 24px;">
      <h3>Selected Activity Phrases</h3>
      ${activityList}
    </section>

    <section style="margin-top: 24px;">
      <h3>Selected Natal Planet Material</h3>
      ${natalPlanetList}
    </section>

    <section style="margin-top: 24px;">
      <h3>Your Prompt Responses</h3>
      ${reflectionList}
    </section>

    <section style="margin-top: 36px;">
      <h3>In Your Own Words</h3>

      <p>
        Review the material above. What does this chapter
        suggest about the part of your 2026 story now being
        activated, reviewed, released, strengthened, or
        reimagined?
      </p>

      <textarea
        id="annualStoryParticipantReflection"
        rows="8"
        style="width: 100%;"
        placeholder="Write your interpretation of this chapter here."
      >${escapeHtml(participantReflection)}</textarea>
    </section>
  `;
}

function renderGuidedModeContent({
  narrative,
  participantReflection,
  storyTitle
}) {
  const narrativeParagraphs = narrative
    .split("\n\n")
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  return `
    <h2>${escapeHtml(storyTitle)}</h2>

    ${narrativeParagraphs}

    <section style="margin-top: 36px;">
      <h3>In Your Own Words</h3>

      <p>
        Does this story resonate with how you understand
        this part of your life? What feels accurate, and
        what feels different, incomplete, or missing?
        Add anything you would like to say in your own words.
      </p>

      <textarea
        id="annualStoryParticipantReflection"
        rows="6"
        style="width: 100%;"
        placeholder="Add your reflection here, or leave this blank."
      >${escapeHtml(participantReflection)}</textarea>
    </section>
  `;
}

function renderComplete({
  app,
  event,
  response,
  advanceStory,
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

  const participantReflection =
    response.participantReflection ||
    savedStory?.participantReflection ||
    "";

  const chapterContent =
    storyState.storyMode === "reflection"
      ? renderReflectionModeContent({
          response,
          savedStory,
          storyTitle
        })
      : renderGuidedModeContent({
          narrative,
          participantReflection,
          storyTitle
        });

  app.innerHTML = `
    ${chapterContent}

    <br>

    <button id="backToAnnualReflection">Back</button>
    <button id="continueFromAnnualStory">Continue</button>
  `;

  function saveParticipantReflection() {
    const reflection = document
      .getElementById(
        "annualStoryParticipantReflection"
      )
      .value
      .trim();

    response.participantReflection =
      reflection;

    if (
      storyState.outputs.annualEventStories[
        event.id
      ]
    ) {
      storyState.outputs.annualEventStories[
        event.id
      ].participantReflection =
        reflection;
    }
  }

  document
    .getElementById("backToAnnualReflection")
    .addEventListener("click", () => {
      saveParticipantReflection();

      storyState.currentAnchorId =
        "annualEventReflection";

      render();
    });

  document
    .getElementById("continueFromAnnualStory")
    .addEventListener("click", () => {
      saveParticipantReflection();

      const nextEventIndex =
        storyState.annualJourney.currentEventIndex + 1;

      const nextEvent =
        storyYear2026.events[nextEventIndex];

      if (nextEvent) {
        storyState.annualJourney.currentEventIndex =
          nextEventIndex;

        storyState.currentAnchorId =
          "annualEventScene";

        render();
        return;
      }

      advanceStory();
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

  const response = getEventResponse(event);

  if (anchorId === "annualEventScene") {
    renderScene({
      app,
      event,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventContext") {
    renderAnnualEventContext({
      app,
      event,
      response,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventChoices") {
    renderAnnualEventChoices({
      app,
      event,
      response,
      advanceStory,
      render
    });
  }

  if (anchorId === "annualEventReflection") {
    renderAnnualEventReflection({
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
      advanceStory,
      render
    });
  }

  return true;
}
