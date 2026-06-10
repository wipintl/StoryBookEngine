export function canEnterAnchor(anchor, storyState) {
  if (!anchor.requires || anchor.requires.length === 0) {
    return true;
  }

  return anchor.requires.every(id =>
    storyState.completedAnchors.includes(id)
  );
}
