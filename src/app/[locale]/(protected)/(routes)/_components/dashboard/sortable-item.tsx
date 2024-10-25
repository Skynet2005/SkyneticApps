"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tool } from "./constants";

interface SortableItemProps {
  id: string;
  tool?: Tool;
}

export function SortableItem({ id, tool }: SortableItemProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tool) {
      router.push(tool.href);
    }
  };

  const renderPlaceholder = () => (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
      {...attributes}
      {...listeners}
    />
  );

  const renderTool = () => (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-full flex flex-col justify-center items-center p-6
        ${tool?.bgColor || 'bg-gray-100'} ${tool?.color || 'text-gray-900'}
        ${isDragging ? 'shadow-xl ring-2 ring-primary/50 z-50' : ''}
        rounded-xl transition-all duration-200
      `}
      {...attributes}
    >
      <div
        {...listeners}
        className={`
          cursor-move p-2 mb-2 w-20 h-20
          flex justify-center items-center
          border-2 border-neutral-300 rounded-xl
          ${tool?.bgColor || 'bg-gray-100'} ${tool?.color || 'text-gray-900'}
          hover:scale-105 transition-transform duration-200
        `}
      >
        <Image
          src={tool?.route || '/placeholder.png'}
          alt={tool?.label || 'Tool'}
          width={60}
          height={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority={id.endsWith('-0') || id.endsWith('-1')}
        />
      </div>

      <button
        onClick={handleNavigation}
        className={`
          mt-4 text-center font-bold
          ${(tool?.label?.length || 0) > 20 ? "text-sm" : "text-lg"}
          hover:underline focus:outline-none focus:ring-2
          focus:ring-primary/50 rounded-md
        `}
      >
        {tool?.label || 'Untitled'}
      </button>
    </div>
  );

  return tool ? renderTool() : renderPlaceholder();
}
