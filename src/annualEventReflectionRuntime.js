import { storyState } from "./state.js";
import { houseNarrativeFocus } from "../assets/narratives/houseNarrativeFocus.js";
import { planetEventLanguage } from "../assets/narratives/planetEventLanguage.js";
import {
  natalPlanetCoreThemes,
  transitionNatalPlanetLanguage
} from "../assets/narratives/transitionPlanetEventLanguage.js";
import {
  eclipseNatalPlanetCoreThemes,
  eclipseEventLanguage
} from "../assets/narratives/eclipseEventLanguage.js";
import {
  venusRetrogradeCoreThemes,
  venusRetrogradeLanguage
} from "../assets/narratives/venusRetrogradeLanguage.js";
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

  response = response.replace(
    /\blet go for\b/gi,
    "let go of"
  );

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
    .replace(/\bI’m\b/gi, "you’re")
    .replace(/\bI've\b/gi, "you've")
    .replace(/\bI’ve\b/gi, "you’ve")
    .replace(/\bI'll\b/gi, "you'll")
    .replace(/\bI’ll\b/gi, "you’ll")
    .replace(/\bI'd\b/gi, "you'd")
    .replace(/\bI’d\b/gi, "you’d")
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

  const sentenceReadyPhrases = [
    [
      /^be brave and do something you(?:'|’)ve been procrastinating on$/i,
      "are brave and do something you’ve been procrastinating on"
    ]
  ];

  for (const [pattern, replacement] of sentenceReadyPhrases) {
    if (pattern.test(response)) {
      response = response.replace(
        pattern,
        replacement
      );

      break;
    }
  }

  return lowercaseFirst(response);
}

function preparePresentPerfectAction(value = "") {
  let action = String(value).trim();

  if (!action) {
    return "";
  }

  const sentenceReadyPhrases = [
    [
      /^are brave and do something you(?:'|’)ve been procrastinating on$/i,
      "be brave and do something you’ve been procrastinating on"
    ],
    [
      /^express your creativity:\s*sing, dance, paint, write$/i,
      "express your creativity through singing, dancing, painting, or writing"
    ]
  ];

  for (const [pattern, replacement] of sentenceReadyPhrases) {
    if (pattern.test(action)) {
      action = action.replace(
        pattern,
        replacement
      );

      break;
    }
  }

  return action;
}

function toPastTensePhrase(value = "") {
  let phrase = String(value).trim();

  if (!phrase) return "";

  const authoredPastTensePhrases = [
    ["refresh your look with new clothes, a haircut, or a makeover", "refreshed your look with new clothes, a haircut, or a makeover"],
    ["start a new diet or exercise routine", "started a new diet or exercise routine"],
    ["make a big change, like move to a new home or buy a car", "made a big change, like moved to a new home or bought a car"],
    ["clean out your closets, pantry, garage, etc.", "cleaned out your closets, pantry, garage, etc."],
    ["get your financial stuff in order", "got your financial stuff in order"],
    ["reflect on your talents, resources, and what you earn", "reflected on your talents, resources, and what you earned"],
    ["reflect on what’s important to you, and if you make time for it", "reflected on what was important to you, and whether you made time for it"],
    ["write in your journal daily", "wrote in your journal daily"],
    ["create healthier daily habits", "created healthier daily habits"],
    ["clear out your mail piles, email inbox, or files", "cleared out your mail piles, email inbox, or files"],
    ["clean up your self-talk, social media feed, and information sources", "cleaned up your self-talk, social media feed, and information sources"],
    ["learn a new skill that you’ll use in your daily life", "learned a new skill that you used in your daily life"],
    ["tune up your car", "tuned up your car"],
    ["get in touch with siblings or neighbors", "got in touch with siblings or neighbors"],
    ["spend time with your family", "spent time with your family"],
    ["take care of your yard or property", "took care of your yard or property"],
    ["make peace with your past", "made peace with your past"],
    ["learn about your ancestors", "learned about your ancestors"],
    ["do something that will give you pleasure", "did something that gave you pleasure"],
    ["go to the day spa and relax", "went to the day spa and relaxed"],
    ["go out on a romantic date", "went out on a romantic date"],
    ["express your creativity: sing, dance, paint, write", "expressed your creativity: sang, danced, painted, wrote"],
    ["laugh more", "laughed more"],
    ["roll up your sleeves and tackle something hard", "rolled up your sleeves and tackled something hard"],
    ["be brave and do something you’ve been procrastinating on", "were brave and did something you had been procrastinating on"],
    ["hire someone to help with a project you’ve been stuck on", "hired someone to help with a project you had been stuck on"],
    ["take care of your body: exercise, eat well, and schedule doctor visits", "took care of your body: exercised, ate well, and scheduled doctor visits"],
    ["schedule date night or a couple’s holiday", "scheduled date night or a couple’s holiday"],
    ["go out and mingle with interesting humans", "went out and mingled with interesting humans"],
    ["catch up with a good friend", "caught up with a good friend"],
    ["do shadow work", "did shadow work"],
    ["research something hidden or occult", "researched something hidden or occult"],
    ["update your will or estate plan", "updated your will or estate plan"],
    ["reflect on what you’re investing in and what you’re getting out of it", "reflected on what you were investing in and what you were getting out of it"],
    ["get outside of your comfort zone", "got outside of your comfort zone"],
    ["learn something completely new", "learned something completely new"],
    ["go to a place you’ve never been before", "went to a place you had never been before"],
    ["refresh your assumptions, attitudes, and beliefs", "refreshed your assumptions, attitudes, and beliefs"],
    ["ask for a raise or a promotion", "asked for a raise or a promotion"],
    ["apply for a new job", "applied for a new job"],
    ["update your resume, biography, or social media profiles", "updated your resume, biography, or social media profiles"],
    ["reach out and help a friend", "reached out and helped a friend"],
    ["give your time or treasure to help others", "gave your time or treasure to help others"],
    ["get involved in an organization", "got involved in an organization"],
    ["hang out with friends", "hung out with friends"],
    ["consider your long-term hopes, wishes, and plans", "considered your long-term hopes, wishes, and plans"],
    ["practice self-care", "practiced self-care"],
    ["step back from the world, and rest", "stepped back from the world, and rested"],
    ["keep a dream journal", "kept a dream journal"],
    ["forgive yourself", "forgave yourself"],
  ];

  let changedByAuthoredPhrase = false;

  for (const [presentPhrase, pastPhrase] of authoredPastTensePhrases) {
    const pattern = new RegExp(
      escapeRegExp(presentPhrase),
      "gi"
    );

    const updatedPhrase =
      phrase.replace(pattern, pastPhrase);

    if (updatedPhrase !== phrase) {
      changedByAuthoredPhrase = true;
      phrase = updatedPhrase;
    }
  }

  if (changedByAuthoredPhrase) {
    return phrase;
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


function toEclipseActivityPhrase(value = "") {
  const phrase = String(value).trim();

  const authoredActivityPhrases = new Map([
    [
      "Refresh your look with new clothes, a haircut, or a makeover",
      "refreshing your look with new clothes, a haircut, or a makeover"
    ],
    [
      "Start a new diet or exercise routine",
      "starting a new diet or exercise routine"
    ],
    [
      "Make a big change, like move to a new home or buy a car",
      "making a big change, such as moving to a new home or buying a car"
    ],
    [
      "Clean out your closets, pantry, garage, etc.",
      "cleaning out your closets, pantry, garage, and other spaces"
    ],
    [
      "Get your financial stuff in order",
      "getting your financial matters in order"
    ],
    [
      "Reflect on your talents, resources, and what you earn",
      "reflecting on your talents, resources, and what you earn"
    ],
    [
      "Reflect on what’s important to you, and if you make time for it",
      "reflecting on what is important to you and whether you make time for it"
    ],
    [
      "Write in your journal daily",
      "writing in your journal daily"
    ],
    [
      "Create healthier daily habits",
      "creating healthier daily habits"
    ],
    [
      "Clear out your mail piles, email inbox, or files",
      "clearing out your mail piles, email inbox, or files"
    ],
    [
      "Clean up your self-talk, social media feed, and information sources",
      "cleaning up your self-talk, social media feed, and information sources"
    ],
    [
      "Learn a new skill that you’ll use in your daily life",
      "learning a new skill that you will use in your daily life"
    ],
    [
      "Tune up your car",
      "tuning up your car"
    ],
    [
      "Get in touch with siblings or neighbors",
      "getting in touch with siblings or neighbors"
    ],
    [
      "Spend time with your family",
      "spending time with your family"
    ],
    [
      "Take care of your yard or property",
      "taking care of your yard or property"
    ],
    [
      "Make peace with your past",
      "making peace with your past"
    ],
    [
      "Make peace with my past",
      "making peace with my past"
    ],
    [
      "Learn about your ancestors",
      "learning about your ancestors"
    ],
    [
      "Do something that will give you pleasure",
      "doing something that gives you pleasure"
    ],
    [
      "Go to the day spa and relax",
      "going to the day spa and relaxing"
    ],
    [
      "Go out on a romantic date",
      "going out on a romantic date"
    ],
    [
      "Express your creativity: sing, dance, paint, write",
      "expressing your creativity through singing, dancing, painting, or writing"
    ],
    [
      "Laugh more",
      "laughing more"
    ],
    [
      "Roll up your sleeves and tackle something hard",
      "rolling up your sleeves and tackling something hard"
    ],
    [
      "Be brave and do something you’ve been procrastinating on",
      "being brave and doing something you’ve been procrastinating on"
    ],
    [
      "Hire someone to help with a project you’ve been stuck on",
      "hiring someone to help with a project you’ve been stuck on"
    ],
    [
      "Take care of your body: exercise, eat well, and schedule doctor visits",
      "taking care of your body by exercising, eating well, and scheduling doctor visits"
    ],
    [
      "Schedule date night or a couple’s holiday",
      "scheduling date night or a couple’s holiday"
    ],
    [
      "Go out and mingle with interesting humans",
      "going out and mingling with interesting people"
    ],
    [
      "Catch up with a good friend",
      "catching up with a good friend"
    ],
    [
      "Do shadow work",
      "doing shadow work"
    ],
    [
      "Research something hidden or occult",
      "researching something hidden or occult"
    ],
    [
      "Update your will or estate plan",
      "updating your will or estate plan"
    ],
    [
      "Reflect on what you’re investing in and what you’re getting out of it",
      "reflecting on what you’re investing in and what you’re getting out of it"
    ],
    [
      "Reflect on what I’m investing in and what I’m getting out of it",
      "reflecting on what I’m investing in and what I’m getting out of it"
    ],
    [
      "Get outside of your comfort zone",
      "getting outside of your comfort zone"
    ],
    [
      "Learn something completely new",
      "learning something completely new"
    ],
    [
      "Go to a place you’ve never been before",
      "going to a place you’ve never been before"
    ],
    [
      "Refresh your assumptions, attitudes, and beliefs",
      "refreshing your assumptions, attitudes, and beliefs"
    ],
    [
      "Ask for a raise or a promotion",
      "asking for a raise or a promotion"
    ],
    [
      "Apply for a new job",
      "applying for a new job"
    ],
    [
      "Update your resume, biography, or social media profiles",
      "updating your resume, biography, or social media profiles"
    ],
    [
      "Reach out and help a friend",
      "reaching out and helping a friend"
    ],
    [
      "Give your time or treasure to help others",
      "giving your time or treasure to help others"
    ],
    [
      "Get involved in an organization",
      "getting involved in an organization"
    ],
    [
      "Hang out with friends",
      "spending time with friends"
    ],
    [
      "Consider your long-term hopes, wishes, and plans",
      "considering your long-term hopes, wishes, and plans"
    ],
    [
      "Practice self-care",
      "practicing self-care"
    ],
    [
      "Step back from the world, and rest",
      "stepping back from the world and resting"
    ],
    [
      "Keep a dream journal",
      "keeping a dream journal"
    ],
    [
      "Forgive yourself",
      "forgiving yourself"
    ]
  ]);

  if (authoredActivityPhrases.has(phrase)) {
    return authoredActivityPhrases.get(phrase);
  }

  const normalizedPhrase =
    phrase.toLowerCase();

  for (
    const [source, replacement]
    of authoredActivityPhrases.entries()
  ) {
    if (
      source.toLowerCase() ===
      normalizedPhrase
    ) {
      return replacement;
    }
  }

  const additionalPhraseForms = [
    [
      /^are brave and do something you(?:'|’)ve been procrastinating on$/i,
      "being brave and doing something you’ve been procrastinating on"
    ],
    [
      /^forgive yourself$/i,
      "forgiving yourself"
    ],
    [
      /^refresh your assumptions, attitudes, and beliefs$/i,
      "refreshing your assumptions, attitudes, and beliefs"
    ],
    [
      /^schedule date night or a couple(?:'|’)s holiday$/i,
      "scheduling date night or a couple’s holiday"
    ],
    [
      /^refresh your look with new clothes, a haircut, or a makeover$/i,
      "refreshing your look with new clothes, a haircut, or a makeover"
    ],
    [
      /^update your resume, biography, or social media profiles$/i,
      "updating your resume, biography, or social media profiles"
    ],
    [
      /^update your résumé, biography, or social media profiles$/i,
      "updating your résumé, biography, or social media profiles"
    ]
  ];

  for (
    const [pattern, replacement]
    of additionalPhraseForms
  ) {
    if (pattern.test(phrase)) {
      return replacement;
    }
  }

  return lowercaseFirst(phrase);
}

function joinEclipseActivities(activities = []) {
  return joinNaturally(
    activities.map(toEclipseActivityPhrase)
  );
}

function buildVenusRetrogradeNatalParagraphs({
  event,
  response,
  side
}) {
  const selectedPlanets =
    response.natalPlanets?.[side] || {};

  const entries =
    Object.entries(selectedPlanets);

  if (entries.length === 0) {
    return "";
  }

  const sideLanguage =
    venusRetrogradeLanguage[side];

  const sign =
    side === "from"
      ? event.fromSign
      : event.toSign;

  const paragraphs = entries.map(
    ([planet, qualities]) => {
      const coreThemes =
        venusRetrogradeCoreThemes[planet] ||
        "its characteristic needs and functions";

      const qualityLanguage =
        joinNaturally(
          qualities.map(quality =>
            quality.toLowerCase()
          )
        );

      const qualityPhrase =
        qualities.length === 1
          ? `The selected quality, ${qualityLanguage}, suggests`
          : `Taken together, the selected qualities — ${qualityLanguage} — suggest`;

      const movement =
        sideLanguage.movements[planet] ||
        "reconsidering how this part of life relates to desire, value, and relationship";

      return [
        `Your natal ${planet} in ${sign} places ${coreThemes} inside ${sideLanguage.field}.`,
        `${qualityPhrase} that this retrograde may work through ${movement}.`
      ].join(" ");
    }
  );

  if (entries.length === 1) {
    return [
      paragraphs[0],
      sideLanguage.integration
    ].join(" ");
  }

  return [
    sideLanguage.groupIntroduction,
    ...paragraphs,
    sideLanguage.groupIntegration
  ]
    .filter(Boolean)
    .join("\n\n");
}

function normalizeVenusRetrogradeAction(value = "") {
  const phrase = String(value).trim();

  if (!phrase) {
    return "";
  }

  const normalized =
    typeof toEclipseActivityPhrase === "function"
      ? toEclipseActivityPhrase(phrase)
      : lowercaseFirst(phrase);

  return normalized;
}

function buildVenusRetrogradeStory(event, response) {
  const name = storyState.identity.name;

  const fromSunAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.from.sun,
        event.reflectionPrompts.sun.from
      )
    );

  const fromMoonAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.from.moon,
        event.reflectionPrompts.moon.from
      )
    );

  const fromRisingAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.from.rising,
        event.reflectionPrompts.rising.from
      )
    );

  const toSunAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.to.sun,
        event.reflectionPrompts.sun.to
      )
    );

  const toMoonAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.to.moon,
        event.reflectionPrompts.moon.to
      )
    );

  const toRisingAction =
    normalizeVenusRetrogradeAction(
      prepareAnnualAction(
        response.reflections.to.rising,
        event.reflectionPrompts.rising.to
      )
    );

  const fromSunHouse =
    response.houses.from.sun;
  const fromMoonHouse =
    response.houses.from.moon;
  const fromRisingHouse =
    response.houses.from.rising;

  const toSunHouse =
    response.houses.to.sun;
  const toMoonHouse =
    response.houses.to.moon;
  const toRisingHouse =
    response.houses.to.rising;

  const scorpioParagraph = [
    `${name}, while Venus retrogrades through Scorpio and your solar ${ordinalHouse(
      fromSunHouse
    )}, desire, value, and attraction are reviewed within ${houseNarrativeFocus[fromSunHouse] || "this area of your life"}. You may find greater vitality as you review or let go of ${fromSunAction}.`,
    `In your lunar ${ordinalHouse(
      fromMoonHouse
    )}, Venus exposes emotional attachments and deeper needs around ${houseNarrativeFocus[fromMoonHouse] || "this area of your emotional life"}. You nurture yourself as you review or release ${fromMoonAction}.`,
    `Through your natal ${ordinalHouse(
      fromRisingHouse
    )}, intimacy, vulnerability, and power invite reconsideration within ${houseNarrativeFocus[fromRisingHouse] || "the circumstances through which you meet the world"}. Your life circumstances may improve by reviewing or releasing ${fromRisingAction}.`
  ].join(" ");

  const libraParagraph = [
    `As Venus backtracks into Libra and your solar ${ordinalHouse(
      toSunHouse
    )}, the review turns toward balance, fairness, and reciprocity within ${houseNarrativeFocus[toSunHouse] || "this area of your life"}. You may find greater vitality as you review or let go of ${toSunAction}.`,
    `In your lunar ${ordinalHouse(
      toMoonHouse
    )}, Venus revisits agreements, boundaries, and emotional reciprocity around ${houseNarrativeFocus[toMoonHouse] || "this area of your emotional life"}. You nurture yourself as you review or release ${toMoonAction}.`,
    `Through your natal ${ordinalHouse(
      toRisingHouse
    )}, relationships and unspoken rules invite reassessment within ${houseNarrativeFocus[toRisingHouse] || "the circumstances through which you meet the world"}. Your life circumstances may improve as you review or release ${toRisingAction}.`
  ].join(" ");

  const scorpioNatal =
    buildVenusRetrogradeNatalParagraphs({
      event,
      response,
      side: "from"
    });

  const libraNatal =
    buildVenusRetrogradeNatalParagraphs({
      event,
      response,
      side: "to"
    });

  return [
    scorpioParagraph,
    scorpioNatal,
    libraParagraph,
    libraNatal
  ]
    .filter(Boolean)
    .join("\n\n");
}

