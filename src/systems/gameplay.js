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

// A rainbow egg can only appear once earlier rounds have taught the core
// matching rule, and never punishes — it just widens what counts as correct.
export function isRainbowRound(round, roll, unlockRound = 5, chance = 0.22) {
  return round >= unlockRound && roll < chance;
}

export function eggMatches(targetId, chosenId) {
  return targetId === 'rainbow' || targetId === chosenId;
}

// How many toys spawn together once Finley Chaos has established the single-
// toy rule. Never doubles up on the final toy, so the round always ends clean.
export function chaosBatchSize(tidied, remaining, rollDual, unlockAt = 4) {
  if (tidied < unlockAt || remaining <= 1) return 1;
  return rollDual ? 2 : 1;
}

// Space Rescue's spawn-type bands, factored out so the thresholds are
// unit-testable independent of Math.random.
export function pickSpaceSpawnType(roll) {
  if (roll < 0.44) return 'astronaut';
  if (roll < 0.62) return 'stardust';
  if (roll < 0.7) return 'shield';
  return 'asteroid';
}

// Picks a bonus grid index outside a set of already-reserved ones (e.g. Pirate
// Dig's Lucky Chest, kept separate from the five required treasures) from a
// caller-supplied roll in [0, 1), so it's deterministic and testable.
export function pickBonusIndex(excludeIndexes, gridSize, roll) {
  const available = [];
  for (let i = 0; i < gridSize; i += 1) if (!excludeIndexes.has(i)) available.push(i);
  return available[Math.min(available.length - 1, Math.floor(roll * available.length))];
}
