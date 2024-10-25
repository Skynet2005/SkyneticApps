"use client";

import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/src/lib/utils";
import { SidePaths } from "./sidebar-constants";
import { UserButton } from "@/src/components/auth/user-button";
import { Button } from "@/src/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState(
    Object.keys(SidePaths).reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && !isSidebarCollapsed) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLinkClick = () => {
    if (!isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  };

  const renderCategoryButton = (category: string) => (
    <button
      onClick={() => toggleSection(category)}
      className="text-sm font-medium cursor-pointer hover:text-white hover:rounded-xl hover:bg-white/10 rounded-xl transition w-full text-left p-2"
      title={category}
    >
      <span className={cn(collapsedSections[category] ? "text-red-500" : "text-green-500", "font-bold text-lg")}>
        {collapsedSections[category] ? '-' : '+'}
      </span>
      {!isSidebarCollapsed && category}
    </button>
  );

  const renderToolLink = (tool: any) => (
    <Link
      key={tool.href}
      href={tool.href}
      className={cn(
        "text-sm group flex p-3 pl-2 pr-2 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-md transition",
        pathname === tool.href ? "text-white bg-white/10" : "text-zinc-400",
      )}
      title={tool.label}
      onClick={handleLinkClick}
    >
      <div className="flex items-center flex-1">
        <Image
          alt={tool.label}
          src={tool.route}
          className={cn("h-5 w-5 mr-3 rounded-xl", tool.color)}
          sizes="(max-width: 768px) 100vw"
          width={100} height={100}
        />
        {!isSidebarCollapsed && tool.label}
      </div>
    </Link>
  );

  return (
    <div ref={sidebarRef} className={cn("fixed pl-2 pr-2 top-0 pt-2 left-0 flex flex-col h-screen bg-neutral-900 text-white transition-width duration-300 border", isSidebarCollapsed ? "w-16" : "w-72")}>
      <div className="flex flex-col">
        <Button variant="ghost" size="icon" className="p-1" onClick={toggleSidebar}>
          <Menu />
        </Button>
        <div className="space-y-4 pl-1 pr-1 mt-4">
          <UserButton />
          {Object.entries(SidePaths).map(([category, tools]) => (
            <div key={category}>
              {renderCategoryButton(category)}
              {!collapsedSections[category] && (
                <div className="pl-2">
                  {tools.map(renderToolLink)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
