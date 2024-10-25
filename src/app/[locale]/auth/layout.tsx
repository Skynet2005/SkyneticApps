import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600/60 to-black/90">
    <div className="relative flex flex-col h-full w-full items-center justify-center">
      <div className="absolute z-10 space-y-10 text-center px-8 py-12 max-w-3xl bg-black/70 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  </main>
);

export default AuthLayout;
