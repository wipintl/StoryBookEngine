import { canEnterAnchor } from "./rules.js";
import { storyState, completeAnchor } from "./state.js";
import { anchors } from "./anchors.js";

export function getCurrentAnchor() {
  return anchors[storyState.currentAnchorId];
}

export function advanceStory() {
  const current = getCurrentAnchor();

  completeAnchor(current.id);

  if (current.id === "characterSketch") {
  return current;
  }

  if (!current.unlocks) {
    return null;
  }

  const next = anchors[current.unlocks];

  if (canEnterAnchor(next, storyState)) {
    storyState.currentAnchorId = next.id;
  } else {
    console.warn("Cannot enter anchor:", next.id);
  }

  return getCurrentAnchor();
}