function renderVenusRetrogradeReflection({
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
      <h3>Venus in ${escapeHtml(event.fromSign)}</h3>

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
      <h3>Venus in ${escapeHtml(event.toSign)}</h3>

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
        response.reflections.from.sun &&
        response.reflections.from.moon &&
        response.reflections.from.rising &&
        response.reflections.to.sun &&
        response.reflections.to.moon &&
        response.reflections.to.rising;

      if (!allComplete) {
        document.getElementById(
          "annualReflectionError"
        ).style.display = "block";
        return;
      }

      const narrative =
        buildVenusRetrogradeStory(
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
        houses: structuredClone(
          response.houses
        ),
        activities: structuredClone(
          response.activities
        ),
        natalPlanets: structuredClone(
          response.natalPlanets
        ),
        reflections: structuredClone(
          response.reflections
        )
      };

      advanceStory();
      render();
    });
}

function buildEclipseNatalPlanetParagraphs({
  event,
  response,
  side
}) {
  const selectedPlanets =
    response.natalPlanets?.[side] || {};

  const entries =
    Object.entries(selectedPlanets);

  if (entries.length === 0) {
    return "";
  }

  const sideLanguage =
    eclipseEventLanguage[event.id]?.[side];

  if (!sideLanguage) {
    return "";
  }

  const sign =
    side === "from"
      ? event.fromSign
      : event.toSign;

  const paragraphs = entries.map(
    ([planet, qualities]) => {
      const coreThemes =
        eclipseNatalPlanetCoreThemes[planet] ||
        "its characteristic needs and functions";

      const qualityLanguage =
        joinNaturally(
          qualities.map(quality =>
            quality.toLowerCase()
          )
        );

      const qualityPhrase =
        qualities.length === 1
          ? `The selected quality, ${qualityLanguage}, suggests`
          : `Taken together, the selected qualities — ${qualityLanguage} — suggest`;

      const movement =
        sideLanguage.movements[planet] ||
        "responding to the changes and revelations carried by this eclipse";

      return [
        `Your natal ${planet} in ${sign} places ${coreThemes} inside ${sideLanguage.field}.`,
        `${qualityPhrase} that this eclipse may work through ${movement}.`
      ].join(" ");
    }
  );

  if (entries.length === 1) {
    return [
      paragraphs[0],
      sideLanguage.integration
    ].join(" ");
  }

  return [
    sideLanguage.groupIntroduction,
    ...paragraphs,
    sideLanguage.groupIntegration
  ]
    .filter(Boolean)
    .join("\n\n");
}

