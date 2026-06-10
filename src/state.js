export const storyState = {
  currentAnchorId: "welcome",

  identity: {
    name: null,
    sunSign: null,
    moonSign: null,
    risingSign: null
  },

  selections: {
    sunKeyword: null,
    moonKeyword: null,
    risingKeyword: null
  },

  eventContext: {
    pluto: {
      sunHouse: null,
      moonHouse: null,
      risingHouse: null
    }
  },

  outputs: {
    characterSketch: null,
    eventReflections: {}
  },

  completedAnchors: []
};

export function completeAnchor(anchorId) {
  if (!storyState.completedAnchors.includes(anchorId)) {
    storyState.completedAnchors.push(anchorId);
  }
}
