import { getCurrentAnchor, advanceStory } from "./engine.js";
import { storyState } from "./state.js";
import { zodiacKeywords } from "../assets/keywords/zodiacKeywords.js";
import {
  characterSketchLanguage,
  signElements
} from "../assets/narratives/characterSketchLanguage.js";
import { renderAnnualEventAnchor } from "./annualEventRuntime.js";

const app = document.getElementById("app");
const nextButton = document.getElementById("nextButton");
const titleAttribution =
  document.getElementById("titleAttribution");
function loadDevelopmentCheckpoint() {
  const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isLocalDevelopment) {
    return;
  }

  const checkpoint =
    new URLSearchParams(window.location.search).get("test");

  const checkpointAnchors = {
    pluto: {
      currentAnchorId: "annualEventScene",
      completedAnchors: [
        "welcome",
        "identityCollection",
        "sunSignSelection",
        "moonSignSelection",
        "risingSignSelection",
        "sunKeywordSelection",
        "moonKeywordSelection",
        "risingKeywordSelection",
        "sunReflection",
        "moonReflection",
        "risingReflection",
        "characterSketch",
        "characterReflection"
      ]
    },

    "pluto-context": {
      currentAnchorId: "annualEventContext",
      completedAnchors: [
        "welcome",
        "identityCollection",
        "sunSignSelection",
        "moonSignSelection",
        "risingSignSelection",
        "sunKeywordSelection",
        "moonKeywordSelection",
        "risingKeywordSelection",
        "sunReflection",
        "moonReflection",
        "risingReflection",
        "characterSketch",
        "characterReflection",
        "annualEventScene"
      ]
    },

    "pluto-choices": {
      currentAnchorId: "annualEventChoices",
      completedAnchors: [
        "welcome",
        "identityCollection",
        "sunSignSelection",
        "moonSignSelection",
        "risingSignSelection",
        "sunKeywordSelection",
        "moonKeywordSelection",
        "risingKeywordSelection",
        "sunReflection",
        "moonReflection",
        "risingReflection",
        "characterSketch",
        "characterReflection",
        "annualEventScene",
        "annualEventContext"
      ]
    },

    "pluto-story": {
      currentAnchorId: "annualEventReflection",
      completedAnchors: [
        "welcome",
        "identityCollection",
        "sunSignSelection",
        "moonSignSelection",
        "risingSignSelection",
        "sunKeywordSelection",
        "moonKeywordSelection",
        "risingKeywordSelection",
        "sunReflection",
        "moonReflection",
        "risingReflection",
        "characterSketch",
        "characterReflection",
        "annualEventScene",
        "annualEventContext",
        "annualEventChoices"
      ]
    }
  };

  const selectedCheckpoint =
    checkpointAnchors[checkpoint];

  if (!selectedCheckpoint) {
    return;
  }

  storyState.identity = {
    name: "Tracy",
    sunSign: "Taurus",
    moonSign: "Scorpio",
    risingSign: "Aquarius"
  };

  storyState.selections = {
    sunKeyword: "Pleasure-seeking",
    moonKeyword: "Passionate",
    risingKeyword: "Detached",
    reflection:
      "This broadly reflects how I understand myself."
  };

  storyState.characterResponses = {
    sunShine:
      "I allow myself to experience new and exciting things.",
    sunPride:
      "I make time to do the things I love.",
    moonEase:
      "I express my softer emotions in an unguarded way.",
    moonMotivation:
      "I follow through on my promises to the people I care about.",
    risingStyle:
      "friendly yet independent",
    risingActions:
      "directed toward fulfilling a personal desire"
  };

  storyState.annualJourney = {
    year: 2026,
    currentEventIndex: 0,

    responses: {
      plutoAquarius: {
        houses: {
          sun: "10",
          moon: "4",
          rising: "1"
        },

        activities: {
          sun: [
            "Ask for a raise or a promotion"
          ],

          moon: [
            "Spend time with my family"
          ],

          rising: [
            "Refresh my look with new clothes, a haircut, or a makeover"
          ]
        },

        natalPlanets: {
          Saturn: [
            "Grounded",
            "Patient"
          ]
        },

        reflections: {
          sun: "",
          moon: "",
          rising: ""
        }
      }
    }
  };

  storyState.outputs = {
    characterSketch: null,
    annualEventStories: {}
  };

  storyState.completedAnchors = [
    ...selectedCheckpoint.completedAnchors
  ];

  storyState.currentAnchorId =
    selectedCheckpoint.currentAnchorId;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function capitalizeFirst(value = "") {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lowercaseFirst(value = "") {
  if (!value) return "";

  return value.charAt(0).toLowerCase() + value.slice(1);
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removePromptStem(value = "", stems = []) {
  let response = String(value).trim();

  stems.forEach(stem => {
    const pattern = new RegExp(
      `^${escapeRegExp(stem)}[\\s,:;.!?–—-]*`,
      "i"
    );

    response = response.replace(pattern, "");
  });

  return response.trim();
}

function shiftToSecondPerson(value = "") {
  return String(value)
    .replace(/\bI am\b/gi, "you are")
    .replace(/\bI'm\b/gi, "you're")
    .replace(/\bmyself\b/gi, "yourself")
    .replace(/\bmine\b/gi, "yours")
    .replace(/\bmy\b/gi, "your")
    .replace(/\bme\b/gi, "you")
    .replace(/\bI\b/gi, "you");
}

function cleanParticipantResponse(value = "", stems = []) {
  let response = removePromptStem(value, stems);

  response = shiftToSecondPerson(response)
    .replace(/[.!?]+$/, "")
    .trim();

  return response;
}

function buildSunShineSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "I shine in the world when I",
    "I shine in the world when",
    "When I"
  ]);

  if (/^when\s+/i.test(response)) {
    response = response.replace(/^when\s+/i, "");
  }

  if (/^(you|your)\b/i.test(response)) {
    return `In your own life, this becomes visible when ${lowercaseFirst(
      response
    )}.`;
  }

  if (/^am\s+/i.test(response)) {
    response = response.replace(/^am\s+/i, "are ");
  }

  return `In your own life, this becomes visible when you ${lowercaseFirst(
    response
  )}.`;
}

function buildSunPrideSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "I am proud of myself when I",
    "I am proud of myself when",
    "When I"
  ]);

  if (/^when\s+/i.test(response)) {
    response = response.replace(/^when\s+/i, "");
  }

  if (/^you\b/i.test(response)) {
    return `You take particular pride when ${lowercaseFirst(response)}.`;
  }

  if (/^are\s+/i.test(response)) {
    return `You take particular pride when you ${lowercaseFirst(response)}.`;
  }

  return `You take particular pride in the ways you ${lowercaseFirst(
    response
  )}.`;
}

function buildMoonEaseSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "I feel most at ease when I am",
    "I feel most at ease when I",
    "I feel most at ease when",
    "When I am",
    "When I"
  ]);

  if (/^when\s+/i.test(response)) {
    response = response.replace(/^when\s+/i, "");
  }

  if (/^(you are|you're|you|your)\b/i.test(response)) {
    return `You feel most at ease when ${lowercaseFirst(response)}.`;
  }

  if (/^am\s+/i.test(response)) {
    response = response.replace(/^am\s+/i, "");

    return `You feel most at ease when you are ${lowercaseFirst(
      response
    )}.`;
  }

  const actionVerbs = [
    "accept",
    "allow",
    "care",
    "choose",
    "connect",
    "create",
    "express",
    "feel",
    "focus",
    "follow",
    "give",
    "have",
    "help",
    "learn",
    "listen",
    "make",
    "move",
    "protect",
    "pursue",
    "rest",
    "share",
    "speak",
    "spend",
    "stay",
    "take",
    "trust",
    "work",
    "write"
  ];

  const beginsWithAction = actionVerbs.some(verb =>
    response.toLowerCase().startsWith(`${verb} `)
  );

  if (beginsWithAction) {
    return `You feel most at ease when you ${lowercaseFirst(response)}.`;
  }

  return `You feel most at ease when you are ${lowercaseFirst(response)}.`;
}

function buildMoonMotivationSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "I am motivated by the need to",
    "I am motivated by",
    "I need to",
    "I want to"
  ]);

  response = response
    .replace(/^you\s+/i, "")
    .replace(/^are\s+/i, "be ")
    .trim();

  return `Beneath many of your choices is a need to ${lowercaseFirst(
    response
  )}.`;
}

function buildRisingStyleSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "My style is",
    "I would describe my style as",
    "I describe my style as",
    "I am"
  ]);

  response = response
    .replace(/^you are\s+/i, "")
    .replace(/^you're\s+/i, "")
    .trim();

  if (/^like\s+/i.test(response)) {
    response = `being ${response}`;
  }

  return `You describe your style as ${lowercaseFirst(response)}.`;
}

function buildRisingActionsSentence(value = "") {
  let response = cleanParticipantResponse(value, [
    "Others would describe my actions as",
    "Others would describe me as",
    "People would describe me as",
    "I am"
  ]);

  response = response
    .replace(/^you are\s+/i, "")
    .replace(/^you're\s+/i, "")
    .trim();

  if (/^like\s+/i.test(response)) {
    response = `being ${response}`;
  }

  return `As that quality takes shape in your actions, others may experience you as ${lowercaseFirst(
    response
  )}.`;
}

function determineRelationship(sunSign, moonSign) {
  if (sunSign === moonSign) {
    return "reinforcement";
  }

  const sunElement = signElements[sunSign];
  const moonElement = signElements[moonSign];

  if (sunElement === moonElement) {
    return "reinforcement";
  }

  const supportivePairs = [
    ["Fire", "Air"],
    ["Earth", "Water"]
  ];

  const frictionPairs = [
    ["Fire", "Water"],
    ["Earth", "Air"]
  ];

  const isPair = (pairs, first, second) =>
    pairs.some(
      ([a, b]) =>
        (first === a && second === b) ||
        (first === b && second === a)
    );

  if (isPair(supportivePairs, sunElement, moonElement)) {
    return "support";
  }

  if (isPair(frictionPairs, sunElement, moonElement)) {
    return "friction";
  }

  return "contrast";
}

function getRelationshipLanguage(relationship) {
  const language = {
    reinforcement: {
      interior:
        "That same movement continues beneath the surface rather than changing direction.",
      threshold:
        "Because the center and the interior are moving in related ways, what reaches the world carries a strong sense of continuity.",
      integration:
        "Over time, this creates a steady internal current: what sustains you, what moves within you, and how you meet the world repeatedly return to the same underlying center."
    },

    support: {
      interior:
        "Your inner life does not oppose that movement; it gives it another form through which to deepen and become more fully lived.",
      threshold:
        "When these layers meet the world, they tend to support one another, even when they speak in different tones.",
      integration:
        "Over time, the relationship between your center and your emotional life can become a source of resilience, while your outward manner gives that inner relationship a visible form."
    },

    friction: {
      interior:
        "Yet the inner movement does not simply follow the direction set by the center. It introduces a tension that complicates what might otherwise seem straightforward.",
      threshold:
        "When this reaches the world, what is expressed may carry both the force of what sustains you and the pressure of what remains unresolved beneath it.",
      integration:
        "Over time, this tension does not have to disappear. It can become the place where self-knowledge develops, as each part of you continually asks the others to become more honest."
    },

    contrast: {
      interior:
        "At the same time, your inner life moves according to a different rhythm, adding another dimension to how experience is felt and understood.",
      threshold:
        "When these differing movements meet the world, they are not displayed separately. They become translated through one another.",
      integration:
        "Over time, this does not resolve into something fixed. It continues to refine itself through the relationship between what sustains you, what moves within you, and how you are ultimately expressed."
    }
  };

  return language[relationship];
}

function buildCharacterSketch() {
  const name = storyState.identity.name;

  const sunSign = storyState.identity.sunSign;
  const moonSign = storyState.identity.moonSign;

  const sunKeyword = storyState.selections.sunKeyword;
  const moonKeyword = storyState.selections.moonKeyword;
  const risingKeyword = storyState.selections.risingKeyword;

  const sunLanguage = characterSketchLanguage[sunKeyword];
  const moonLanguage = characterSketchLanguage[moonKeyword];
  const risingLanguage = characterSketchLanguage[risingKeyword];

  const responses = storyState.characterResponses;

  if (!sunLanguage || !moonLanguage || !risingLanguage) {
    return `${name}, your Character Sketch could not be completed because one or more narrative selections are missing.`;
  }

  const sunShineSentence = buildSunShineSentence(
    responses.sunShine
  );

  const sunPrideSentence = buildSunPrideSentence(
    responses.sunPride
  );

  const moonEaseSentence = buildMoonEaseSentence(
    responses.moonEase
  );

  const moonMotivationSentence =
    buildMoonMotivationSentence(
      responses.moonMotivation
    );

  const risingStyleSentence = buildRisingStyleSentence(
    responses.risingStyle
  );

  const risingActionsSentence =
    buildRisingActionsSentence(
      responses.risingActions
    );

  const relationship = determineRelationship(
    sunSign,
    moonSign
  );

  const relationshipLanguage =
    getRelationshipLanguage(relationship);

  const paragraphs = [
    `${name}, ${sunLanguage.sun} ${sunShineSentence} ${sunPrideSentence}`,

    `${relationshipLanguage.interior} ${capitalizeFirst(
      moonLanguage.moon
    )} ${moonEaseSentence} ${moonMotivationSentence}`,

    `${relationshipLanguage.threshold} ${capitalizeFirst(
      risingLanguage.rising
    )} ${risingStyleSentence} ${risingActionsSentence}`,

    relationshipLanguage.integration
  ];

  return paragraphs.join("\n\n");
}

function getSignOptions() {
  return Object.keys(zodiacKeywords)
    .map(sign => `<option value="${sign}">${sign}</option>`)
    .join("");
}

function savePromptResponses(fields) {
  fields.forEach(field => {
    storyState.characterResponses[field.stateKey] =
      document.getElementById(field.id).value.trim();
  });
}

function renderCharacterPromptPage({
  title,
  subtitle,
  keywordLabel,
  keyword,
  fields,
  backAnchor
}) {
  app.innerHTML = `
    <h2>${escapeHtml(title)}</h2>

    <p>${escapeHtml(subtitle)}</p>

    <p>
      <strong>${escapeHtml(keywordLabel)}:</strong>
      ${escapeHtml(keyword)}
    </p>

    ${fields
      .map(
        field => `
          <label for="${field.id}">
            <strong>${escapeHtml(field.label)}</strong>
          </label>

          <textarea
            id="${field.id}"
            rows="4"
            style="width: 100%;"
            placeholder="Complete this sentence in your own words."
          >${escapeHtml(
            storyState.characterResponses[field.stateKey] || ""
          )}</textarea>

          <br><br>
        `
      )
      .join("")}

    <p id="promptError" style="display: none;">
      Please respond to both prompts before continuing.
    </p>

    <button id="backPromptButton">
      Back
    </button>

    <button id="continuePromptButton">
      Continue
    </button>
  `;

  document
    .getElementById("backPromptButton")
    .addEventListener("click", () => {
      savePromptResponses(fields);
      storyState.currentAnchorId = backAnchor;
      render();
    });

  document
    .getElementById("continuePromptButton")
    .addEventListener("click", () => {
      savePromptResponses(fields);

      const allComplete = fields.every(
        field =>
          storyState.characterResponses[field.stateKey].length > 0
      );

      if (!allComplete) {
        document.getElementById("promptError").style.display = "block";
        return;
      }

      advanceStory();
      render();
    });
}

function render() {
  const current = getCurrentAnchor();

  console.log("Current Anchor ID:", current.id);

  if (nextButton) {
  nextButton.style.display = "none";
}

if (titleAttribution) {
  titleAttribution.style.display =
    current.id === "welcome"
      ? "block"
      : "none";
}

const annualEventWasRendered =
  renderAnnualEventAnchor({
    anchorId: current.id,
    app,
    advanceStory,
    render
  });

if (annualEventWasRendered) {
  return;
}

if (current.id === "welcome") {
  app.innerHTML = `
    <h2>Welcome</h2>

    <p>
      This is the beginning of your Storybook journey.
    </p>

    <button id="startButton">
      Begin
    </button>
  `;

  document
    .getElementById("startButton")
    .addEventListener("click", () => {
      advanceStory();
      render();
    });

  return;
}

  if (current.id === "identityCollection") {
    app.innerHTML = `
      <h2>What is your name?</h2>
      <input id="nameInput" type="text">
      <button id="submitName">Submit</button>
    `;

    document.getElementById("submitName").addEventListener("click", () => {
      const name = document.getElementById("nameInput").value.trim();

      if (!name) {
        return;
      }

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

    document
      .getElementById("submitSunSign")
      .addEventListener("click", () => {
        const sunSign =
          document.getElementById("sunSignInput").value;

        if (!sunSign) {
          return;
        }

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

    document
      .getElementById("submitMoonSign")
      .addEventListener("click", () => {
        const moonSign =
          document.getElementById("moonSignInput").value;

        if (!moonSign) {
          return;
        }

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

    document
      .getElementById("submitRisingSign")
      .addEventListener("click", () => {
        const risingSign =
          document.getElementById("risingSignInput").value;

        if (!risingSign) {
          return;
        }

        storyState.identity.risingSign = risingSign;
        advanceStory();
        render();
      });

    return;
  }

  if (current.id === "sunKeywordSelection") {
    const keywords =
      zodiacKeywords[storyState.identity.sunSign] || [];

    app.innerHTML = `
      <h2>Select Your Sun Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document.querySelectorAll(".kw").forEach(button => {
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

    app.innerHTML = `
      <h2>Select Your Moon Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document.querySelectorAll(".kw").forEach(button => {
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

    app.innerHTML = `
      <h2>Select Your Rising Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document.querySelectorAll(".kw").forEach(button => {
      button.addEventListener("click", () => {
        storyState.selections.risingKeyword =
          button.dataset.keyword;

        advanceStory();
        render();
      });
    });

    return;
  }

  if (current.id === "sunReflection") {
    renderCharacterPromptPage({
      title: "Your Sun",
      subtitle:
        "Your Sun describes vitality, meaning, and purpose. Complete both sentences in your own words.",
      keywordLabel: "Your selected Sun keyword",
      keyword: storyState.selections.sunKeyword,
      backAnchor: "risingKeywordSelection",
      fields: [
        {
          id: "sunShineInput",
          stateKey: "sunShine",
          label: "I shine in the world when I…"
        },
        {
          id: "sunPrideInput",
          stateKey: "sunPride",
          label: "I am proud of myself when I…"
        }
      ]
    });

    return;
  }

  if (current.id === "moonReflection") {
    renderCharacterPromptPage({
      title: "Your Moon",
      subtitle:
        "Your Moon describes emotional needs, comfort, and motivation. Complete both sentences in your own words.",
      keywordLabel: "Your selected Moon keyword",
      keyword: storyState.selections.moonKeyword,
      backAnchor: "sunReflection",
      fields: [
        {
          id: "moonEaseInput",
          stateKey: "moonEase",
          label: "I feel most at ease when I am…"
        },
        {
          id: "moonMotivationInput",
          stateKey: "moonMotivation",
          label: "I am motivated by the need to…"
        }
      ]
    });

    return;
  }

  if (current.id === "risingReflection") {
    renderCharacterPromptPage({
      title: "Your Rising Sign",
      subtitle:
        "Your Rising sign describes style, behavior, and how others experience you. Complete both sentences in your own words.",
      keywordLabel: "Your selected Rising keyword",
      keyword: storyState.selections.risingKeyword,
      backAnchor: "moonReflection",
      fields: [
        {
          id: "risingStyleInput",
          stateKey: "risingStyle",
          label: "My style is…"
        },
        {
          id: "risingActionsInput",
          stateKey: "risingActions",
          label: "Others would describe my actions as…"
        }
      ]
    });

    return;
  }

  if (current.id === "characterSketch") {
    const sketch = buildCharacterSketch();

    storyState.outputs.characterSketch = sketch;

    const sketchParagraphs = sketch
      .split("\n\n")
      .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");

    app.innerHTML = `
      <h2>Your Character Sketch</h2>

      ${sketchParagraphs}

      <button id="backToRisingReflection">
        Back
      </button>

      <button id="continueToReflection">
        Continue
      </button>
    `;

    document
      .getElementById("backToRisingReflection")
      .addEventListener("click", () => {
        storyState.currentAnchorId = "risingReflection";
        render();
      });

    document
      .getElementById("continueToReflection")
      .addEventListener("click", () => {
        advanceStory();
        render();
      });

    return;
  }

  if (current.id === "characterReflection") {
    const savedReflection =
      storyState.selections.reflection || "";

    app.innerHTML = `
      <h2>In Your Own Words</h2>

      <p>
        Does this resonate with how you see yourself?
        What feels accurate, and what feels different,
        incomplete, or missing? Add anything you would
        like to say in your own words.
      </p>

      <textarea
        id="reflectionInput"
        rows="6"
        style="width: 100%;"
      >${escapeHtml(savedReflection)}</textarea>

      <br><br>

      <button id="backToCharacterSketch">
        Back
      </button>

      <button id="submitReflection">
        Submit
      </button>
    `;

    document
      .getElementById("backToCharacterSketch")
      .addEventListener("click", () => {
        const text =
          document.getElementById("reflectionInput").value.trim();

        storyState.selections.reflection = text;
        storyState.currentAnchorId = "characterSketch";

        render();
      });

    document
      .getElementById("submitReflection")
      .addEventListener("click", () => {
        const text =
          document.getElementById("reflectionInput").value.trim();

        storyState.selections.reflection = text;

        advanceStory();
        render();
      });

    return;
  }

  app.innerHTML = `
    <h2>Storybook</h2>
    <p>The next chamber is ready to be built.</p>
  `;
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    advanceStory();
    render();
  });
}

document.addEventListener("keydown", event => {
  if (
    event.key !== "Enter" ||
    event.isComposing
  ) {
    return;
  }

  const target = event.target;

  if (
    target instanceof HTMLTextAreaElement &&
    event.shiftKey
  ) {
    return;
  }

  if (
    target instanceof HTMLInputElement &&
    ["checkbox", "radio", "button", "submit"].includes(
      target.type
    )
  ) {
    return;
  }

  const forwardButtons = Array.from(
    app.querySelectorAll("button")
  ).filter(button => {
    const isVisible =
      button.offsetParent !== null;

    const isBackButton =
      button.id.toLowerCase().includes("back");

    return (
      isVisible &&
      !isBackButton &&
      !button.disabled
    );
  });

  if (forwardButtons.length === 0) {
    return;
  }

  event.preventDefault();

  const forwardButton =
    forwardButtons[forwardButtons.length - 1];

  forwardButton.click();
});

loadDevelopmentCheckpoint();
render();
