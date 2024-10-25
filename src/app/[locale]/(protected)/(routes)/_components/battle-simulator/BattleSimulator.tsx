"use client";

import { useState, useEffect } from 'react';
import PlayerInput from './PlayerInput';
import BattleResults from './BattleResults';
import { Player } from './models/Player';
import { Battle } from './models/Battle';
import { Infantry, Lancer, Marksmen } from './models/Troop';
import { useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";

// Interfaces
interface TroopStats {
  attack: number;
  defense: number;
  lethality: number;
  health: number;
}

interface TroopData {
  count: number;
  level: string;
}

interface PlayerData {
  name: string;
  troopStats: {
    Infantry: TroopStats;
    Lancer: TroopStats;
    Marksmen: TroopStats;
  };
  specialBonuses: { [key: string]: number };
  troops: {
    Infantry: TroopData;
    Lancer: TroopData;
    Marksmen: TroopData;
  };
}

type Messages = {
  NavbarLinks: {
    profileTitle: string;
  };
};

// Metadata generation
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages: Messages = await getMessages({ locale }) as Messages;
  const title = messages.NavbarLinks.profileTitle;
  return { title };
}

const BattleSimulator = () => {
  const t = useTranslations("BattleSimulator");

  // State management
  const [apiKey, setApiKey] = useState<string>('');
  const [isDarkMode] = useState(false);

  // Player 1 state
  const [player1Name, setPlayer1Name] = useState('');
  const [player1InfantryCount, setPlayer1InfantryCount] = useState(0);
  const [player1InfantryPercentage, setPlayer1InfantryPercentage] = useState<number | null>(null);
  const [player1LancerCount, setPlayer1LancerCount] = useState(0);
  const [player1LancerPercentage, setPlayer1LancerPercentage] = useState<number | null>(null);
  const [player1MarksmenCount, setPlayer1MarksmenCount] = useState(0);
  const [player1MarksmenPercentage, setPlayer1MarksmenPercentage] = useState<number | null>(null);
  const [totalTroopsPlayer1, setTotalTroopsPlayer1] = useState<number | null>(null);
  const [player1InfantryLevel, setPlayer1InfantryLevel] = useState('T10');
  const [player1LancerLevel, setPlayer1LancerLevel] = useState('T10');
  const [player1MarksmenLevel, setPlayer1MarksmenLevel] = useState('T10');
  const [player1SpecialBonuses, setPlayer1SpecialBonuses] = useState({
    troops_attack: 20,
    troops_defense: 20,
    troops_lethality: 20,
    troops_health: 20,
    enemy_troops_attack: -20,
    enemy_troops_defense: -20,
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
  });
  const [player1TroopStats, setPlayer1TroopStats] = useState({
    Infantry: { attack: 0, defense: 0, lethality: 0, health: 0 },
    Lancer: { attack: 0, defense: 0, lethality: 0, health: 0 },
    Marksmen: { attack: 0, defense: 0, lethality: 0, health: 0 },
  });
  const [player1UsePercentage, setPlayer1UsePercentage] = useState(false);

  // Player 2 state
  const [player2Name, setPlayer2Name] = useState('');
  const [player2InfantryCount, setPlayer2InfantryCount] = useState(0);
  const [player2InfantryPercentage, setPlayer2InfantryPercentage] = useState<number | null>(null);
  const [player2LancerCount, setPlayer2LancerCount] = useState(0);
  const [player2LancerPercentage, setPlayer2LancerPercentage] = useState<number | null>(null);
  const [player2MarksmenCount, setPlayer2MarksmenCount] = useState(0);
  const [player2MarksmenPercentage, setPlayer2MarksmenPercentage] = useState<number | null>(null);
  const [totalTroopsPlayer2, setTotalTroopsPlayer2] = useState<number | null>(null);
  const [player2InfantryLevel, setPlayer2InfantryLevel] = useState('T10');
  const [player2LancerLevel, setPlayer2LancerLevel] = useState('T10');
  const [player2MarksmenLevel, setPlayer2MarksmenLevel] = useState('T10');
  const [player2SpecialBonuses, setPlayer2SpecialBonuses] = useState({
    troops_attack: 20,
    troops_defense: 20,
    troops_lethality: 20,
    troops_health: 20,
    enemy_troops_attack: -20,
    enemy_troops_defense: -20,
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
  });
  const [player2TroopStats, setPlayer2TroopStats] = useState({
    Infantry: { attack: 0, defense: 0, lethality: 0, health: 0 },
    Lancer: { attack: 0, defense: 0, lethality: 0, health: 0 },
    Marksmen: { attack: 0, defense: 0, lethality: 0, health: 0 },
  });
  const [player2UsePercentage, setPlayer2UsePercentage] = useState(false);

  // Battle results state
  const [battleResults, setBattleResults] = useState<string>('');
  const [player1Data, setPlayer1Data] = useState<PlayerData | null>(null);
  const [player2Data, setPlayer2Data] = useState<PlayerData | null>(null);

  // Effects
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Handlers
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  const calculateTroopCounts = (percentage: number | null, totalTroops: number | null): number => {
    return percentage !== null && totalTroops !== null ? Math.round((percentage / 100) * totalTroops) : 0;
  };

  const handleSimulateBattle = () => {
    const player1InfantryActualCount = player1UsePercentage
      ? calculateTroopCounts(player1InfantryPercentage, totalTroopsPlayer1)
      : player1InfantryCount;

    const player1LancerActualCount = player1UsePercentage
      ? calculateTroopCounts(player1LancerPercentage, totalTroopsPlayer1)
      : player1LancerCount;

    const player1MarksmenActualCount = player1UsePercentage
      ? calculateTroopCounts(player1MarksmenPercentage, totalTroopsPlayer1)
      : player1MarksmenCount;

    const player2InfantryActualCount = player2UsePercentage
      ? calculateTroopCounts(player2InfantryPercentage, totalTroopsPlayer2)
      : player2InfantryCount;

    const player2LancerActualCount = player2UsePercentage
      ? calculateTroopCounts(player2LancerPercentage, totalTroopsPlayer2)
      : player2LancerCount;

    const player2MarksmenActualCount = player2UsePercentage
      ? calculateTroopCounts(player2MarksmenPercentage, totalTroopsPlayer2)
      : player2MarksmenCount;

    const player1 = new Player(
      player1Name,
      {
        Infantry: new Infantry(
          player1InfantryLevel,
          player1InfantryActualCount,
          player1TroopStats.Infantry
        ),
        Lancer: new Lancer(
          player1LancerLevel,
          player1LancerActualCount,
          player1TroopStats.Lancer
        ),
        Marksmen: new Marksmen(
          player1MarksmenLevel,
          player1MarksmenActualCount,
          player1TroopStats.Marksmen
        ),
      },
      player1SpecialBonuses
    );

    const player2 = new Player(
      player2Name,
      {
        Infantry: new Infantry(
          player2InfantryLevel,
          player2InfantryActualCount,
          player2TroopStats.Infantry
        ),
        Lancer: new Lancer(
          player2LancerLevel,
          player2LancerActualCount,
          player2TroopStats.Lancer
        ),
        Marksmen: new Marksmen(
          player2MarksmenLevel,
          player2MarksmenActualCount,
          player2TroopStats.Marksmen
        ),
      },
      player2SpecialBonuses
    );

    if (player1 && player2) {
      const battle = new Battle(player1, player2);
      const results = battle.simulate();
      setBattleResults(results);

      // Create player1Data and player2Data
      const player1Data: PlayerData = {
        name: player1Name,
        troopStats: player1TroopStats,
        specialBonuses: player1SpecialBonuses,
        troops: {
          Infantry: {
            count: player1InfantryActualCount,
            level: player1InfantryLevel,
          },
          Lancer: {
            count: player1LancerActualCount,
            level: player1LancerLevel,
          },
          Marksmen: {
            count: player1MarksmenActualCount,
            level: player1MarksmenLevel,
          },
        },
      };

      const player2Data: PlayerData = {
        name: player2Name,
        troopStats: player2TroopStats,
        specialBonuses: player2SpecialBonuses,
        troops: {
          Infantry: {
            count: player2InfantryActualCount,
            level: player2InfantryLevel,
          },
          Lancer: {
            count: player2LancerActualCount,
            level: player2LancerLevel,
          },
          Marksmen: {
            count: player2MarksmenActualCount,
            level: player2MarksmenLevel,
          },
        },
      };

      // Set the state
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
    }
  };

  return (
    <div className="w-full max-w-4xl text-neutral-900 mx-auto mt-15">
      <div className="mt-8 p-4 bg-gray-100 rounded mb-4">
        <h2 className="text-xl font-bold mb-2">{t('apiKeyTitle')}</h2>
        <p>
          {t('apiKeyDescription')} <a href="https://platform.openai.com/settings/profile?tab=api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{t('apiKeyLinkText')}</a>
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="w-full p-2 border rounded mt-2 bg-input"
          placeholder={t('apiKeyPlaceholder')}
        />
      </div>
      <div className="flex gap-4 mb-4 justify-center">
        <PlayerInput
          playerNumber={1}
          name={player1Name}
          setName={setPlayer1Name}
          infantryCount={player1InfantryCount}
          setInfantryCount={setPlayer1InfantryCount}
          infantryPercentage={player1InfantryPercentage}
          setInfantryPercentage={setPlayer1InfantryPercentage}
          lancerCount={player1LancerCount}
          setLancerCount={setPlayer1LancerCount}
          lancerPercentage={player1LancerPercentage}
          setLancerPercentage={setPlayer1LancerPercentage}
          marksmenCount={player1MarksmenCount}
          setMarksmenCount={setPlayer1MarksmenCount}
          marksmenPercentage={player1MarksmenPercentage}
          setMarksmenPercentage={setPlayer1MarksmenPercentage}
          totalTroops={totalTroopsPlayer1}
          setTotalTroops={setTotalTroopsPlayer1}
          infantryLevel={player1InfantryLevel}
          setInfantryLevel={setPlayer1InfantryLevel}
          lancerLevel={player1LancerLevel}
          setLancerLevel={setPlayer1LancerLevel}
          marksmenLevel={player1MarksmenLevel}
          setMarksmenLevel={setPlayer1MarksmenLevel}
          specialBonuses={player1SpecialBonuses}
          setSpecialBonuses={(bonuses) =>
            setPlayer1SpecialBonuses((prev) => ({ ...prev, ...bonuses }))
          }
          troopStats={player1TroopStats}
          setTroopStats={(stats) => setPlayer1TroopStats((prev) => ({ ...prev, ...stats }))}
          usePercentage={player1UsePercentage}
          setUsePercentage={setPlayer1UsePercentage}
          isDarkMode={isDarkMode} // Added isDarkMode prop
        />
        <PlayerInput
          playerNumber={2}
          name={player2Name}
          setName={setPlayer2Name}
          infantryCount={player2InfantryCount}
          setInfantryCount={setPlayer2InfantryCount}
          infantryPercentage={player2InfantryPercentage}
          setInfantryPercentage={setPlayer2InfantryPercentage}
          lancerCount={player2LancerCount}
          setLancerCount={setPlayer2LancerCount}
          lancerPercentage={player2LancerPercentage}
          setLancerPercentage={setPlayer2LancerPercentage}
          marksmenCount={player2MarksmenCount}
          setMarksmenCount={setPlayer2MarksmenCount}
          marksmenPercentage={player2MarksmenPercentage}
          setMarksmenPercentage={setPlayer2MarksmenPercentage}
          totalTroops={totalTroopsPlayer2}
          setTotalTroops={setTotalTroopsPlayer2}
          infantryLevel={player2InfantryLevel}
          setInfantryLevel={setPlayer2InfantryLevel}
          lancerLevel={player2LancerLevel}
          setLancerLevel={setPlayer2LancerLevel}
          marksmenLevel={player2MarksmenLevel}
          setMarksmenLevel={setPlayer2MarksmenLevel}
          specialBonuses={player2SpecialBonuses}
          setSpecialBonuses={(bonuses) =>
            setPlayer2SpecialBonuses((prev) => ({ ...prev, ...bonuses }))
          }
          troopStats={player2TroopStats}
          setTroopStats={(stats) => setPlayer2TroopStats((prev) => ({ ...prev, ...stats }))}
          usePercentage={player2UsePercentage}
          setUsePercentage={setPlayer2UsePercentage}
          isDarkMode={isDarkMode} // Added isDarkMode prop
        />
      </div>
      <div className="flex justify-between gap-4 mb-4">
        <button
          className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSimulateBattle}
        >
          {t('simulateBattle')}
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          {t('explainBattle')}
        </button>
        <button className="bg-blue-700 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          {t('saveReport')}
        </button>
      </div>
      {battleResults && player1Data && player2Data && (
        <BattleResults
          results={battleResults}
          player1Data={player1Data}
          player2Data={player2Data}
        />
      )}
    </div>
  );
};

export default BattleSimulator;
