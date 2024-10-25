import { Navbar } from "./_components/profile-navbar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => (
  <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600/60 to-black/90">
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute flex flex-col space-y-10 text-center p-4 max-w-3xl bg-black/70 rounded-lg shadow-lg">
        <Navbar />
        {children}
      </div>
    </div>
  </div>
);

export default ProfileLayout;
