// app/(dashboard)/layout.tsx
import { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { cn } from "@/src/lib/utils";
import Quote from '../_components/dashboard/quotes/quotes';

export const metadata: Metadata = {
  title: 'Skynetic',
  description: 'Shattering the usual, Skynetic creates a powerful synthesis of motion and abstract ideation under the infinite digital sky.',
};

const poppins = Montserrat({ weight: '600', subsets: ['latin'] });

const Hero = () => (
  <div className={cn("flex flex-col w-full md:w-auto bg-neutral-400/75 dark:bg-neutral-900/75 rounded-full p-4", poppins.className)}>
    <h2 className="lg:text-4xl md:text-2xl sm:text-xl xs:text-md font-bold text-sky-950 dark:text-neutral-100 text-center">
      Innovate with Skynetics Apps
    </h2>
    <div className="bg-transparent">
      <Quote />
    </div>
    <p className="text-neutral-100 dark:text-neutral-400 font-light text-sm md:text-lg text-center">
      Transcend the ordinary and make it happen!
    </p>
  </div>
);

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center w-full h-screen overflow-x-hidden">
    <main className="flex flex-col items-center justify-center w-full md:w-fit h-full">
      <Hero />
      {children}
    </main>
  </div>
);

export default DashboardLayout;
