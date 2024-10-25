"use client";

import { useDroppable } from "@dnd-kit/core";
import { Tool } from "./constants";

interface DroppableColumnProps {
  id: string;
  items: Tool[];
  index: number;
  children: React.ReactNode;
  dropTarget: { col: number; row: number } | null;
  getItemCount: () => number;
}

export function DroppableColumn({
  id,
  items,
  children,
  dropTarget,
  index,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const getItemCount = () => items.length;

  const isEmpty = items.length === 0;
  const isDropTarget = dropTarget?.col === index;

  const containerClasses = `
    flex-1 min-h-[400px] rounded-lg p-2 relative
    ${isEmpty ? 'border-2 border-dashed border-gray-300/25' : ''}
    bg-gray-500/25 dark:bg-gray-800/25
    ${isOver && isEmpty ? 'bg-blue-500/25' : ''}
  `;

  return (
    <div ref={setNodeRef} className={containerClasses}>
      {isEmpty && isDropTarget && (
        <div className="absolute inset-0 -m-1 rounded-xl bg-blue-500/25 pointer-events-none z-10">
          <div className="absolute top-2 right-2 bg-blue-900 text-white px-2 py-1 rounded-md text-sm">
            1/{getItemCount()}
          </div>
        </div>
      )}
      {children}
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400/25">
          Drop here
        </div>
      )}
    </div>
  );
}
