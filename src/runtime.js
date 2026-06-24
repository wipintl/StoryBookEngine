import { getCurrentAnchor, advanceStory } from "./engine.js";
import { storyState } from "./state.js";
import { zodiacKeywords } from "../assets/keywords/zodiacKeywords.js";
import {
  characterSketchLanguage,
  signElements
} from "../assets/narratives/characterSketchLanguage.js";
import { renderAnnualEventAnchor } from "./annualEventRuntime.js";
import { renderFinalSectionsAnchor } from "./finalSectionsRuntime.js";

const app = document.getElementById("app");
const nextButton = document.getElementById("nextButton");
const titleAttribution =
  document.getElementById("titleAttribution");

function loadDevelopmentCheckpoint() {
  const params = new URLSearchParams(
    window.location.search
  );

  const checkpoint = params.get("test");

  if (params.get("mode") === "reflection") {
    storyState.storyMode = "reflection";
  }

  const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const isPrintFullCheckpoint =
    checkpoint === "print-full";

  if (
    !isLocalDevelopment &&
    !isPrintFullCheckpoint
  ) {
    return;
  }

  const baseCompletedAnchors = [
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
  ];

  const annualAnchorSequence = [
    "annualEventScene",
    "annualEventContext",
    "annualEventChoices",
    "annualEventReflection",
    "annualEventComplete"
  ];

  function completedThroughEvent(eventIndex) {
    const completed = [
      ...baseCompletedAnchors
    ];

    for (
      let index = 0;
      index < eventIndex;
      index += 1
    ) {
      completed.push(
        ...annualAnchorSequence
      );
    }

    return completed;
  }

  function createCheckpoint(
    currentEventIndex,
    currentAnchorId
  ) {
    const completedAnchors =
      completedThroughEvent(
        currentEventIndex
      );

    const anchorIndex =
      annualAnchorSequence.indexOf(
        currentAnchorId
      );

    if (anchorIndex > 0) {
      completedAnchors.push(
        ...annualAnchorSequence.slice(
          0,
          anchorIndex
        )
      );
    }

    return {
      currentAnchorId,
      currentEventIndex,
      completedAnchors
    };
  }

  const checkpointAnchors = {
    pluto:
      createCheckpoint(
        0,
        "annualEventScene"
      ),

    "pluto-context":
      createCheckpoint(
        0,
        "annualEventContext"
      ),

    "pluto-choices":
      createCheckpoint(
        0,
        "annualEventChoices"
      ),

    "pluto-story":
      createCheckpoint(
        0,
        "annualEventReflection"
      ),

    neptune:
      createCheckpoint(
        1,
        "annualEventScene"
      ),

    "neptune-context":
      createCheckpoint(
        1,
        "annualEventContext"
      ),

    "neptune-choices":
      createCheckpoint(
        1,
        "annualEventChoices"
      ),

    "neptune-story":
      createCheckpoint(
        1,
        "annualEventReflection"
      ),

    uranus:
      createCheckpoint(
        2,
        "annualEventScene"
      ),

    "uranus-context":
      createCheckpoint(
        2,
        "annualEventContext"
      ),

    "uranus-choices":
      createCheckpoint(
        2,
        "annualEventChoices"
      ),

    "uranus-story":
      createCheckpoint(
        2,
        "annualEventReflection"
      ),

    jupiter:
      createCheckpoint(
        3,
        "annualEventScene"
      ),

    "jupiter-context":
      createCheckpoint(
        3,
        "annualEventContext"
      ),

    "jupiter-choices":
      createCheckpoint(
        3,
        "annualEventChoices"
      ),

    "jupiter-story":
      createCheckpoint(
        3,
        "annualEventReflection"
      ),

    saturn:
      createCheckpoint(
        4,
        "annualEventScene"
      ),

    "saturn-context":
      createCheckpoint(
        4,
        "annualEventContext"
      ),

    "saturn-choices":
      createCheckpoint(
        4,
        "annualEventChoices"
      ),

    "saturn-story":
      createCheckpoint(
        4,
        "annualEventReflection"
      ),

    "eclipse-1":
      createCheckpoint(
        5,
        "annualEventScene"
      ),

    "eclipse-1-context":
      createCheckpoint(
        5,
        "annualEventContext"
      ),

    "eclipse-1-choices":
      createCheckpoint(
        5,
        "annualEventChoices"
      ),

    "eclipse-1-story":
      createCheckpoint(
        5,
        "annualEventReflection"
      ),

    "eclipse-2":
      createCheckpoint(
        6,
        "annualEventScene"
      ),

    "eclipse-2-context":
      createCheckpoint(
        6,
        "annualEventContext"
      ),

    "eclipse-2-choices":
      createCheckpoint(
        6,
        "annualEventChoices"
      ),

    "eclipse-2-story":
      createCheckpoint(
        6,
        "annualEventReflection"
      ),

    venus:
      createCheckpoint(
        7,
        "annualEventScene"
      ),

    "venus-context":
      createCheckpoint(
        7,
        "annualEventContext"
      ),

    "venus-choices":
      createCheckpoint(
        7,
        "annualEventChoices"
      ),

    "venus-story":
      createCheckpoint(
        7,
        "annualEventReflection"
      ),

    "year-story": {
      currentAnchorId:
        "yearStory",
      currentEventIndex: 7,
      completedAnchors: [
        ...completedThroughEvent(8)
      ]
    },

    closing: {
      currentAnchorId:
        "closingReflection",
      currentEventIndex: 7,
      completedAnchors: [
        ...completedThroughEvent(8),
        "yearStory"
      ]
    },

    complete: {
      currentAnchorId:
        "storybookComplete",
      currentEventIndex: 7,
      completedAnchors: [
        ...completedThroughEvent(8),
        "yearStory",
        "closingReflection"
      ]
    },

    "print-full": {
      currentAnchorId:
        "storybookComplete",
      currentEventIndex: 7,
      completedAnchors: [
        ...completedThroughEvent(8),
        "yearStory",
        "closingReflection"
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

    currentEventIndex:
      selectedCheckpoint.currentEventIndex,

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
      },

      neptunePiscesAries: {
        houses: {
          from: {
            sun: "11",
            moon: "5",
            rising: "2"
          },
          to: {
            sun: "12",
            moon: "6",
            rising: "3"
          }
        },

        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },

        natalPlanets: {
          from: {},
          to: {}
        },

        reflections: {
          from: {
            sun: "",
            moon: "",
            rising: ""
          },
          to: {
            sun: "",
            moon: "",
            rising: ""
          }
        }
      },

      uranusTaurusGemini: {
        houses: {
          from: {
            sun: "1",
            moon: "7",
            rising: "4"
          },
          to: {
            sun: "2",
            moon: "8",
            rising: "5"
          }
        },

        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },

        natalPlanets: {
          from: {},
          to: {}
        },

        reflections: {
          from: {
            sun: "",
            moon: "",
            rising: ""
          },
          to: {
            sun: "",
            moon: "",
            rising: ""
          }
        }
      },

      jupiterCancerLeo: {
        houses: {
          from: {
            sun: "3",
            moon: "9",
            rising: "6"
          },
          to: {
            sun: "4",
            moon: "10",
            rising: "7"
          }
        },

        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },

        natalPlanets: {
          from: {},
          to: {}
        },

        reflections: {
          from: {
            sun: "",
            moon: "",
            rising: ""
          },
          to: {
            sun: "",
            moon: "",
            rising: ""
          }
        }
      },

      saturnPiscesAries: {
        houses: {
          from: {
            sun: "11",
            moon: "5",
            rising: "2"
          },
          to: {
            sun: "12",
            moon: "6",
            rising: "3"
          }
        },

        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },

        natalPlanets: {
          from: {},
          to: {}
        },

        reflections: {
          from: {
            sun: "",
            moon: "",
            rising: ""
          },
          to: {
            sun: "",
            moon: "",
            rising: ""
          }
        }
      },

      eclipseSeasonFebruaryMarch: {
        houses: {
          from: {
            sun: "10",
            moon: "4",
            rising: "1"
          },
          to: {
            sun: "5",
            moon: "11",
            rising: "8"
          }
        },
        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },
        natalPlanets: {
          from: {},
          to: {}
        },
        reflections: {
          sun: "",
          moon: "",
          rising: ""
        }
      },

      eclipseSeasonAugust: {
        houses: {
          from: {
            sun: "4",
            moon: "10",
            rising: "7"
          },
          to: {
            sun: "11",
            moon: "5",
            rising: "2"
          }
        },
        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },
        natalPlanets: {
          from: {},
          to: {}
        },
        reflections: {
          sun: "",
          moon: "",
          rising: ""
        }
      },

      venusRetrogradeScorpioLibra: {
        houses: {
          from: {
            sun: "7",
            moon: "1",
            rising: "10"
          },
          to: {
            sun: "6",
            moon: "12",
            rising: "9"
          }
        },
        activities: {
          from: {
            sun: [],
            moon: [],
            rising: []
          },
          to: {
            sun: [],
            moon: [],
            rising: []
          }
        },
        natalPlanets: {
          from: {},
          to: {}
        },
        reflections: {
          from: {
            sun: "",
            moon: "",
            rising: ""
          },
          to: {
            sun: "",
            moon: "",
            rising: ""
          }
        }
      }
    }
  };

  storyState.outputs = {
    characterSketch: null,
    annualEventStories: {},
    yearStory: "",
    closingReflection: {
      clarified: "",
      intention: "",
      release: "",
      remember: "",
      dedication: ""
    }
  };

  if (checkpoint === "print-full") {
    storyState.outputs = {
      characterSketch:
        "Tracy, your identity gathers strength through continuity, allowing meaning to deepen through patience, repetition, and sustained attention. Your inner life gives that movement emotional depth, transforming ordinary experience into something charged with meaning. When these layers meet the world, your outward manner gives that inner relationship a visible form.",

      annualEventStories: {
        plutoAquarius: {
          title: "My Pluto Story",
          narrative:
            "Tracy, Pluto’s movement through your solar 10th House turns your attention toward career, visibility, reputation, and public direction. In your lunar 4th House, Pluto’s work becomes more intimate, touching home, family, ancestry, and emotional foundations. Through your natal 1st House, transformation enters the way you meet the world and claim your autonomy.\n\nYour natal Saturn in Aquarius places structure, responsibility, endurance, limits, and long-term consequences inside Pluto’s field of transformation. The selected quality, grounded, suggests that this part of the story may work through distinguishing what can be repaired and sustained from what no longer works.",
          participantReflection:
            "I am noticing where my public direction and inner foundations are changing together."
        },

        neptunePiscesAries: {
          title: "My Neptune Story",
          narrative:
            "Tracy, while Neptune moved through Pisces and your solar 11th House, its dissolving and receptive influence worked through friendships, community, networks, and long-term hopes. As Neptune moves into Aries and your solar 12th House, inspiration becomes more embodied within rest, retreat, dreams, endings, and the inner life.\n\nYour natal Mars in Aries places action, desire, courage, conflict, and self-assertion inside Neptune’s newly embodied and initiating field. The selected quality, strong, suggests that this part of the story may work through turning inspiration into action while learning whether urgency arises from inner guidance, impulse, or projection.",
          participantReflection:
            "I want to listen carefully before acting, then act with more faith in my own guidance."
        },

        uranusTaurusGemini: {
          title: "My Uranus Story",
          narrative:
            "Tracy, while Uranus moved through Taurus and your solar 1st House, its disruptive and liberating influence worked through identity, appearance, autonomy, and the way you enter life. With several natal planets in Taurus, Uranus’s long passage through this sign touched multiple parts of your chart.\n\nYour natal Sun in Taurus placed identity, vitality, leadership, and conscious purpose inside Uranus’s liberating field. Your natal Mercury in Taurus placed thought, language, learning, perception, and communication inside the same field. Your natal Venus in Taurus placed values, attraction, pleasure, relationship, and self-worth inside the story as well. Taken together, these placements suggest that Uranus’s Taurus chapter may have reshaped how you understand identity, thought, relationship, security, and the values that support an authentic life.\n\nAs Uranus moves into Gemini, freedom begins to move through new language, new connections, and a more flexible mind.",
          participantReflection:
            "This feels like a chapter about becoming more flexible without losing what is essential."
        },

        jupiterCancerLeo: {
          title: "My Jupiter Story",
          narrative:
            "Tracy, while Jupiter moves through Cancer and your solar 3rd House, its nourishing and expansive influence works through communication, learning, daily habits, and your immediate environment. As Jupiter moves into Leo and your solar 4th House, confidence, visibility, and creative expansion become more active within home, family, ancestry, and emotional foundations.\n\nYour natal Uranus in Leo places freedom, originality, disruption, awakening, and change inside Jupiter’s confident and expressive field. The selected quality, rebellious, suggests that this part of the story may work through awakening original forms of creativity, visibility, and leadership while encouraging a more liberated relationship with recognition.",
          participantReflection:
            "I can let growth come through learning, home, and the courage to be seen."
        },

        saturnPiscesAries: {
          title: "My Saturn Story",
          narrative:
            "Tracy, while Saturn has been in Pisces and your solar 11th House, its patient and reality-testing influence has worked through friendships, community, networks, and long-term hopes. As Saturn moves into Aries and your solar 12th House, responsibility, initiative, and embodied authority become more active within rest, retreat, dreams, endings, and the inner life.\n\nThis chapter asks for steadiness, simplicity, and the willingness to honor limits without abandoning the work that matters.",
          participantReflection:
            "I want to be disciplined without becoming rigid, and rested without disappearing."
        },

        eclipseSeasonFebruaryMarch: {
          title: "My February–March Eclipse Story",
          narrative:
            "Tracy, the Solar Eclipse in Aquarius activates your solar 5th House, bringing accelerated change to creativity, pleasure, romance, and personal expression, while the Lunar Eclipse in Virgo activates your solar 10th House, illuminating career, visibility, reputation, and public direction.\n\nYour natal Saturn in Aquarius places structure, responsibility, endurance, limits, and long-term consequences inside the Aquarius solar eclipse’s clearing and future-facing field. Your natal Uranus in Virgo places freedom, originality, disruption, awakening, and change inside the Virgo lunar eclipse’s clarifying and reality-facing field.",
          participantReflection:
            "I am considering what needs to be cleared so my creative and public life can align."
        },

        eclipseSeasonAugust: {
          title: "My August Eclipse Story",
          narrative:
            "Tracy, the Solar Eclipse in Leo activates your solar 11th House, bringing accelerated change to friendships, community, networks, and long-term hopes, while the Lunar Eclipse in Pisces activates your solar 4th House, illuminating home, family, ancestry, and emotional foundations.\n\nYour natal Pluto in Leo places power, transformation, elimination, renewal, and deep psychological change inside the Leo solar eclipse’s creative and self-revealing field. Your natal Jupiter in Pisces places growth, faith, meaning, opportunity, and perspective inside the Pisces lunar eclipse’s dissolving and spiritually realigning field.",
          participantReflection:
            "This feels like a rebalancing between community, family, faith, and visibility."
        },

        venusRetrogradeScorpioLibra: {
          title: "My Venus Retrograde Story",
          narrative:
            "Tracy, while Venus retrogrades through Scorpio and your solar 7th House, desire, value, and attraction are reviewed within partnerships, commitments, and one-to-one relationships. As Venus backtracks into Libra and your solar 6th House, the review turns toward balance, fairness, and reciprocity within work, health, service, and daily responsibilities.\n\nYour natal Moon in Scorpio places emotional needs, instinct, memory, care, and belonging inside Venus retrograde’s probing and desire-revealing field. Your natal Pluto in Libra places power, transformation, elimination, renewal, and deep psychological change inside Venus retrograde’s relational and balance-seeking field.",
          participantReflection:
            "I am reviewing what reciprocity, closeness, and emotional honesty require from me now."
        }
      },

      yearStory:
        "My focus this year is learning how to let old structures loosen while giving practical form to new possibilities. I want to keep an open mind, remain flexible, and trust that there is more than one way to create resources, relationship, visibility, and meaning. The biggest lesson is to stay awake to what is changing without rushing the story before it is ready.",

      closingReflection: {
        clarified:
          "I can see that several parts of my life are asking for more freedom, more discipline, and more honest language at the same time.",
        intention:
          "My intention is to stay open and flexible while continuing to create steadily.",
        release:
          "I am ready to release the belief that there is only one correct path forward.",
        remember:
          "When things feel uncertain or intense, I want to remember that I am participating in a story that is still unfolding.",
        dedication:
          "Keep on, keeping on, Ms. Jackson."
      }
    };
  }

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
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
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
    "accept", "allow", "care", "choose", "connect",
    "create", "express", "feel", "focus", "follow",
    "give", "have", "help", "learn", "listen",
    "make", "move", "protect", "pursue", "rest",
    "share", "speak", "spend", "stay", "take",
    "trust", "work", "write"
  ];

  const beginsWithAction =
    actionVerbs.some(verb =>
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

  const paragraphs = [
    `${name}, ${sunLanguage.sun} ${buildSunShineSentence(
      responses.sunShine
    )} ${buildSunPrideSentence(
      responses.sunPride
    )}`,

    `${getRelationshipLanguage(
      determineRelationship(
        sunSign,
        moonSign
      )
    ).interior} ${capitalizeFirst(
      moonLanguage.moon
    )} ${buildMoonEaseSentence(
      responses.moonEase
    )} ${buildMoonMotivationSentence(
      responses.moonMotivation
    )}`,

    `${getRelationshipLanguage(
      determineRelationship(
        sunSign,
        moonSign
      )
    ).threshold} ${capitalizeFirst(
      risingLanguage.rising
    )} ${buildRisingStyleSentence(
      responses.risingStyle
    )} ${buildRisingActionsSentence(
      responses.risingActions
    )}`,

    getRelationshipLanguage(
      determineRelationship(
        sunSign,
        moonSign
      )
    ).integration
  ];

  return paragraphs.join("\n\n");
}