function defaultEclipseReflectionValue({
  promptKey,
  event,
  response
}) {
  const releaseActivities =
    response.activities[event.releaseSide][
      promptKey
    ] || [];

  const emergingActivities =
    response.activities[event.emergingSide][
      promptKey
    ] || [];

  const releaseLanguage =
    joinEclipseActivities(
      releaseActivities
    );

  const emergingLanguage =
    joinEclipseActivities(
      emergingActivities
    );

  if (!releaseLanguage && !emergingLanguage) {
    return "";
  }

  if (promptKey === "moon") {
    return `release ${lowercaseFirst(
      releaseLanguage
    )} and embrace ${lowercaseFirst(
      emergingLanguage
    )}`;
  }

  if (promptKey === "rising") {
    return `move past ${lowercaseFirst(
      releaseLanguage
    )} and move toward ${lowercaseFirst(
      emergingLanguage
    )}`;
  }

  return `let go of ${lowercaseFirst(
    releaseLanguage
  )} and turn toward ${lowercaseFirst(
    emergingLanguage
  )}`;
}

function selectedEclipseReferenceItems({
  promptKey,
  event,
  response
}) {
  const releaseActivities =
    response.activities[event.releaseSide][
      promptKey
    ] || [];

  const emergingActivities =
    response.activities[event.emergingSide][
      promptKey
    ] || [];

  const releaseLanguage =
    joinEclipseActivities(
      releaseActivities
    );

  const emergingLanguage =
    joinEclipseActivities(
      emergingActivities
    );

  if (promptKey === "moon") {
    return [
      releaseLanguage && `Release: ${releaseLanguage}`,
      emergingLanguage && `Embrace: ${emergingLanguage}`
    ].filter(Boolean);
  }

  if (promptKey === "rising") {
    return [
      releaseLanguage && `Move past: ${releaseLanguage}`,
      emergingLanguage && `Move toward: ${emergingLanguage}`
    ].filter(Boolean);
  }

  return [
    releaseLanguage && `Let go of: ${releaseLanguage}`,
    emergingLanguage && `Turn toward: ${emergingLanguage}`
  ].filter(Boolean);
}

