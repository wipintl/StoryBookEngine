export const anchors = {
  welcome: {
    id: "welcome",
    type: "presentation",
    purpose:
      "Welcome the participant and establish the beginning of the Storybook journey.",
    completionType: "narrativePresentation",
    unlocks: "identityCollection"
  },

  identityCollection: {
    id: "identityCollection",
    type: "collection",
    purpose: "Collect the participant's name.",
    completionType: "participantResponse",
    requires: ["welcome"],
    unlocks: "sunSignSelection"
  },

  sunSignSelection: {
    id: "sunSignSelection",
    type: "collection",
    purpose: "Collect the participant's Sun sign.",
    completionType: "participantResponse",
    requires: ["identityCollection"],
    unlocks: "moonSignSelection"
  },

  moonSignSelection: {
    id: "moonSignSelection",
    type: "collection",
    purpose: "Collect the participant's Moon sign.",
    completionType: "participantResponse",
    requires: ["sunSignSelection"],
    unlocks: "risingSignSelection"
  },

  risingSignSelection: {
    id: "risingSignSelection",
    type: "collection",
    purpose: "Collect the participant's Rising sign.",
    completionType: "participantResponse",
    requires: ["moonSignSelection"],
    unlocks: "sunKeywordSelection"
  },

  sunKeywordSelection: {
    id: "sunKeywordSelection",
    type: "collection",
    purpose: "Select the participant's Sun keyword.",
    completionType: "participantResponse",
    requires: ["risingSignSelection"],
    unlocks: "moonKeywordSelection"
  },

  moonKeywordSelection: {
    id: "moonKeywordSelection",
    type: "collection",
    purpose: "Select the participant's Moon keyword.",
    completionType: "participantResponse",
    requires: ["sunKeywordSelection"],
    unlocks: "risingKeywordSelection"
  },

  risingKeywordSelection: {
    id: "risingKeywordSelection",
    type: "collection",
    purpose: "Select the participant's Rising keyword.",
    completionType: "participantResponse",
    requires: ["moonKeywordSelection"],
    unlocks: "sunReflection"
  },

  sunReflection: {
    id: "sunReflection",
    type: "collection",
    purpose:
      "Invite the participant to describe how their Sun operates in lived experience.",
    completionType: "participantResponse",
    requires: ["risingKeywordSelection"],
    unlocks: "moonReflection"
  },

  moonReflection: {
    id: "moonReflection",
    type: "collection",
    purpose:
      "Invite the participant to describe their emotional needs and motivations.",
    completionType: "participantResponse",
    requires: ["sunReflection"],
    unlocks: "risingReflection"
  },

  risingReflection: {
    id: "risingReflection",
    type: "collection",
    purpose:
      "Invite the participant to describe their style and outward behavior.",
    completionType: "participantResponse",
    requires: ["moonReflection"],
    unlocks: "characterSketch"
  },

  characterSketch: {
    id: "characterSketch",
    type: "generation",
    purpose:
      "Create a unified portrait from the participant's astrological and personal responses.",
    completionType: "narrativeGeneration",
    requires: ["risingReflection"],
    unlocks: "characterReflection"
  },

  characterReflection: {
    id: "characterReflection",
    type: "collection",
    purpose:
      "Capture participant reflection on the Character Sketch.",
    completionType: "participantResponse",
    requires: ["characterSketch"],
    unlocks: "annualEventScene"
  },

  annualEventScene: {
    id: "annualEventScene",
    type: "presentation",
    purpose:
      "Present Donna and Kathy's authored annual event narrative.",
    completionType: "narrativePresentation",
    requires: ["characterReflection"],
    unlocks: "annualEventContext"
  },

  annualEventContext: {
    id: "annualEventContext",
    type: "collection",
    purpose:
      "Collect the participant's chart-specific house context for the annual event.",
    completionType: "participantResponse",
    requires: ["annualEventScene"],
    unlocks: "annualEventChoices"
  },

  annualEventChoices: {
    id: "annualEventChoices",
    type: "collection",
    purpose:
      "Collect the participant's house activity selections.",
    completionType: "participantResponse",
    requires: ["annualEventContext"],
    unlocks: "annualEventReflection"
  },

  annualEventReflection: {
    id: "annualEventReflection",
    type: "collection",
    purpose:
      "Capture the participant's personal annual-event story.",
    completionType: "participantResponse",
    requires: ["annualEventChoices"],
    unlocks: "annualEventComplete"
  },

  annualEventComplete: {
    id: "annualEventComplete",
    type: "presentation",
    purpose:
      "Present the participant's completed annual-event chapter.",
    completionType: "narrativePresentation",
    requires: ["annualEventReflection"],
    unlocks: null
  }
};
