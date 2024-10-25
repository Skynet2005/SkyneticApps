import { Poppins, Bungee_Shade } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { LoginButton } from "@/src/components/auth/login-button";
import RandomImageDisplay from "./(protected)/(routes)/_components/layout/random-image-display";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const skyneticFont = Bungee_Shade({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="relative flex flex-col h-full w-full items-center justify-center">
        <RandomImageDisplay />
        <Content />
      </div>
    </main>
  );
}

function Content() {
  return (
    <div className="absolute z-10 space-y-10 text-center px-8 py-12 max-w-3xl rounded-lg shadow-lg bg-black/70">
      <TextContent />
      <Title />
      <ActionSection />
    </div>
  );
}

function TextContent() {
  return (
    <>
      <p className="text-white text-3xl font-light leading-relaxed">
        Embark on a journey
      </p>
      <p className="text-white text-3xl font-light leading-relaxed">
        Through the treasure chest of
      </p>
      <p
        className={cn(
          "font-bold text-7xl text-red-500 animate-bounce",
          skyneticFont.className
        )}
      >
        Skynetic&apos;s
      </p>
      <p className="text-white text-3xl font-light leading-relaxed">
        Innovations!
      </p>
    </>
  );
}

function Title() {
  return (
    <h1
      className={cn(
        "text-5xl font-extrabold text-neutral-300 drop-shadow-2xl animate-pulse",
        font.className
      )}
    >
      🔐 Unlock Your Imagination
    </h1>
  );
}

function ActionSection() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <LoginButton asChild>
        <Button
          variant="default"
          size="lg"
          className="bg-red-700 px-10 py-5 border-4 border-black transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Dive In
        </Button>
      </LoginButton>
      <p className="text-lg text-white italic">
        Your adventure begins with a single click...
      </p>
    </div>
  );
}
