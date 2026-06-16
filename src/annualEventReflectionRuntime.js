import { storyState } from "./state.js";
import { houseNarrativeFocus } from "../assets/narratives/houseNarrativeFocus.js";
import { planetEventLanguage } from "../assets/narratives/planetEventLanguage.js";
import {
  escapeHtml,
  ordinalHouse
} from "./annualEventShared.js";

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

  if (cleanItems.length === 0) return "";
  if (cleanItems.length === 1) return cleanItems[0];

  if (cleanItems.length === 2) {
    return `${cleanItems[0]} and ${cleanItems[1]}`;
  }

  return `${cleanItems
    .slice(0, -1)
    .join(", ")}, and ${cleanItems.at(-1)}`;
}

function fillTemplate(template = "", values = {}) {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{${key}}`, value),
    template
  );
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

function toPastTensePhrase(value = "") {
  const phrase = String(value).trim();

  if (!phrase) return "";

  const authoredPhraseReplacements = [
    [
      /\breach out and help\b/gi,
      "reached out and helped"
    ],
    [
      /\bdo something that will give\b/gi,
      "did something that gave"
    ]
  ];

  for (const [pattern, replacement] of authoredPhraseReplacements) {
    if (pattern.test(phrase)) {
      return phrase.replace(pattern, replacement);
    }
  }

  const irregularVerbs = {
    am: "was",
    are: "were",
    arise: "arose",
    become: "became",
    begin: "began",
    break: "broke",
    bring: "brought",
    build: "built",
    buy: "bought",
    choose: "chose",
    come: "came",
    do: "did",
    draw: "drew",
    drink: "drank",
    drive: "drove",
    eat: "ate",
    feel: "felt",
    find: "found",
    get: "got",
    give: "gave",
    go: "went",
    grow: "grew",
    have: "had",
    hear: "heard",
    hold: "held",
    keep: "kept",
    know: "knew",
    lead: "led",
    leave: "left",
    let: "let",
    lose: "lost",
    make: "made",
    meet: "met",
    pay: "paid",
    read: "read",
    run: "ran",
    say: "said",
    see: "saw",
    seek: "sought",
    send: "sent",
    set: "set",
    sing: "sang",
    sit: "sat",
    speak: "spoke",
    spend: "spent",
    stand: "stood",
    take: "took",
    teach: "taught",
    tell: "told",
    think: "thought",
    understand: "understood",
    wear: "wore",
    win: "won",
    write: "wrote"
  };

  const match = phrase.match(
    /^([A-Za-z'-]+)(.*)$/
  );

  if (!match) return phrase;

  const [, firstWord, remainder] = match;
  const lowerWord = firstWord.toLowerCase();

  let pastWord = irregularVerbs[lowerWord];

  if (!pastWord) {
    if (/e$/i.test(firstWord)) {
      pastWord = `${firstWord}d`;
    } else if (/[^aeiou]y$/i.test(firstWord)) {
      pastWord =
        `${firstWord.slice(0, -1)}ied`;
    } else if (
      /[aeiou][^aeiouwxy]$/i.test(firstWord)
    ) {
      pastWord =
        `${firstWord}${firstWord.at(-1)}ed`;
    } else {
      pastWord = `${firstWord}ed`;
    }
  }

  if (/^[A-Z]/.test(firstWord)) {
    pastWord =
      pastWord.charAt(0).toUpperCase() +
      pastWord.slice(1);
  }

  return `${pastWord}${remainder}`;
}

function buildNatalPlanetParagraph(event, response) {
  const planetEntries = Object.entries(
    response.natalPlanets || {}
  );

  if (planetEntries.length === 0) return "";

  const eventLanguage =
    planetEventLanguage[event.id] || {};

  const selectedFocuses = [
    houseNarrativeFocus[response.houses.sun],
    houseNarrativeFocus[response.houses.moon],
    houseNarrativeFocus[response.houses.rising]
  ].filter(Boolean);

  const focusLanguage =
    joinNaturally([...new Set(selectedFocuses)]);

  const planetParagraphs = planetEntries.map(
    ([planet, qualities]) => {
      const planetLanguage =
        eventLanguage[planet];

      if (!planetLanguage) {
        const selectedQualities =
          joinNaturally(
            qualities.map(quality =>
              quality.toLowerCase()
            )
          );

        return `Your natal ${planet} in ${
          event.eventSign
        } brings ${selectedQualities} qualities into this chapter.`;
      }

      const synthesis =
        planetLanguage.synthesis;

      if (synthesis) {
        const qualityLanguage =
          joinNaturally(
            qualities.map(quality =>
              quality.toLowerCase()
            )
          );

        const movements = qualities
          .map(
            quality =>
              synthesis.qualityMovements?.[quality]
          )
          .filter(Boolean);

        const movementLanguage =
          movements.length === 2
            ? `${movements[0]}, while ${movements[1]}`
            : joinNaturally(movements);

        const synthesisTemplate =
          qualities.length === 1
            ? synthesis.oneQuality
            : synthesis.multipleQualities;

        const synthesisSentence = fillTemplate(
          synthesisTemplate,
          {
            qualities: qualityLanguage,
            movements: movementLanguage
          }
        );

        const integrationSentence = fillTemplate(
          synthesis.integration,
          { focuses: focusLanguage }
        );

        return [
          planetLanguage.core,
          synthesisSentence,
          integrationSentence
        ].join(" ");
      }

      const qualitySentences = qualities
        .map(
          quality =>
            planetLanguage.qualities?.[quality]
        )
        .filter(Boolean);

      return [
        planetLanguage.core,
        ...qualitySentences
      ].join(" ");
    }
  );

  return planetParagraphs.join("\n\n");
}

function buildSingleHouseStory(event, response) {
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

  const mainStoryParagraph = [
    `${name}, Pluto’s movement through your solar ${ordinalHouse(
      sunHouse
    )} turns your attention toward ${sunFocus}. In this part of your life, greater vitality and meaning may come as you ${sunAction}.`,

    `In your lunar ${ordinalHouse(
      moonHouse
    )}, Pluto’s work becomes more intimate, touching ${moonFocus}. You nurture yourself as you ${moonAction}.`,

    `Through your natal ${ordinalHouse(
      risingHouse
    )}, transformation enters the circumstances through which you meet the world, especially ${risingFocus}. Your life begins to shift as you ${risingAction}.`
  ].join(" ");

  const paragraphs = [mainStoryParagraph];

  const natalPlanetParagraph =
    buildNatalPlanetParagraph(event, response);

  if (natalPlanetParagraph) {
    paragraphs.push(natalPlanetParagraph);
  }

  return paragraphs.join("\n\n");
}

function getTransitionNarrativeLanguage(event) {
  if (event.id === "uranusTaurusGemini") {
    return {
      fromOpening:
        "its disruptive and liberating influence worked through",
      fromMoon:
        "Uranus unsettled familiar patterns around",
      fromRising:
        "reinvention, freedom, and unexpected change reshaped",
      toOpening:
        "experimentation becomes quicker and more mentally active within",
      toMoon:
        "fresh ideas and changing perspectives become more active around",
      toRising:
        "freedom begins to move through communication, curiosity, and new connections within"
    };
  }

  return {
    fromOpening:
      "its dissolving and receptive influence worked through",
    fromMoon:
      "Neptune softened the boundaries around",
    fromRising:
      "faith, release, and uncertainty shaped",
    toOpening:
      "inspiration becomes more embodied within",
    toMoon:
      "inner guidance becomes more active around",
    toRising:
      "faith begins to move through action within"
  };
}

function buildTransitionHouseStory(event, response) {
  const name = storyState.identity.name;
  const language =
    getTransitionNarrativeLanguage(event);

  const fromSunHouse = response.houses.from.sun;
  const fromMoonHouse = response.houses.from.moon;
  const fromRisingHouse = response.houses.from.rising;

  const toSunHouse = response.houses.to.sun;
  const toMoonHouse = response.houses.to.moon;
  const toRisingHouse = response.houses.to.rising;

  const fromSunAction = toPastTensePhrase(
    prepareAnnualAction(
      response.reflections.from.sun,
      event.reflectionPrompts.sun.from
    )
  );

  const fromMoonAction = toPastTensePhrase(
    prepareAnnualAction(
      response.reflections.from.moon,
      event.reflectionPrompts.moon.from
    )
  );

  const fromRisingAction = toPastTensePhrase(
    prepareAnnualAction(
      response.reflections.from.rising,
      event.reflectionPrompts.rising.from
    )
  );

  const toSunAction = prepareAnnualAction(
    response.reflections.to.sun,
    event.reflectionPrompts.sun.to
  );

  const toMoonAction = prepareAnnualAction(
    response.reflections.to.moon,
    event.reflectionPrompts.moon.to
  );

  const toRisingAction = prepareAnnualAction(
    response.reflections.to.rising,
    event.reflectionPrompts.rising.to
  );

  const fromParagraph = [
    `${name}, while ${event.planetName} moved through ${event.fromSign} and your solar ${ordinalHouse(
      fromSunHouse
    )}, ${language.fromOpening} ${houseNarrativeFocus[fromSunHouse] || "this area of your life"}. You found greater vitality or meaning as you ${fromSunAction}.`,

    `In your lunar ${ordinalHouse(
      fromMoonHouse
    )}, ${language.fromMoon} ${houseNarrativeFocus[fromMoonHouse] || "this area of your inner life"}. You nurtured yourself as you ${fromMoonAction}.`,

    `Through your natal ${ordinalHouse(
      fromRisingHouse
    )}, ${language.fromRising} ${houseNarrativeFocus[fromRisingHouse] || "the circumstances through which you met the world"}. You improved your life circumstances as you ${fromRisingAction}.`
  ].join(" ");

  const toParagraph = [
    `As ${event.planetName} moves into ${event.toSign} and your solar ${ordinalHouse(
      toSunHouse
    )}, ${language.toOpening} ${houseNarrativeFocus[toSunHouse] || "this area of your life"}. Greater vitality and meaning may come as you ${toSunAction}.`,

    `In your lunar ${ordinalHouse(
      toMoonHouse
    )}, ${language.toMoon} ${houseNarrativeFocus[toMoonHouse] || "this area of your inner life"}. You nurture yourself as you ${toMoonAction}.`,

    `Through your natal ${ordinalHouse(
      toRisingHouse
    )}, ${language.toRising} ${houseNarrativeFocus[toRisingHouse] || "the circumstances through which you meet the world"}. Your life circumstances may improve as you ${toRisingAction}.`
  ].join(" ");

  return `${fromParagraph}\n\n${toParagraph}`;
}

export function buildAnnualEventStory(event, response) {
  if (event.type === "transitionHouse") {
    return buildTransitionHouseStory(event, response);
  }

  return buildSingleHouseStory(event, response);
}

function defaultReflectionValue(
  savedValue,
  selectedActivities
) {
  if (savedValue) return savedValue;
  return joinNaturally(selectedActivities || []);
}

function renderReflectionField({
  id,
  heading,
  prompt,
  selectedActivities,
  value
}) {
  const startingValue = defaultReflectionValue(
    value,
    selectedActivities
  );

  return `
    <section style="margin-bottom: 30px;">
      <h3>${escapeHtml(heading)}</h3>
      <p><strong>${escapeHtml(prompt)}</strong></p>
      <p>
        Use the selected phrase as written, or expand it in your own words.
      </p>
      <textarea
        id="${id}"
        rows="5"
        style="width: 100%;"
        placeholder="Use the selected phrase as written, or expand it in your own words."
      >${escapeHtml(startingValue)}</textarea>
    </section>
  `;
}

function renderSingleHouseReflection({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  app.innerHTML = `
    <h2>${escapeHtml(event.reflectionTitle)}</h2>
    <p>${escapeHtml(event.reflectionIntroduction)}</p>

    ${renderReflectionField({
      id: "sunAnnualReflection",
      heading: event.reflectionPrompts.sun.heading,
      prompt: event.reflectionPrompts.sun.prompt,
      selectedActivities: response.activities.sun,
      value: response.reflections.sun
    })}

    ${renderReflectionField({
      id: "moonAnnualReflection",
      heading: event.reflectionPrompts.moon.heading,
      prompt: event.reflectionPrompts.moon.prompt,
      selectedActivities: response.activities.moon,
      value: response.reflections.moon
    })}

    ${renderReflectionField({
      id: "risingAnnualReflection",
      heading: event.reflectionPrompts.rising.heading,
      prompt: event.reflectionPrompts.rising.prompt,
      selectedActivities: response.activities.rising,
      value: response.reflections.rising
    })}

    <p id="annualReflectionError" style="display: none;">
      Please respond to all three prompts before continuing.
    </p>

    <button id="backToAnnualChoices">Back</button>
    <button id="submitAnnualReflection">Continue</button>
  `;

  function saveReflections() {
    response.reflections.sun =
      document.getElementById(
        "sunAnnualReflection"
      ).value.trim();

    response.reflections.moon =
      document.getElementById(
        "moonAnnualReflection"
      ).value.trim();

    response.reflections.rising =
      document.getElementById(
        "risingAnnualReflection"
      ).value.trim();
  }

  wireReflectionButtons({
    event,
    response,
    advanceStory,
    render,
    saveReflections,
    allComplete: () =>
      response.reflections.sun &&
      response.reflections.moon &&
      response.reflections.rising
  });
}

function renderTransitionHouseReflection({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  app.innerHTML = `
    <h2>${escapeHtml(event.reflectionTitle)}</h2>
    <p>${escapeHtml(event.reflectionIntroduction)}</p>

    <section style="margin-bottom: 40px;">
      <h3>
        ${escapeHtml(event.planetName)} in
        ${escapeHtml(event.fromSign)}
      </h3>

      ${renderReflectionField({
        id: "fromSunAnnualReflection",
        heading: "My Sun",
        prompt: event.reflectionPrompts.sun.from,
        selectedActivities: response.activities.from.sun,
        value: response.reflections.from.sun
      })}

      ${renderReflectionField({
        id: "fromMoonAnnualReflection",
        heading: "My Moon",
        prompt: event.reflectionPrompts.moon.from,
        selectedActivities: response.activities.from.moon,
        value: response.reflections.from.moon
      })}

      ${renderReflectionField({
        id: "fromRisingAnnualReflection",
        heading: "My Rising Sign",
        prompt: event.reflectionPrompts.rising.from,
        selectedActivities: response.activities.from.rising,
        value: response.reflections.from.rising
      })}
    </section>

    <section style="margin-bottom: 40px;">
      <h3>
        ${escapeHtml(event.planetName)} in
        ${escapeHtml(event.toSign)}
      </h3>

      ${renderReflectionField({
        id: "toSunAnnualReflection",
        heading: "My Sun",
        prompt: event.reflectionPrompts.sun.to,
        selectedActivities: response.activities.to.sun,
        value: response.reflections.to.sun
      })}

      ${renderReflectionField({
        id: "toMoonAnnualReflection",
        heading: "My Moon",
        prompt: event.reflectionPrompts.moon.to,
        selectedActivities: response.activities.to.moon,
        value: response.reflections.to.moon
      })}

      ${renderReflectionField({
        id: "toRisingAnnualReflection",
        heading: "My Rising Sign",
        prompt: event.reflectionPrompts.rising.to,
        selectedActivities: response.activities.to.rising,
        value: response.reflections.to.rising
      })}
    </section>

    <p id="annualReflectionError" style="display: none;">
      Please respond to all six prompts before continuing.
    </p>

    <button id="backToAnnualChoices">Back</button>
    <button id="submitAnnualReflection">Continue</button>
  `;

  function saveReflections() {
    response.reflections.from.sun =
      document.getElementById(
        "fromSunAnnualReflection"
      ).value.trim();

    response.reflections.from.moon =
      document.getElementById(
        "fromMoonAnnualReflection"
      ).value.trim();

    response.reflections.from.rising =
      document.getElementById(
        "fromRisingAnnualReflection"
      ).value.trim();

    response.reflections.to.sun =
      document.getElementById(
        "toSunAnnualReflection"
      ).value.trim();

    response.reflections.to.moon =
      document.getElementById(
        "toMoonAnnualReflection"
      ).value.trim();

    response.reflections.to.rising =
      document.getElementById(
        "toRisingAnnualReflection"
      ).value.trim();
  }

  wireReflectionButtons({
    event,
    response,
    advanceStory,
    render,
    saveReflections,
    allComplete: () =>
      response.reflections.from.sun &&
      response.reflections.from.moon &&
      response.reflections.from.rising &&
      response.reflections.to.sun &&
      response.reflections.to.moon &&
      response.reflections.to.rising
  });
}

function wireReflectionButtons({
  event,
  response,
  advanceStory,
  render,
  saveReflections,
  allComplete
}) {
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

      if (!allComplete()) {
        document.getElementById(
          "annualReflectionError"
        ).style.display = "block";
        return;
      }

      const narrative =
        buildAnnualEventStory(event, response);

      storyState.outputs.annualEventStories[
        event.id
      ] = {
        title: event.reflectionTitle.replace(
          /^Write\s+/i,
          ""
        ),
        narrative,
        houses: structuredClone(response.houses),
        activities: structuredClone(response.activities),
        natalPlanets: structuredClone(response.natalPlanets),
        reflections: structuredClone(response.reflections)
      };

      advanceStory();
      render();
    });
}

export function renderAnnualEventReflection(options) {
  if (options.event.type === "transitionHouse") {
    renderTransitionHouseReflection(options);
    return;
  }

  renderSingleHouseReflection(options);
}
