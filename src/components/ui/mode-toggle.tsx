"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const iconSrc = isDark ? "/navbar/moon.png" : "/navbar/sun.png";
  const iconAlt = isDark ? "moon" : "sun";

  return (
    <button onClick={toggleTheme} className="focus:outline-none">
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={30}
        height={10}
        sizes="(max-width: 600px) 60vw, 200px (max-height: 600px) 60vw, 200px"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
