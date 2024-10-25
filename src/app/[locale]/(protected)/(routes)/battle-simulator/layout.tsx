import { Metadata } from "next";
import BattleSimulatorNavbar from "../_components/battle-simulator/BattleSimulatorNavbar";

interface BattleSimulatorLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export const metadata: Metadata = {
  title: 'Skynetic',
  description: 'A cutting-edge platform offering innovative tools designed to inspire creativity and ignite the imagination',
  icons: {
    icon: [{ url: "/logo.png" }],
  },
};

const BattleSimulatorLayout = ({ children, locale }: BattleSimulatorLayoutProps) => (
  <div className="flex h-screen flex-col items-center justify-center mt-20">
    <div className="absolute z-10 text-center pl-20 pr-[35px] m-2 rounded-lg shadow-lg overflow-y-auto h-full w-full">
      <BattleSimulatorNavbar locale={locale} />
      {children}
    </div>
  </div>
);

export default BattleSimulatorLayout;
