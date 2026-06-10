export const anchors = {
  welcome: {
    id: "welcome",
    type: "presentation",
    purpose: "Welcome the participant and establish the beginning of the Storybook journey.",
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
    unlocks: "characterSketch"
  },

  characterSketch: {
    id: "characterSketch",
    type: "generation",
    purpose: "Allow the participant to inhabit their identity before entering the larger astrological landscape.",
    completionType: "narrativeGeneration",
    requires: ["risingKeywordSelection"],
    unlocks: "plutoNarrative"
  },

  plutoNarrative: {
    id: "plutoNarrative",
    type: "presentation",
    purpose: "Present the collective Pluto narrative.",
    completionType: "narrativePresentation",
    requires: ["characterSketch"],
    unlocks: "plutoContextRequest"
  },

  plutoContextRequest: {
    id: "plutoContextRequest",
    type: "collection",
    purpose: "Request the participant's Pluto house context from Donna's reference chart.",
    completionType: "participantResponse",
    requires: ["plutoNarrative"],
    unlocks: "plutoReflection"
  },

  plutoReflection: {
    id: "plutoReflection",
    type: "generation",
    purpose: "Create the participant's personalized Pluto reflection.",
    completionType: "narrativeGeneration",
    requires: ["plutoContextRequest"],
    unlocks: null
  }
};