function getSignOptions() {
  return Object.keys(zodiacKeywords)
    .map(
      sign =>
        `<option value="${sign}">${sign}</option>`
    )
    .join("");
}

function savePromptResponses(fields) {
  fields.forEach(field => {
    storyState.characterResponses[
      field.stateKey
    ] =
      document
        .getElementById(field.id)
        .value
        .trim();
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
            <strong>
              ${escapeHtml(field.label)}
            </strong>
          </label>

          <textarea
            id="${field.id}"
            rows="4"
            style="width: 100%;"
            placeholder="Complete this sentence in your own words."
          >${escapeHtml(
            storyState.characterResponses[
              field.stateKey
            ] || ""
          )}</textarea>

          <br><br>
        `
      )
      .join("")}

    <p id="promptError" style="display: none;">
      Please respond to both prompts before continuing.
    </p>

    <button id="backPromptButton">Back</button>
    <button id="continuePromptButton">
      Continue
    </button>
  `;

  document
    .getElementById("backPromptButton")
    .addEventListener("click", () => {
      savePromptResponses(fields);
      storyState.currentAnchorId =
        backAnchor;
      render();
    });

  document
    .getElementById("continuePromptButton")
    .addEventListener("click", () => {
      savePromptResponses(fields);

      const allComplete =
        fields.every(
          field =>
            storyState
              .characterResponses[
                field.stateKey
              ].length > 0
        );

      if (!allComplete) {
        document.getElementById(
          "promptError"
        ).style.display = "block";

        return;
      }

      advanceStory();
      render();
    });
}

function render() {
  const current = getCurrentAnchor();

  console.log(
    "Current Anchor ID:",
    current.id
  );

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

  const finalSectionWasRendered =
    renderFinalSectionsAnchor({
      anchorId: current.id,
      app,
      advanceStory,
      render
    });

  if (finalSectionWasRendered) {
    return;
  }

  if (current.id === "welcome") {
    const isReflectionMode =
      storyState.storyMode === "reflection";

    app.innerHTML = `
      <h2>Welcome</h2>

      <p>
        This is the beginning of your Storybook journey.
      </p>

      <section
        style="
          border: 1px solid #dddddd;
          padding: 14px;
          margin: 24px 0;
          background: #fafafa;
        "
      >
        <h3>Before You Begin</h3>

        <p>
          This Storybook works best when you know your
          Sun, Moon, and Rising signs. If you do not know
          all three, you can use a free birth chart calculator
          before beginning. You will need your birth date,
          birth time, and birth location.
        </p>

        <p>
          <a
            href="https://horoscopes.astro-seek.com/birth-chart-horoscope-online"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Astro-Seek Birth Chart Calculator
          </a>
        </p>
      </section>

      <section
        style="
          border: 1px solid #dddddd;
          padding: 14px;
          margin: 24px 0;
          background: #fffdf8;
        "
      >
        <h3>Preview Mode</h3>

        <p>
          For review, choose how much of the Storybook
          should be synthesized for the participant.
        </p>

        <label style="display: block; margin: 10px 0;">
          <input
            type="radio"
            name="storyMode"
            value="guided"
            ${!isReflectionMode ? "checked" : ""}
          >
          <strong>Guided Story Mode</strong> — the
          Storybook creates a polished narrative from the
          participant’s selections.
        </label>

        <label style="display: block; margin: 10px 0;">
          <input
            type="radio"
            name="storyMode"
            value="reflection"
            ${isReflectionMode ? "checked" : ""}
          >
          <strong>Reflection-First Mode</strong> — the
          Storybook preserves the structure and asks the
          participant to do more of the interpretive writing.
        </label>
      </section>

      <button id="startButton">Begin</button>
    `;

    document
      .getElementById("startButton")
      .addEventListener("click", () => {
        const selectedMode = document.querySelector(
          'input[name="storyMode"]:checked'
        );

        storyState.storyMode =
          selectedMode?.value || "guided";

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

    document
      .getElementById("submitName")
      .addEventListener("click", () => {
        const name =
          document
            .getElementById("nameInput")
            .value
            .trim();

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
          document
            .getElementById("sunSignInput")
            .value;

        if (!sunSign) {
          return;
        }

        storyState.identity.sunSign =
          sunSign;

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
          document
            .getElementById("moonSignInput")
            .value;

        if (!moonSign) {
          return;
        }

        storyState.identity.moonSign =
          moonSign;

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
          document
            .getElementById(
              "risingSignInput"
            )
            .value;

        if (!risingSign) {
          return;
        }

        storyState.identity.risingSign =
          risingSign;

        advanceStory();
        render();
      });

    return;
  }

  if (current.id === "sunKeywordSelection") {
    const keywords =
      zodiacKeywords[
        storyState.identity.sunSign
      ] || [];

    app.innerHTML = `
      <h2>Select Your Sun Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document
      .querySelectorAll(".kw")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            storyState.selections
              .sunKeyword =
                button.dataset.keyword;

            advanceStory();
            render();
          }
        );
      });

    return;
  }

  if (current.id === "moonKeywordSelection") {
    const keywords =
      zodiacKeywords[
        storyState.identity.moonSign
      ] || [];

    app.innerHTML = `
      <h2>Select Your Moon Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document
      .querySelectorAll(".kw")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            storyState.selections
              .moonKeyword =
                button.dataset.keyword;

            advanceStory();
            render();
          }
        );
      });

    return;
  }

  if (current.id === "risingKeywordSelection") {
    const keywords =
      zodiacKeywords[
        storyState.identity.risingSign
      ] || [];

    app.innerHTML = `
      <h2>Select Your Rising Keyword</h2>

      ${keywords
        .map(
          keyword =>
            `<button class="kw" data-keyword="${keyword}">${keyword}</button>`
        )
        .join("")}
    `;

    document
      .querySelectorAll(".kw")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            storyState.selections
              .risingKeyword =
                button.dataset.keyword;

            advanceStory();
            render();
          }
        );
      });

    return;
  }

  if (current.id === "sunReflection") {
    renderCharacterPromptPage({
      title: "Your Sun",
      subtitle:
        "Your Sun describes vitality, meaning, and purpose. Complete both sentences in your own words.",
      keywordLabel:
        "Your selected Sun keyword",
      keyword:
        storyState.selections.sunKeyword,
      backAnchor:
        "risingKeywordSelection",
      fields: [
        {
          id: "sunShineInput",
          stateKey: "sunShine",
          label:
            "I shine in the world when I…"
        },
        {
          id: "sunPrideInput",
          stateKey: "sunPride",
          label:
            "I am proud of myself when I…"
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
      keywordLabel:
        "Your selected Moon keyword",
      keyword:
        storyState.selections.moonKeyword,
      backAnchor:
        "sunReflection",
      fields: [
        {
          id: "moonEaseInput",
          stateKey: "moonEase",
          label:
            "I feel most at ease when I am…"
        },
        {
          id: "moonMotivationInput",
          stateKey:
            "moonMotivation",
          label:
            "I am motivated by the need to…"
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
      keywordLabel:
        "Your selected Rising keyword",
      keyword:
        storyState.selections.risingKeyword,
      backAnchor:
        "moonReflection",
      fields: [
        {
          id: "risingStyleInput",
          stateKey: "risingStyle",
          label: "My style is…"
        },
        {
          id: "risingActionsInput",
          stateKey:
            "risingActions",
          label:
            "Others would describe my actions as…"
        }
      ]
    });

    return;
  }

  if (current.id === "characterSketch") {
    const sketch =
      buildCharacterSketch();

    storyState.outputs.characterSketch =
      sketch;

    const sketchParagraphs = sketch
      .split("\n\n")
      .map(
        paragraph =>
          `<p>${escapeHtml(paragraph)}</p>`
      )
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
      .getElementById(
        "backToRisingReflection"
      )
      .addEventListener("click", () => {
        storyState.currentAnchorId =
          "risingReflection";

        render();
      });

    document
      .getElementById(
        "continueToReflection"
      )
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
      .getElementById(
        "backToCharacterSketch"
      )
      .addEventListener("click", () => {
        const text =
          document
            .getElementById(
              "reflectionInput"
            )
            .value
            .trim();

        storyState.selections.reflection =
          text;

        storyState.currentAnchorId =
          "characterSketch";

        render();
      });

    document
      .getElementById(
        "submitReflection"
      )
      .addEventListener("click", () => {
        const text =
          document
            .getElementById(
              "reflectionInput"
            )
            .value
            .trim();

        storyState.selections.reflection =
          text;

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
  nextButton.addEventListener(
    "click",
    () => {
      advanceStory();
      render();
    }
  );
}

document.addEventListener(
  "keydown",
  event => {
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
      [
        "checkbox",
        "radio",
        "button",
        "submit"
      ].includes(target.type)
    ) {
      return;
    }

    const forwardButtons = Array.from(
      app.querySelectorAll("button")
    ).filter(button => {
      const isVisible =
        button.offsetParent !== null;

      const isBackButton =
        button.id
          .toLowerCase()
          .includes("back");

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

    forwardButtons[
      forwardButtons.length - 1
    ].click();
  }
);

loadDevelopmentCheckpoint();
render();