function normalizeEclipsePairedReflection(value = "") {
  const phrase = String(value).trim();

  const patterns = [
    {
      pattern:
        /^let go of\s+(.+?)\s+and turn toward\s+(.+)$/i,
      build: (release, emerging) =>
        `let go of ${toEclipseActivityPhrase(
          release
        )} and turn toward ${toEclipseActivityPhrase(
          emerging
        )}`
    },
    {
      pattern:
        /^release\s+(.+?)\s+and embrace\s+(.+)$/i,
      build: (release, emerging) =>
        `release ${toEclipseActivityPhrase(
          release
        )} and embrace ${toEclipseActivityPhrase(
          emerging
        )}`
    },
    {
      pattern:
        /^move past\s+(.+?)\s+and move toward\s+(.+)$/i,
      build: (release, emerging) =>
        `move past ${toEclipseActivityPhrase(
          release
        )} and move toward ${toEclipseActivityPhrase(
          emerging
        )}`
    }
  ];

  for (const { pattern, build } of patterns) {
    const match = phrase.match(pattern);

    if (match) {
      return build(
        match[1].trim(),
        match[2].trim()
      );
    }
  }

  return phrase;
}

function buildEclipseStory(event, response) {
  const name = storyState.identity.name;

  const sunAction =
    normalizeEclipsePairedReflection(
      prepareAnnualAction(
        response.reflections.sun,
        event.reflectionPrompts.sun.prompt
      )
    );

  const moonAction =
    normalizeEclipsePairedReflection(
      prepareAnnualAction(
        response.reflections.moon,
        event.reflectionPrompts.moon.prompt
      )
    );

  const risingAction =
    normalizeEclipsePairedReflection(
      prepareAnnualAction(
        response.reflections.rising,
        event.reflectionPrompts.rising.prompt
      )
    );

  const solarSunHouse =
    response.houses.from.sun;
  const lunarSunHouse =
    response.houses.to.sun;
  const solarMoonHouse =
    response.houses.from.moon;
  const lunarMoonHouse =
    response.houses.to.moon;
  const solarRisingHouse =
    response.houses.from.rising;
  const lunarRisingHouse =
    response.houses.to.rising;

  const mainParagraph = [
    `${name}, the ${event.fromLabel} activates your solar ${ordinalHouse(
      solarSunHouse
    )}, bringing accelerated change to ${houseNarrativeFocus[solarSunHouse] || "this area of your life"}, while the ${event.toLabel} activates your solar ${ordinalHouse(
      lunarSunHouse
    )}, illuminating ${houseNarrativeFocus[lunarSunHouse] || "another area of your life"}. You may find greater vitality or meaning when you ${sunAction}.`,

    `Through your Moon, the solar eclipse moves through your lunar ${ordinalHouse(
      solarMoonHouse
    )}, touching ${houseNarrativeFocus[solarMoonHouse] || "this area of your emotional life"}, while the lunar eclipse moves through your lunar ${ordinalHouse(
      lunarMoonHouse
    )}, clarifying ${houseNarrativeFocus[lunarMoonHouse] || "another area of your emotional life"}. You nurture yourself when you ${moonAction}.`,

    `Through your Rising Sign, the solar eclipse activates your natal ${ordinalHouse(
      solarRisingHouse
    )}, reshaping ${houseNarrativeFocus[solarRisingHouse] || "the circumstances through which you meet the world"}, while the lunar eclipse activates your natal ${ordinalHouse(
      lunarRisingHouse
    )}, realigning ${houseNarrativeFocus[lunarRisingHouse] || "another part of your lived experience"}. Your life circumstances may improve when you ${risingAction}.`
  ].join(" ");

  const solarNatal =
    buildEclipseNatalPlanetParagraphs({
      event,
      response,
      side: "from"
    });

  const lunarNatal =
    buildEclipseNatalPlanetParagraphs({
      event,
      response,
      side: "to"
    });

  return [
    mainParagraph,
    solarNatal,
    lunarNatal
  ]
    .filter(Boolean)
    .join("\n\n");
}

