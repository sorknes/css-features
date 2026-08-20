"use client";

import { useEffect, useRef, useState } from "react";
import { BiSearch, BiFilterAlt, BiX } from "react-icons/bi";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { SUPPORT_LEVELS, SUPPORT_LEVEL_STYLES, type SupportLevel } from "@/lib/supportLevel";

interface FilterBarProps {
  selectedCategories: Set<Category>;
  onToggleCategory: (category: Category) => void;
  onClearCategories: () => void;
  categoryCounts: Partial<Record<Category, number>>;
  selectedSupportLevels: Set<SupportLevel>;
  onToggleSupportLevel: (level: SupportLevel) => void;
  onClearSupportLevels: () => void;
  supportLevelCounts: Partial<Record<SupportLevel, number>>;
  newOnly: boolean;
  onNewOnlyChange: (value: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  categoryCounts,
  selectedSupportLevels,
  onToggleSupportLevel,
  onClearSupportLevels,
  supportLevelCounts,
  newOnly,
  onNewOnlyChange,
  search,
  onSearchChange,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const activeFilterCount =
    selectedCategories.size + selectedSupportLevels.size + (newOnly ? 1 : 0) + (search.trim() ? 1 : 0);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="mb-4 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="filter-panel"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium"
        >
          <BiFilterAlt aria-hidden="true" className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        id="filter-panel"
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-y-auto bg-white pt-6 pr-6 pb-4 pl-4 transition-transform duration-200 lg:top-[121px] lg:bottom-auto lg:left-6 lg:z-auto lg:h-[calc(100vh-121px)] lg:w-72 lg:shrink-0 lg:border-r lg:border-border lg:bg-transparent lg:pl-0 lg:transition-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-sm font-bold">Filters</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
          >
            <BiX aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-8 pb-4">
          <div>
            <label htmlFor="example-search" className="mb-1.5 block text-sm font-bold">
              Search examples
            </label>
            <div className="relative w-full">
              <BiSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="example-search"
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="e.g. subgrid, has(), container queries…"
                className="w-full rounded-md border border-border py-2 pr-3 pl-9 text-sm focus-visible:outline-2 focus-visible:outline-accent"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-bold">New examples</p>
            <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={(e) => onNewOnlyChange(e.target.checked)}
                className="h-5 w-5 rounded border-border accent-accent"
              />
              Show new only
            </label>
          </div>

          <fieldset>
            <div className="mb-1.5 flex items-center justify-between">
              <legend className="text-sm font-bold">Category</legend>
              {selectedCategories.size > 0 && (
                <button
                  type="button"
                  onClick={onClearCategories}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Clear categories
                </button>
              )}
            </div>
            <div className="flex flex-col divide-y divide-border">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.has(category.value);
                const count = categoryCounts[category.value] ?? 0;
                return (
                  <button
                    key={category.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onToggleCategory(category.value)}
                    className="flex min-h-11 w-full items-center py-1.5 text-left text-sm font-medium hover:bg-surface"
                  >
                    <span
                      className={`rounded-full px-3 py-1 ${
                        isSelected ? "bg-accent text-accent-foreground" : "text-foreground"
                      }`}
                    >
                      {category.label}
                    </span>
                    <span className="ml-auto pr-1 text-xs text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <div className="mb-1.5 flex items-center justify-between">
              <legend className="text-sm font-bold">Browser support</legend>
              {selectedSupportLevels.size > 0 && (
                <button
                  type="button"
                  onClick={onClearSupportLevels}
                  className="text-xs font-medium text-accent underline-offset-2 hover:underline"
                >
                  Clear browser support
                </button>
              )}
            </div>
            <div className="flex flex-col divide-y divide-border">
              {SUPPORT_LEVELS.map((level) => {
                const isSelected = selectedSupportLevels.has(level.value);
                const count = supportLevelCounts[level.value] ?? 0;
                return (
                  <button
                    key={level.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onToggleSupportLevel(level.value)}
                    className="flex min-h-11 w-full items-center py-1.5 text-left text-sm font-medium hover:bg-surface"
                  >
                    <span
                      className={`rounded-full px-3 py-1 ${
                        isSelected ? SUPPORT_LEVEL_STYLES[level.value] : "text-foreground"
                      }`}
                    >
                      {level.label}
                    </span>
                    <span className="ml-auto pr-1 text-xs text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
