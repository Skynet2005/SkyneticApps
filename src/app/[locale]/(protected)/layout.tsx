import { Metadata } from "next";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import DashboardNavbar from "./(routes)/_components/layout/layout-navbar";
import RandomImageDisplay from "./(routes)/_components/layout/random-image-display";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Skynetic',
  description: 'A cutting-edge platform offering innovative tools designed to inspire creativity and ignite the imagination',
  icons: {
    icon: [{ url: "/logo.png" }],
  },
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    storageKey="skynetic-theme"
  >
    <div className="flex h-screen flex-col items-center justify-center bg-black/70">
      <div className="relative flex flex-col h-full w-full items-center justify-center">
        <RandomImageDisplay />
        <div className="absolute z-10 text-center pl-20 pr-[35px] m-2 rounded-lg shadow-lg overflow-y-auto h-full w-full">
          <DashboardNavbar />
          {children}
        </div>
      </div>
    </div>
  </ThemeProvider>
);

export default ProtectedLayout;