function renderEclipsePairReflection({
  app,
  event,
  response,
  advanceStory,
  render
}) {
  const fields = [
    {
      key: "sun",
      id: "sunAnnualReflection"
    },
    {
      key: "moon",
      id: "moonAnnualReflection"
    },
    {
      key: "rising",
      id: "risingAnnualReflection"
    }
  ];

  const fieldHtml = fields
    .map(({ key, id }) => {
      const prompt =
        event.reflectionPrompts[key];

      const value =
        response.reflections[key] ||
        defaultEclipseReflectionValue({
          promptKey: key,
          event,
          response
        });

      return renderReflectionField({
        id,
        heading: prompt.heading,
        prompt: prompt.prompt,
        selectedActivities: selectedEclipseReferenceItems({
          promptKey: key,
          event,
          response
        }),
        value
      });
    })
    .join("");

  app.innerHTML = `
    <h2>${escapeHtml(event.reflectionTitle)}</h2>
    <p>${escapeHtml(event.reflectionIntroduction)}</p>

    ${fieldHtml}

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

      const narrative =
        buildEclipseStory(event, response);

      storyState.outputs.annualEventStories[
        event.id
      ] = {
        title: event.reflectionTitle.replace(
          /^Write\s+/i,
          ""
        ),
        narrative,
        houses: structuredClone(
          response.houses
        ),
        activities: structuredClone(
          response.activities
        ),
        natalPlanets: structuredClone(
          response.natalPlanets
        ),
        reflections: structuredClone(
          response.reflections
        )
      };

      advanceStory();
      render();
    });
}

function buildTransitionNatalPlanetParagraphs({
  event,
  response,
  side
}) {
  const selectedPlanets =
    response.natalPlanets?.[side] || {};

  const entries =
    Object.entries(selectedPlanets);

  if (entries.length === 0) {
    return "";
  }

  const sideLanguage =
    transitionNatalPlanetLanguage[
      event.id
    ]?.[side];

  if (!sideLanguage) {
    return "";
  }

  const sign =
    side === "from"
      ? event.fromSign
      : event.toSign;

  const isPast =
    side === "from";

  const planetParagraphs = entries.map(
    ([planet, qualities]) => {
      const coreThemes =
        natalPlanetCoreThemes[planet] ||
        "its characteristic needs and functions";

      const movement =
        sideLanguage.movements[planet] ||
        "responding to the changes unfolding through this planetary chapter";

      const qualityLanguage =
        joinNaturally(
          qualities.map(quality =>
            quality.toLowerCase()
          )
        );

      const qualityPhrase =
        qualities.length === 1
          ? `The selected quality, ${qualityLanguage},`
          : `Taken together, the selected qualities — ${qualityLanguage} —`;

      const placementVerb =
        isPast
          ? "placed"
          : "places";

      const chapterVerb =
        isPast
          ? "suggests that this part of the story may have worked through"
          : "suggests that this part of the story may work through";

      return [
        `Your natal ${planet} in ${sign} ${placementVerb} ${coreThemes} inside ${sideLanguage.field}.`,
        `${qualityPhrase} ${chapterVerb} ${movement}.`
      ].join(" ");
    }
  );

  if (entries.length === 1) {
    return [
      planetParagraphs[0],
      sideLanguage.integration
    ].join(" ");
  }

  return [
    sideLanguage.groupIntroduction,
    ...planetParagraphs,
    sideLanguage.groupIntegration
  ]
    .filter(Boolean)
    .join("\n\n");
}


function renderSelectedTransitionPlanets({
  event,
  response,
  side
}) {
  const selectedPlanets =
    response.natalPlanets?.[side] || {};

  const entries =
    Object.entries(selectedPlanets);

  if (entries.length === 0) {
    return "";
  }

  const sign =
    side === "from"
      ? event.fromSign
      : event.toSign;

  const items = entries
    .map(
      ([planet, qualities]) => `
        <li>
          <strong>${escapeHtml(planet)}:</strong>
          ${escapeHtml(qualities.join(", "))}
        </li>
      `
    )
    .join("");

  return `
    <section style="margin-bottom: 30px;">
      <h4>
        Natal planets in ${escapeHtml(sign)}
      </h4>
      <ul>${items}</ul>
    </section>
  `;
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
  if (event.id === "saturnPiscesAries") {
    return {
      fromOpening:
        "its patient and reality-testing influence has worked through",
      fromMoon:
        "Saturn has asked for emotional steadiness and mature care around",
      fromRising:
        "discipline, responsibility, and inner stability have shaped",
      toOpening:
        "responsibility, initiative, and embodied authority become more active within",
      toMoon:
        "emotional courage, self-command, and direct responsibility become more active around",
      toRising:
        "long-term effort begins to move through initiative, leadership, and decisive action within"
    };
  }

  if (event.id === "jupiterCancerLeo") {
    return {
      fromOpening:
        "its nourishing and expansive influence works through",
      fromMoon:
        "Jupiter encourages emotional growth and greater confidence around",
      fromRising:
        "growth, opportunity, and a stronger sense of possibility support",
      toOpening:
        "confidence, visibility, and creative expansion become more active within",
      toMoon:
        "joy, self-expression, and emotional generosity become more active around",
      toRising:
        "growth begins to move through visibility, creativity, and a greater willingness to take up space within"
    };
  }

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

  const preparedFromSunAction =
    prepareAnnualAction(
      response.reflections.from.sun,
      event.reflectionPrompts.sun.from
    );

  const preparedFromMoonAction =
    prepareAnnualAction(
      response.reflections.from.moon,
      event.reflectionPrompts.moon.from
    );

  const preparedFromRisingAction =
    prepareAnnualAction(
      response.reflections.from.rising,
      event.reflectionPrompts.rising.from
    );

  const useBaseFromAction =
    event.fromTense === "present" ||
    event.fromTense === "presentPerfect";

  const fromSunAction =
    useBaseFromAction
      ? preparedFromSunAction
      : toPastTensePhrase(preparedFromSunAction);

  const fromMoonAction =
    useBaseFromAction
      ? preparedFromMoonAction
      : toPastTensePhrase(preparedFromMoonAction);

  const fromRisingAction =
    useBaseFromAction
      ? preparedFromRisingAction
      : toPastTensePhrase(preparedFromRisingAction);

  const presentPerfectSunAction =
    preparePresentPerfectAction(
      fromSunAction
    );

  const presentPerfectMoonAction =
    preparePresentPerfectAction(
      fromMoonAction
    );

  const presentPerfectRisingAction =
    preparePresentPerfectAction(
      fromRisingAction
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

  const fromIsPresent =
    event.fromTense === "present";

  const fromIsPresentPerfect =
    event.fromTense === "presentPerfect";

  let fromParagraph;

  if (fromIsPresentPerfect) {
    fromParagraph = [
      `${name}, while ${event.planetName} has been in ${event.fromSign} and your solar ${ordinalHouse(
        fromSunHouse
      )}, ${language.fromOpening} ${houseNarrativeFocus[fromSunHouse] || "this area of your life"}. You have found greater vitality or meaning as you have worked to ${presentPerfectSunAction}.`,

      `In your lunar ${ordinalHouse(
        fromMoonHouse
      )}, ${language.fromMoon} ${houseNarrativeFocus[fromMoonHouse] || "this area of your inner life"}. You have nurtured yourself as you have worked to ${presentPerfectMoonAction}.`,

      `Through your natal ${ordinalHouse(
        fromRisingHouse
      )}, ${language.fromRising} ${houseNarrativeFocus[fromRisingHouse] || "the circumstances through which you met the world"}. You have improved your life circumstances as you have worked to ${presentPerfectRisingAction}.`
    ].join(" ");
  } else {
    const fromPlanetVerb =
      fromIsPresent
        ? "moves"
        : "moved";

    const vitalityVerb =
      fromIsPresent
        ? "may find"
        : "found";

    const nurtureVerb =
      fromIsPresent
        ? "nurture"
        : "nurtured";

    const circumstancesVerb =
      fromIsPresent
        ? "may improve"
        : "improved";

    fromParagraph = [
      `${name}, while ${event.planetName} ${fromPlanetVerb} through ${event.fromSign} and your solar ${ordinalHouse(
        fromSunHouse
      )}, ${language.fromOpening} ${houseNarrativeFocus[fromSunHouse] || "this area of your life"}. You ${vitalityVerb} greater vitality or meaning as you ${fromSunAction}.`,

      `In your lunar ${ordinalHouse(
        fromMoonHouse
      )}, ${language.fromMoon} ${houseNarrativeFocus[fromMoonHouse] || "this area of your inner life"}. You ${nurtureVerb} yourself as you ${fromMoonAction}.`,

      `Through your natal ${ordinalHouse(
        fromRisingHouse
      )}, ${language.fromRising} ${houseNarrativeFocus[fromRisingHouse] || "the circumstances through which you met the world"}. You ${circumstancesVerb} your life circumstances as you ${fromRisingAction}.`
    ].join(" ");
  }

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

  const fromNatalParagraphs =
    buildTransitionNatalPlanetParagraphs({
      event,
      response,
      side: "from"
    });

  const toNatalParagraphs =
    buildTransitionNatalPlanetParagraphs({
      event,
      response,
      side: "to"
    });

  return [
    fromParagraph,
    fromNatalParagraphs,
    toParagraph,
    toNatalParagraphs
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function buildAnnualEventStory(event, response) {
  if (event.type === "retrogradePair") {
    return buildVenusRetrogradeStory(
      event,
      response
    );
  }

  if (event.type === "eclipsePair") {
    return buildEclipseStory(event, response);
  }

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

  if (storyState.storyMode === "reflection") {
    return "";
  }

  return joinNaturally(selectedActivities || []);
}

function renderSelectedReferenceList(selectedActivities = []) {
  const items = (selectedActivities || [])
    .filter(Boolean)
    .map(
      (activity) =>
        `<li>${escapeHtml(activity)}</li>`
    )
    .join("");

  if (!items || storyState.storyMode !== "reflection") {
    return "";
  }

  return `
    <div style="
      border-left: 3px solid #b8a16a;
      margin: 14px 0 18px;
      padding: 10px 14px;
      background: rgba(184, 161, 106, 0.08);
    ">
      <p style="margin-top: 0;">
        <strong>Your selected focus:</strong>
      </p>
      <ul style="margin-bottom: 0;">
        ${items}
      </ul>
    </div>
  `;
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

  const isReflectionMode =
    storyState.storyMode === "reflection";

  const guidance = isReflectionMode
    ? "Review your selected focus, then write your own response."
    : "Use the selected phrase as written, or expand it in your own words.";

  return `
    <section style="margin-bottom: 30px;">
      <h3>${escapeHtml(heading)}</h3>
      <p><strong>${escapeHtml(prompt)}</strong></p>
      ${renderSelectedReferenceList(selectedActivities)}
      <p>${escapeHtml(guidance)}</p>
      <textarea
        id="${id}"
        rows="5"
        style="width: 100%;"
        placeholder="${escapeHtml(guidance)}"
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

      ${renderSelectedTransitionPlanets({
        event,
        response,
        side: "from"
      })}

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

      ${renderSelectedTransitionPlanets({
        event,
        response,
        side: "to"
      })}

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
  if (options.event.type === "retrogradePair") {
    renderVenusRetrogradeReflection(
      options
    );
    return;
  }

  if (options.event.type === "eclipsePair") {
    renderEclipsePairReflection(options);
    return;
  }

  if (options.event.type === "transitionHouse") {
    renderTransitionHouseReflection(options);
    return;
  }

  renderSingleHouseReflection(options);
}