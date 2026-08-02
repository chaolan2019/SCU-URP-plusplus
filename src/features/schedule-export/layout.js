export function scheduleCardLaneGeometry(cellWidth, laneCount, laneIndex, leftEdgeOffset = 0) {
  const width = Math.max(0, Number(cellWidth) || 0);
  const count = Math.max(1, Math.floor(Number(laneCount) || 1));
  const index = Math.max(0, Math.min(count - 1, Math.floor(Number(laneIndex) || 0)));
  const origin = -(Math.max(0, Number(leftEdgeOffset) || 0));
  const left = origin + width * index / count;
  const right = origin + width * (index + 1) / count;
  return { left, width: Math.max(0, right - left) };
}
