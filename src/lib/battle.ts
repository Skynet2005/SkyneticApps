import troopStatsData from '@/public/battle-simulator/troop_stats.json';

export function getTroopStats(troopType: string, level: string) {
  const levelStats = troopStatsData[level as keyof typeof troopStatsData];
  if (!levelStats) {
    throw new Error(`Invalid level '${level}'.`);
  }

  const stats = levelStats[troopType as keyof typeof levelStats];
  if (!stats) {
    throw new Error(`Invalid troop type '${troopType}'.`);
  }

  return stats;
}

export function parseTroopCount(troopInput: string, totalTroops: number): number {
  if (troopInput.includes('%')) {
    const ratio = parseFloat(troopInput.replace('%', '')) / 100;
    return Math.floor(totalTroops * ratio);
  }

  const count = parseInt(troopInput, 10);
  if (isNaN(count)) {
    throw new Error(`Invalid troop count input: ${troopInput}`);
  }

  return count;
}
