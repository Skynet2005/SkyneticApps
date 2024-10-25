// src/components/BattleResults.tsx

"use client"

import { useState } from 'react';
// @ts-expect-error: file-saver has no type definitions
import { saveAs } from 'file-saver';

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
  troopStats: Record<'Infantry' | 'Lancer' | 'Marksmen', TroopStats>;
  specialBonuses: Record<string, number>;
  troops: Record<'Infantry' | 'Lancer' | 'Marksmen', TroopData>;
}

interface BattleResultsProps {
  results: string;
  player1Data: PlayerData;
  player2Data: PlayerData;
}

export default function BattleResults({ results, player1Data, player2Data }: BattleResultsProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatPlayerData = (playerData: PlayerData, playerNumber: number) => {
    const troopTypes: Array<keyof PlayerData['troops']> = ['Infantry', 'Lancer', 'Marksmen'];
    let playerString = `
===========================
       Player ${playerNumber} Data
===========================

Name: ${playerData.name}

--- Troops ---
`;

    troopTypes.forEach((troopType) => {
      const troop = playerData.troops[troopType];
      playerString += `
${troopType}:
  Count: ${troop.count}
  Level: ${troop.level}
`;
    });

    playerString += `
--- Troop Stats ---
`;

    troopTypes.forEach((troopType) => {
      playerString += `
${troopType} Stats:
`;
      const stats = playerData.troopStats[troopType];
      Object.entries(stats).forEach(([statKey, value]) => {
        playerString += `  ${statKey}: ${value}\n`;
      });
    });

    playerString += `
--- Special Bonuses ---
`;
    Object.entries(playerData.specialBonuses).forEach(([bonusKey, value]) => {
      playerString += `  ${bonusKey}: ${value}\n`;
    });

    return playerString;
  };

  const saveReport = () => {
    const combinedReport = `
${results}

${formatPlayerData(player1Data, 1)}

${formatPlayerData(player2Data, 2)}

${explanation ? `--- Battle Explanation ---\n${explanation}` : ''}
`;

    const blob = new Blob([combinedReport], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'battle_report.txt');
  };

  const explainBattle = async () => {
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        alert('Please enter your OpenAI API key at the bottom of the page.');
        setIsLoading(false);
        return;
      }

      const prompt = `
You are given a battle report between two players in a strategy game.
Please analyze the battle and explain in detail why Player 1 (${player1Data.name}) ${results.includes('wins!') ? 'won' : 'lost'
        }.
Include factors such as troop composition, troop levels, troop stats, special bonuses, and any other relevant details.

Battle Report:
${results}

Player 1 Data:
${JSON.stringify(player1Data, null, 2)}

Player 2 Data:
${JSON.stringify(player2Data, null, 2)}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setExplanation(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlayerData = (playerData: PlayerData, playerNumber: number) => {
    const troopTypes: Array<keyof PlayerData['troops']> = ['Infantry', 'Lancer', 'Marksmen'];
    return (
      <>
        <h3 className="text-lg font-bold mb-2">Player {playerNumber}: {playerData.name}</h3>
        <h4 className="font-bold mb-2">Troops</h4>
        {troopTypes.map((troopType) => (
          <div key={troopType} className="mb-2">
            <h5 className="font-bold">{troopType}</h5>
            <div className="ml-4">
              Count: {playerData.troops[troopType].count}
            </div>
            <div className="ml-4">
              Level: {playerData.troops[troopType].level}
            </div>
          </div>
        ))}
        <h4 className="font-bold mb-2">Troop Stats</h4>
        {troopTypes.map((troopType) => (
          <div key={troopType} className="mb-2">
            <h5 className="font-bold">{troopType}</h5>
            {Object.entries(playerData.troopStats[troopType]).map(([statKey, value]) => (
              <div key={statKey} className="ml-4">
                {statKey}: {value}
              </div>
            ))}
          </div>
        ))}
        <h4 className="font-bold mb-2">Special Bonuses</h4>
        {Object.entries(playerData.specialBonuses).map(([bonusKey, value]) => (
          <div key={bonusKey} className="ml-4">
            {bonusKey}: {value}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="mt-4 bg-gray-100 p-4 rounded text-neutral-900">
      <h2 className="text-xl font-bold mb-2">Battle Results</h2>
      <pre className="whitespace-pre-wrap">{results}</pre>

      {explanation && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Battle Explanation</h2>
          <p>{explanation}</p>
        </div>
      )}

      <div className="mt-2 flex space-x-2">
        <button onClick={saveReport} className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Report
        </button>
        <button
          onClick={explainBattle}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Explain Battle'}
        </button>
      </div>

      <h2 className="text-xl font-bold mt-4 mb-2">Player Inputs</h2>
      {renderPlayerData(player1Data, 1)}
      {renderPlayerData(player2Data, 2)}
    </div>
  );
}
