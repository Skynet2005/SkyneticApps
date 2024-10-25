// src/app/[locale](protected)/routes)/_components/battle-simulator/models/Battle.ts

import { Player } from './Player';

type TroopType = 'Infantry' | 'Lancer' | 'Marksmen';
type TroopStats = {
  attack: number;
  defense: number;
  lethality: number;
  health: number;
  power: number;
};
type TroopBonuses = Record<TroopType, number>;
type TroopCounts = Record<TroopType, number>;

export class Battle {
  player1: Player;
  player2: Player;

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
  }

  private initializeBonuses(): TroopBonuses {
    return {
      Infantry: 1.0,
      Lancer: 1.0,
      Marksmen: 1.0,
    };
  }

  private calculateBonuses(): [TroopBonuses, TroopBonuses] {
    const p1Bonus = this.initializeBonuses();
    const p2Bonus = this.initializeBonuses();

    const troopAdvantage = [
      { attacker: 'Infantry', defender: 'Lancer', bonus: 0.10 },
      { attacker: 'Lancer', defender: 'Marksmen', bonus: 0.10 },
      { attacker: 'Marksmen', defender: 'Infantry', bonus: 0.10 },
    ];

    troopAdvantage.forEach(({ attacker, defender, bonus }) => {
      const attackerType = attacker as TroopType;
      const defenderType = defender as TroopType;

      if (this.player1.troops[attackerType] && this.player2.troops[defenderType]) {
        p1Bonus[attackerType] += bonus;
      }
      if (this.player2.troops[attackerType] && this.player1.troops[defenderType]) {
        p2Bonus[attackerType] += bonus;
      }
    });

    return [p1Bonus, p2Bonus];
  }

  private calculateDamage(
    attacker: Player,
    defender: Player,
    attackerBonuses: TroopBonuses,
    defenderBonuses: TroopBonuses
  ): { [key in TroopType]: number } {
    const damageByType: { [key in TroopType]: number } = {
      Infantry: 0,
      Lancer: 0,
      Marksmen: 0,
    };

    const advantage: { [key in TroopType]: TroopType } = {
      Infantry: 'Lancer',
      Lancer: 'Marksmen',
      Marksmen: 'Infantry',
    };

    for (const troopType of ['Infantry', 'Lancer', 'Marksmen'] as TroopType[]) {
      const attackerTroop = attacker.troops[troopType];
      if (!attackerTroop) continue;

      let totalDamage = 0;

      for (const defenderType of ['Infantry', 'Lancer', 'Marksmen'] as TroopType[]) {
        const defenderTroop = defender.troops[defenderType];
        if (!defenderTroop || defenderTroop.count === 0) continue;

        let typeBonus = 1.0;
        if (advantage[troopType] === defenderType) {
          typeBonus += 0.1;
        }

        const attackValue =
          attackerTroop.modifiedStats.attack *
          attackerTroop.count *
          attackerBonuses[troopType] *
          typeBonus;
        const lethalityValue = attackerTroop.modifiedStats.lethality / 100;
        const defenseValue =
          defenderTroop.modifiedStats.defense *
          defenderTroop.count *
          defenderBonuses[defenderType];
        const healthValue = defenderTroop.modifiedStats.health * defenderTroop.count;

        const baseDamage = Math.max(attackValue - defenseValue, 0);
        const damage = baseDamage * (1 + lethalityValue) - healthValue * lethalityValue;

        totalDamage += Math.max(damage, 0);
      }

      damageByType[troopType] = totalDamage;
    }

    return damageByType;
  }

  calculateCasualties(
    player: Player,
    damageTakenByType: { [key in TroopType]: number }
  ): { [key in TroopType]: { injured: number; lightlyInjured: number; survivors: number } } {
    const casualtiesByType = {} as {
      [key in TroopType]: { injured: number; lightlyInjured: number; survivors: number };
    };

    for (const troopType of ['Infantry', 'Lancer', 'Marksmen'] as TroopType[]) {
      const troop = player.troops[troopType];
      if (!troop || troop.count === 0) continue;

      const totalTroops = troop.count;
      const totalHealth = troop.modifiedStats.health * totalTroops;
      const damageTaken = damageTakenByType[troopType];

      const totalCasualties = Math.min(
        Math.floor((damageTaken / totalHealth) * totalTroops),
        totalTroops
      );

      let injuredPercentage = 0.35;
      let lightlyInjuredPercentage = 0.65;

      if (damageTaken === 0) {
        injuredPercentage = 0;
        lightlyInjuredPercentage = 0;
      }

      const injured = Math.floor(totalCasualties * injuredPercentage);
      let lightlyInjured = Math.floor(totalCasualties * lightlyInjuredPercentage);

      const totalCalculatedCasualties = injured + lightlyInjured;
      const casualtiesDifference = totalCasualties - totalCalculatedCasualties;

      if (casualtiesDifference > 0) {
        lightlyInjured += casualtiesDifference;
      } else if (casualtiesDifference < 0) {
        lightlyInjured += casualtiesDifference;
      }

      const survivors = totalTroops - totalCasualties;

      casualtiesByType[troopType] = { injured, lightlyInjured, survivors };
    }

    return casualtiesByType;
  }

  calculatePowerLoss(
    player: Player,
    casualtiesByType: { [key in TroopType]: { injured: number; lightlyInjured: number } }
  ): number {
    let powerLoss = 0;

    for (const troopType of ['Infantry', 'Lancer', 'Marksmen'] as TroopType[]) {
      const troop = player.troops[troopType];
      if (!troop) continue;

      const casualties = casualtiesByType[troopType];
      const totalCasualties = casualties.injured + casualties.lightlyInjured;
      powerLoss += totalCasualties * troop.baseStats.power;
    }

    return powerLoss;
  }

  private calculateCounterRatios(
    player1Troops: TroopCounts,
    player2Troops: TroopCounts,
    player1Stats: TroopStats,
    player2Stats: TroopStats,
    p1Bonus: TroopBonuses,
    p2Bonus: TroopBonuses
  ): TroopBonuses {
    const counterRatios: TroopBonuses = {
      Infantry: 0.0,
      Lancer: 0.0,
      Marksmen: 0.0,
    };

    for (const troopType of ['Infantry', 'Lancer', 'Marksmen'] as const) {
      if (player1Troops[troopType] && player2Troops[troopType]) {
        const p1Power =
          (player1Stats.attack + player1Stats.lethality) * p1Bonus[troopType] * player1Troops[troopType];
        const p2Power =
          (player2Stats.attack + player2Stats.lethality) * p2Bonus[troopType] * player2Troops[troopType];

        if (p1Power > 0) {
          const currentRatio =
            player1Troops[troopType] / (player1Troops[troopType] + player2Troops[troopType]);
          counterRatios[troopType] = (p1Power / p2Power) * (1 - currentRatio);
        } else {
          counterRatios[troopType] = Infinity;
        }
      }
    }

    const totalRatio = counterRatios.Infantry + counterRatios.Lancer + counterRatios.Marksmen;
    if (totalRatio > 0) {
      counterRatios.Infantry = Math.round((counterRatios.Infantry / totalRatio) * 100);
      counterRatios.Lancer = Math.round((counterRatios.Lancer / totalRatio) * 100);
      counterRatios.Marksmen = Math.round((counterRatios.Marksmen / totalRatio) * 100);
    }

    return counterRatios;
  }

  calculateTroopSpecificCounterRatios(): TroopBonuses {
    const p1Troops = this.getTroopCounts(this.player1);
    const p2Troops = this.getTroopCounts(this.player2);
    const p1Stats = this.player1.totalTroopStats();
    const p2Stats = this.player2.totalTroopStats();
    const [p1Bonus, p2Bonus] = this.calculateBonuses();

    return this.calculateCounterRatios(p1Troops, p2Troops, p1Stats, p2Stats, p1Bonus, p2Bonus);
  }

  calculateTroopSpecificCounterRatiosForPlayer2(): TroopBonuses {
    const p1Troops = this.getTroopCounts(this.player1);
    const p2Troops = this.getTroopCounts(this.player2);
    const p1Stats = this.player1.totalTroopStats();
    const p2Stats = this.player2.totalTroopStats();
    const [p1Bonus, p2Bonus] = this.calculateBonuses();

    return this.calculateCounterRatios(p2Troops, p1Troops, p2Stats, p1Stats, p2Bonus, p1Bonus);
  }

  private getTroopCounts(player: Player): TroopCounts {
    return Object.fromEntries(
      Object.entries(player.troops).map(([type, troop]) => [type, troop.count])
    ) as TroopCounts;
  }

  simulate() {
    const [p1Bonuses, p2Bonuses] = this.calculateBonuses();

    const p1DamageByType = this.calculateDamage(this.player1, this.player2, p1Bonuses, p2Bonuses);
    const p2DamageByType = this.calculateDamage(this.player2, this.player1, p2Bonuses, p1Bonuses);

    const p1CasualtiesByType = this.calculateCasualties(this.player1, p2DamageByType);
    const p2CasualtiesByType = this.calculateCasualties(this.player2, p1DamageByType);

    const p1PowerLoss = this.calculatePowerLoss(this.player1, p1CasualtiesByType);
    const p2PowerLoss = this.calculatePowerLoss(this.player2, p2CasualtiesByType);

    const p1RemainingPower = this.player1.totalTroopStats().power - p1PowerLoss;
    const p2RemainingPower = this.player2.totalTroopStats().power - p2PowerLoss;

    const winner =
      p1RemainingPower > p2RemainingPower ? `${this.player1.name} wins!` : `${this.player2.name} wins!`;

    const counterRatiosP1 = this.calculateTroopSpecificCounterRatios();
    const counterRatiosP2 = this.calculateTroopSpecificCounterRatiosForPlayer2();

    const p1Casualties = this.sumCasualties(p1CasualtiesByType);
    const p2Casualties = this.sumCasualties(p2CasualtiesByType);

    const p1TroopRatio = this.troopTypeRatio(this.player1);
    const p2TroopRatio = this.troopTypeRatio(this.player2);

    return this.generateBattleReport(
      winner,
      counterRatiosP1,
      counterRatiosP2,
      p1Casualties,
      p2Casualties,
      p1PowerLoss,
      p2PowerLoss,
      p1RemainingPower,
      p2RemainingPower,
      p1TroopRatio,
      p2TroopRatio
    );
  }

  private sumCasualties(
    casualtiesByType: {
      [key in TroopType]: { injured: number; lightlyInjured: number; survivors: number };
    }
  ) {
    let injured = 0;
    let lightlyInjured = 0;
    let survivors = 0;

    for (const troopType of ['Infantry', 'Lancer', 'Marksmen'] as TroopType[]) {
      injured += casualtiesByType[troopType]?.injured || 0;
      lightlyInjured += casualtiesByType[troopType]?.lightlyInjured || 0;
      survivors += casualtiesByType[troopType]?.survivors || 0;
    }

    return { injured, lightlyInjured, survivors };
  }

  private troopTypeRatio(player: Player) {
    const total = Object.values(player.troops).reduce((sum, troop) => sum + troop.count, 0);
    if (total === 0) return '0.00%:0.00%:0.00%';
    return Object.values(player.troops)
      .map((troop) => ((troop.count / total) * 100).toFixed(2) + '%')
      .join(':');
  }

  private generateBattleReport(
    winner: string,
    counterRatiosP1: TroopBonuses,
    counterRatiosP2: TroopBonuses,
    p1Casualties: { injured: number; lightlyInjured: number; survivors: number },
    p2Casualties: { injured: number; lightlyInjured: number; survivors: number },
    p1PowerLoss: number,
    p2PowerLoss: number,
    p1RemainingPower: number,
    p2RemainingPower: number,
    p1TroopRatio: string,
    p2TroopRatio: string
  ) {
    return `
    ===========================
           Battle Report
    ===========================

    Winner: ${winner}

    ---------------------------
    Counter Ratios during Battle
    ---------------------------
    ${this.player1.name} should use:
      - Infantry: ${counterRatiosP1.Infantry}%
      - Lancer: ${counterRatiosP1.Lancer}%
      - Marksmen: ${counterRatiosP1.Marksmen}%

    ${this.player2.name} should use:
      - Infantry: ${counterRatiosP2.Infantry}%
      - Lancer: ${counterRatiosP2.Lancer}%
      - Marksmen: ${counterRatiosP2.Marksmen}%

    ---------------------------
    ${this.player1.name}'s Troops
    ---------------------------
    Total Troops: ${Object.values(this.player1.troops).reduce((sum, troop) => sum + troop.count, 0)}
    Injured: ${p1Casualties.injured}
    Lightly Injured: ${p1Casualties.lightlyInjured}
    Survivors: ${p1Casualties.survivors}
    Power: ${this.player1.totalTroopStats().power}
    Power Loss: ${p1PowerLoss}
    Remaining Power: ${p1RemainingPower}
    Troop Type Ratio: ${p1TroopRatio}

    ---------------------------
    ${this.player2.name}'s Troops
    ---------------------------
    Total Troops: ${Object.values(this.player2.troops).reduce((sum, troop) => sum + troop.count, 0)}
    Injured: ${p2Casualties.injured}
    Lightly Injured: ${p2Casualties.lightlyInjured}
    Survivors: ${p2Casualties.survivors}
    Power: ${this.player2.totalTroopStats().power}
    Power Loss: ${p2PowerLoss}
    Remaining Power: ${p2RemainingPower}
    Troop Type Ratio: ${p2TroopRatio}

    ===========================
    `;
  }
}
