// src/app/models/Troop.ts

import { getTroopStats } from '@/src/lib/battle';

export class Troop {
  level: string;
  count: number;
  statsPercent: Record<string, number>;
  baseStats: Record<string, number>;
  modifiedStats: Record<string, number>;

  constructor(
    troopType: string,
    level: string,
    count: number,
    statsPercent: Record<string, number>
  ) {
    this.level = level;
    this.count = count;
    this.statsPercent = statsPercent;
    this.baseStats = getTroopStats(troopType, level);
    this.modifiedStats = this.applyPercentModifiers();
  }

  private applyPercentModifiers(): Record<string, number> {
    const { attack, defense, lethality, health, power } = this.baseStats;
    const { attack: attackPercent = 0, defense: defensePercent = 0, lethality: lethalityPercent = 0, health: healthPercent = 0 } = this.statsPercent;

    return {
      power,
      attack: attack * (1 + attackPercent / 100),
      defense: defense * (1 + defensePercent / 100),
      lethality: lethality * (1 + lethalityPercent / 100),
      health: health * (1 + healthPercent / 100),
    };
  }

  totalStats(): Record<string, number> {
    return Object.fromEntries(
      Object.entries(this.modifiedStats).map(([key, value]) => [key, value * this.count])
    );
  }
}

export class Infantry extends Troop {
  constructor(level: string, count: number, statsPercent: Record<string, number>) {
    super('Infantry', level, count, statsPercent);
  }
}

export class Lancer extends Troop {
  constructor(level: string, count: number, statsPercent: Record<string, number>) {
    super('Lancer', level, count, statsPercent);
  }
}

export class Marksmen extends Troop {
  constructor(level: string, count: number, statsPercent: Record<string, number>) {
    super('Marksmen', level, count, statsPercent);
  }
}
