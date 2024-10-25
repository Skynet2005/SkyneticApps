"use client";

import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { rawTools } from "../dashboard/constants";

const BattleSimulatorNavbar = ({ locale }: { locale: string }) => {
  const t = useTranslations("NavbarLinks");
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as string;
    const path = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${path}`);
  };

  const battleSimulatorIcon = rawTools.find(tool => tool.label === 'Battle Simulator')?.route;

  return (
    <div className="w-full flex justify-between py-4 items-center">
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center text-red-600 tracking-widest space-x-4">
          {battleSimulatorIcon && (
            <img
              src={battleSimulatorIcon}
              alt="Battle Simulator Icon"
              className="w-10 h-10"
            />
          )}
          <span className="px-2">Battle Simulator</span>
          {battleSimulatorIcon && (
            <img
              src={battleSimulatorIcon}
              alt="Battle Simulator Icon"
              className="w-10 h-10"
            />
          )}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={locale}
          onChange={handleLanguageChange}
          className="rounded-lg px-3 py-2 bg-neutral-200 text-neutral-800 transition duration-300 ease-in-out transform hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 shadow-md"
        >
          {["en", "fr", "de", "pt", "es", "tr"].map((lang) => (
            <option
              key={lang}
              value={lang}
              className="block px-4 py-2 bg-neutral-200 text-neutral-800 hover:bg-neutral-900"
            >
              {t(`language.${lang}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BattleSimulatorNavbar;
