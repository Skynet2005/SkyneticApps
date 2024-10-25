import { Poppins } from "next/font/google";
import { cn } from "@/src/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header: React.FC<HeaderProps> = ({ label }) => (
  <div className="w-full flex flex-col gap-y-4 items-center justify-center">
    <h1 className={cn("text-3xl font-semibold", font.className)}>
      <span className="bg-neutral-500 bg-opacity-75 p-1 rounded">🔐</span> Skynetic Applications
    </h1>
    <p className="text-muted-foreground text-sm">{label}</p>
  </div>
);
