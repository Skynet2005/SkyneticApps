import BattleSimulator from "../_components/battle-simulator/BattleSimulator";
import { routing } from '@/src/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BattleSimulatorPage = () => (
  <BattleSimulator />
);

export default BattleSimulatorPage;
