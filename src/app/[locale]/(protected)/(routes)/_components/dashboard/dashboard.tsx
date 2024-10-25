"use client";

import { useEffect, useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { DroppableColumn } from './droppable-column';
import { Tool, rawTools } from './constants';

const useResponsiveColumns = (breakpoint = 400, mobileColumns = 2, desktopColumns = 4) => {
  const [numColumns, setNumColumns] = useState<number>(4);

  useEffect(() => {
    const handleResize = () => {
      setNumColumns(window.innerWidth <= breakpoint ? mobileColumns : desktopColumns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, mobileColumns, desktopColumns]);

  return numColumns;
};

export default function Dashboard() {
  const numColumns = useResponsiveColumns();
  const [tools, setTools] = useState<Tool[][]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ col: number; row: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumns = useCallback((): Tool[][] => {
    if (!rawTools?.length) return Array(numColumns).fill([]);

    const columns: Tool[][] = Array.from({ length: numColumns }, () => []);
    rawTools.forEach((tool, index) => {
      if (tool) {
        columns[index % numColumns].push(tool);
      }
    });
    return columns;
  }, [numColumns]);

  useEffect(() => {
    setTools(getColumns());
  }, [numColumns, getColumns]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) {
      setDropTarget(null);
      return;
    }

    const overId = event.over.id.toString();

    if (overId.startsWith('column-')) {
      const colIndex = parseInt(overId.split('-')[1]);
      setDropTarget({ col: colIndex, row: 0 });
      return;
    }

    const [overColIndex, overRowIndex] = overId.split('-').map(Number);
    setDropTarget({ col: overColIndex, row: overRowIndex });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDropTarget(null);

    if (!over || !active) return;

    const [activeColIndex, activeIndex] = active.id.toString().split('-').map(Number);

    if (over.id.toString().startsWith('column-')) {
      const targetColIndex = parseInt(over.id.toString().split('-')[1]);

      setTools((prevTools) => {
        const newTools = [...prevTools];
        const sourceColumn = [...newTools[activeColIndex]];
        const [movedItem] = sourceColumn.splice(activeIndex, 1);

        if (movedItem) {
          newTools[activeColIndex] = sourceColumn;
          newTools[targetColIndex] = [movedItem];
        }

        return newTools;
      });
      return;
    }

    const [overColIndex, overIndex] = over.id.toString().split('-').map(Number);

    setTools((prevTools) => {
      const newTools = [...prevTools];

      if (activeColIndex === overColIndex) {
        newTools[activeColIndex] = arrayMove(
          newTools[activeColIndex],
          activeIndex,
          overIndex
        );
      } else {
        const sourceColumn = [...newTools[activeColIndex]];
        const destColumn = [...newTools[overColIndex]];

        const [movedItem] = sourceColumn.splice(activeIndex, 1);
        if (movedItem) {
          destColumn.splice(overIndex, 0, movedItem);

          newTools[activeColIndex] = sourceColumn;
          newTools[overColIndex] = destColumn;
        }
      }

      return newTools;
    });
  };

  const renderColumns = () => (
    tools.map((column, colIndex) => (
      <DroppableColumn
        key={colIndex}
        id={`column-${colIndex}`}
        items={column}
        index={colIndex}
        dropTarget={dropTarget}
        getItemCount={() => tools.reduce((acc, col) => acc + col.length, 0)}
      >
        <SortableContext
          items={column.map((_, index) => `${colIndex}-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {column.map((tool, index) => (
              <div key={`${colIndex}-${index}`} className="relative">
                {dropTarget?.col === colIndex && dropTarget?.row === index && (
                  <div className="absolute inset-0 -m-1 rounded-xl bg-blue-500/25 pointer-events-none z-10">
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                      {index + 1}/{tools.reduce((acc, col) => acc + col.length, 0)}
                    </div>
                  </div>
                )}
                <SortableItem
                  id={`${colIndex}-${index}`}
                  tool={tool}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DroppableColumn>
    ))
  );

  return (
    <div className="flex flex-row items-start justify-center w-full gap-4 p-4" style={{ colorScheme: "dark" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {renderColumns()}
      </DndContext>
    </div>
  );
}
