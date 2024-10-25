// src/app/models/Player.ts

import { Troop } from './Troop';

export class Player {
  name: string;
  troops: Record<string, Troop>;
  specialBonuses: Record<string, number>;

  constructor(
    name: string,
    troops: Record<string, Troop>,
    specialBonuses: Record<string, number> = {}
  ) {
    this.name = name;
    this.troops = troops;
    this.specialBonuses = this.initializeSpecialBonuses(specialBonuses);
  }

  private initializeSpecialBonuses(specialBonuses: Record<string, number>): Record<string, number> {
    const defaultBonuses = {
      troops_attack: 0,
      troops_defense: 0,
      troops_lethality: 0,
      troops_health: 0,
      enemy_troops_attack: 0,
      enemy_troops_defense: 0,
      defender_troops_attack: 0,
      defender_troops_defense: 0,
      defender_troops_lethality: 0,
      defender_troops_health: 0,
      rally_troops_attack: 0,
      rally_troops_defense: 0,
      rally_troops_lethality: 0,
      rally_troops_health: 0,
      pet_skill_enemy_lethality_penalty: 0,
      pet_skill_enemy_health_penalty: 0,
      pet_skill_attack_bonus: 0,
      pet_skill_lethality_bonus: 0,
    };
    return { ...defaultBonuses, ...specialBonuses };
  }

  totalTroopStats() {
    const totalStats = {
      attack: 0,
      defense: 0,
      lethality: 0,
      health: 0,
      power: 0,
    };

    for (const troop of Object.values(this.troops)) {
      const stats = troop.totalStats();
      totalStats.attack += stats.attack;
      totalStats.defense += stats.defense;
      totalStats.lethality += stats.lethality;
      totalStats.health += stats.health;
      totalStats.power += stats.power;
    }

    totalStats.attack *= 1 + this.specialBonuses.troops_attack / 100;
    totalStats.defense *= 1 + this.specialBonuses.troops_defense / 100;
    totalStats.lethality *= 1 + this.specialBonuses.troops_lethality / 100;
    totalStats.health *= 1 + this.specialBonuses.troops_health / 100;

    return totalStats;
  }
}
