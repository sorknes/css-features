"use client";

import { useEffect, useRef, useState } from "react";
import { BiSearch, BiFilterAlt, BiX } from "react-icons/bi";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import {
  PRODUCTION_READY_MIN_USAGE,
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_STYLES,
  type SupportLevel,
} from "@/lib/supportLevel";

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
  newCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onClearAll: () => void;
  resultCount: number;
}

// An option that would lead to zero results is disabled, unless it's already
// selected (it must stay clickable so it can be turned off again).
const OPTION_ROW =
  "flex min-h-11 w-full items-center py-1.5 text-left text-sm font-medium enabled:hover:bg-surface disabled:cursor-not-allowed";

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
  newCount,
  search,
  onSearchChange,
  activeFilterCount,
  onClearAll,
  resultCount,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Keep Tab focus inside the open drawer, since the page behind it is covered by the overlay.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, input");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-sm font-medium"
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

      {/* Below lg this is an off-canvas drawer: hidden (and out of the tab order) while closed,
          a modal dialog while open. At lg and up it's the always-visible sidebar. */}
      <div
        ref={panelRef}
        id="filter-panel"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-label={isOpen ? "Filters" : undefined}
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-y-auto bg-paper pt-8 pr-6 pb-0 pl-4 lg:pb-4 duration-200 lg:visible lg:top-[91px] lg:bottom-auto lg:left-6 lg:z-auto lg:h-[calc(100vh-91px)] lg:w-72 lg:shrink-0 lg:border-r lg:border-border lg:bg-transparent lg:pl-2 lg:transition-none lg:translate-x-0 ${
          // Visibility only transitions on close (so the slide-out still plays); on open it must flip
          // immediately or the close button can't take focus.
          isOpen ? "visible translate-x-0 transition-[translate]" : "invisible -translate-x-full transition-[translate,visibility]"
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
                className="w-full rounded-md border border-border py-2 pr-3 pl-9 text-sm placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-bold">New examples</p>
            <div className="flex flex-col divide-y divide-border">
              <button
                type="button"
                aria-pressed={newOnly}
                disabled={!newOnly && newCount === 0}
                onClick={() => onNewOnlyChange(!newOnly)}
                className={OPTION_ROW}
              >
                <span
                  className={`rounded-full px-3 py-1 ${
                    newOnly ? "bg-accent text-accent-foreground" : newCount === 0 ? "text-muted" : "text-foreground"
                  }`}
                >
                  Show new only
                </span>
                <span className="ml-auto pr-3 text-xs text-muted">{newCount}</span>
              </button>
            </div>
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
                    disabled={!isSelected && count === 0}
                    onClick={() => onToggleCategory(category.value)}
                    className={OPTION_ROW}
                  >
                    <span
                      className={`rounded-full px-3 py-1 ${
                        isSelected ? "bg-accent text-accent-foreground" : count === 0 ? "text-muted" : "text-foreground"
                      }`}
                    >
                      {category.label}
                    </span>
                    <span className="ml-auto pr-3 text-xs text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset aria-describedby="support-level-help">
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
            <p id="support-level-help" className="mb-2 text-xs text-muted">
              Production ready means full support in Chrome, Edge, Firefox and Safari, on browsers used by at least{" "}
              {PRODUCTION_READY_MIN_USAGE}% of people. A dashed browser chip means partial support.
            </p>
            <div className="flex flex-col divide-y divide-border">
              {SUPPORT_LEVELS.map((level) => {
                const isSelected = selectedSupportLevels.has(level.value);
                const count = supportLevelCounts[level.value] ?? 0;
                return (
                  <button
                    key={level.value}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={!isSelected && count === 0}
                    onClick={() => onToggleSupportLevel(level.value)}
                    className={OPTION_ROW}
                  >
                    <span
                      className={`rounded-full px-3 py-1 ${
                        isSelected ? SUPPORT_LEVEL_STYLES[level.value] : count === 0 ? "text-muted" : "text-foreground"
                      }`}
                    >
                      {level.label}
                    </span>
                    <span className="ml-auto pr-3 text-xs text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Filters apply live behind the drawer; this footer shows the result and closes it. */}
        <div className="sticky bottom-0 -mr-6 -ml-4 flex items-center gap-3 border-t border-border bg-paper px-4 pt-3 pb-4 lg:hidden">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="ml-auto inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
          >
            {resultCount === 0 ? "No examples to show" : `Show ${resultCount} example${resultCount === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </>
  );
}
