export function smoothDelta(delta, ceiling = 50) {
  if (!Number.isFinite(delta) || delta < 0) return 1000 / 60;
  return Math.min(ceiling, delta);
}

export function nearbyTreasureCount(index, treasureIndexes, columns = 4, rows = 4) {
  const row = Math.floor(index / columns); const col = index % columns; let count = 0;
  for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
    if (!dr && !dc) continue;
    const nextRow = row + dr; const nextCol = col + dc;
    if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < columns && treasureIndexes.has(nextRow * columns + nextCol)) count += 1;
  }
  return count;
}

export function withinRadius(ax, ay, bx, by, radius) {
  const dx = ax - bx; const dy = ay - by;
  return dx * dx + dy * dy <= radius * radius;
}

export function isMilestone(count, every = 5) {
  return Boolean(count) && count % every === 0;
}

export function nearestDestination(x, y, destinations) {
  return destinations.reduce((best, destination) => {
    const distance = Math.hypot(x - destination.x, y - destination.y);
    return !best || distance < best.distance ? { destination, distance } : best;
  }, null);
}
