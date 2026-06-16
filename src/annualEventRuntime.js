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

  const participantReflection =
    response.participantReflection ||
    savedStory?.participantReflection ||
    "";

  app.innerHTML = `
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

      app.innerHTML = `
        <h2>${escapeHtml(storyTitle)} Complete</h2>

        <p>Your story has been completed.</p>

        <p>
          The next Storybook chamber is ready to be added.
        </p>

        <button id="backToCompletedStory">Back</button>
      `;

      document
        .getElementById("backToCompletedStory")
        .addEventListener("click", () => {
          storyState.currentAnchorId =
            "annualEventComplete";

          render();
        });
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
      render
    });
  }

  return true;
}
