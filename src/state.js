export const storyState = {
  currentAnchorId: "welcome",
  storyMode: "guided",


  identity: {
    name: null,
    sunSign: null,
    moonSign: null,
    risingSign: null
  },

  selections: {
    sunKeyword: null,
    moonKeyword: null,
    risingKeyword: null,
    reflection: null
  },

  characterResponses: {
    sunShine: "",
    sunPride: "",
    moonEase: "",
    moonMotivation: "",
    risingStyle: "",
    risingActions: ""
  },

  annualJourney: {
    year: 2026,
    currentEventIndex: 0,
    responses: {}
  },

  outputs: {
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
  },

  completedAnchors: []
};

export function completeAnchor(anchorId) {
  if (
    !storyState.completedAnchors.includes(
      anchorId
    )
  ) {
    storyState.completedAnchors.push(
      anchorId
    );
  }
}
