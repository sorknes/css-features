"use client";

import { useEffect, useRef, useState } from "react";
import { BiSearch, BiFilterAlt, BiRightArrowAlt, BiX } from "react-icons/bi";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { PRODUCTION_READY_MIN_USAGE, SUPPORT_LEVEL_STYLES, type SupportLevel } from "@/lib/supportLevel";

interface FilterBarProps {
  selectedCategories: Set<Category>;
  onToggleCategory: (category: Category) => void;
  onClearCategories: () => void;
  categoryCounts: Partial<Record<Category, number>>;
  selectedSupportLevels: Set<SupportLevel>;
  onToggleSupportLevel: (level: SupportLevel) => void;
  onClearSupportLevels: () => void;
  supportLevels: { value: SupportLevel; label: string }[];
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

/**
 * One filter toggle row. An option that would lead to zero results is disabled,
 * unless it's already selected (it must stay clickable so it can be turned off).
 */
function OptionRow({
  label,
  count,
  selected,
  onToggle,
  tagClassName,
}: {
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
  /** Render the label in a readiness tag's shape, so the filter matches the tags on the cards. */
  tagClassName?: string;
}) {
  const disabled = !selected && count === 0;
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className="flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm transition-colors enabled:hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
    >
      <span
        aria-hidden="true"
        className={`size-3.5 shrink-0 border ${selected ? "border-forest bg-forest" : disabled ? "border-border" : "border-foreground"}`}
      />
      {tagClassName ? (
        <span className={`label px-2 py-1 ${tagClassName} ${disabled ? "opacity-50" : ""}`}>{label}</span>
      ) : (
        <span className={selected ? "font-semibold" : undefined}>{label}</span>
      )}
      <span className="label ml-auto text-muted">{count}</span>
    </button>
  );
}

/** The fieldset's legend (it must be the fieldset's first child), plus an optional Clear action pinned to its row. */
function GroupHeading({
  children,
  onClear,
  clearLabel,
}: {
  children: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
}) {
  return (
    <>
      <legend className="label px-4 pt-4 pb-2">{children}</legend>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="label absolute top-0 right-0 flex h-11 items-center px-4 text-forest underline-offset-4 hover:underline"
        >
          Clear
        </button>
      )}
    </>
  );
}

export default function FilterBar({
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  categoryCounts,
  selectedSupportLevels,
  onToggleSupportLevel,
  onClearSupportLevels,
  supportLevels,
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
      <div className="border-b border-border px-4 py-3 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="filter-panel"
          onClick={() => setIsOpen(true)}
          className="label inline-flex min-h-11 items-stretch border border-foreground"
        >
          <span className="flex items-center gap-2 px-3">
            <BiFilterAlt aria-hidden="true" className="h-4 w-4" />
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="flex items-center bg-forest px-2.5 text-forest-foreground">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={close} aria-hidden="true" />}

      {/* Below lg this is an off-canvas drawer: hidden (and out of the tab order) while closed,
          a modal dialog while open. At lg and up it's the sheet's left column, sticky at full height. */}
      <div
        ref={panelRef}
        id="filter-panel"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? true : undefined}
        aria-label={isOpen ? "Filters" : undefined}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-background duration-200 lg:visible lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:transition-none ${
          // Visibility only transitions on close (so the slide-out still plays); on open it must flip
          // immediately or the close button can't take focus.
          isOpen ? "visible translate-x-0 transition-[translate]" : "invisible -translate-x-full transition-[translate,visibility]"
        }`}
      >
        <div className="flex min-h-14 items-center justify-between border-b border-border pl-4 lg:hidden">
          <p className="label">Filters</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="flex h-14 w-14 items-center justify-center border-l border-border transition-colors hover:bg-surface"
          >
            <BiX aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-border px-4 pt-3 pb-4">
            <label htmlFor="example-search" className="label mb-2 block">
              Search
            </label>
            <div className="relative w-full">
              <BiSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="example-search"
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="has(), subgrid, anchor…"
                className="w-full border border-foreground bg-paper py-2 pr-3 pl-9 text-base placeholder:text-muted"
              />
            </div>
          </div>

          <fieldset className="relative border-b border-border pb-2">
            <GroupHeading>New examples</GroupHeading>
            <OptionRow label="Show new only" count={newCount} selected={newOnly} onToggle={() => onNewOnlyChange(!newOnly)} />
          </fieldset>

          <fieldset className="relative border-b border-border pb-2">
            <GroupHeading
              onClear={selectedCategories.size > 0 ? onClearCategories : undefined}
              clearLabel="Clear categories"
            >
              Category
            </GroupHeading>
            {CATEGORIES.map((category) => (
              <OptionRow
                key={category.value}
                label={category.label}
                count={categoryCounts[category.value] ?? 0}
                selected={selectedCategories.has(category.value)}
                onToggle={() => onToggleCategory(category.value)}
              />
            ))}
          </fieldset>

          <fieldset aria-describedby="support-level-help" className="relative pb-2">
            <GroupHeading
              onClear={selectedSupportLevels.size > 0 ? onClearSupportLevels : undefined}
              clearLabel="Clear browser support"
            >
              Browser support
            </GroupHeading>
            <p id="support-level-help" className="px-4 pb-2 text-xs leading-relaxed text-muted">
              Production ready means full support in Chrome, Edge, Firefox and Safari, on browsers used by at least{" "}
              {PRODUCTION_READY_MIN_USAGE}% of people. A dashed browser chip means partial support.
            </p>
            {supportLevels.map((level) => (
              <OptionRow
                key={level.value}
                label={level.label}
                count={supportLevelCounts[level.value] ?? 0}
                selected={selectedSupportLevels.has(level.value)}
                onToggle={() => onToggleSupportLevel(level.value)}
                tagClassName={SUPPORT_LEVEL_STYLES[level.value]}
              />
            ))}
          </fieldset>
        </div>

        {/* Filters apply live behind the drawer; this footer shows the result and closes it. */}
        <div className="sticky bottom-0 mt-auto flex items-center gap-3 border-t border-border bg-background px-4 py-3 lg:hidden">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="label inline-flex min-h-11 items-center text-forest underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={close}
            className="label ml-auto inline-flex min-h-11 items-stretch bg-forest text-forest-foreground"
          >
            <span className="flex items-center px-3">
              {resultCount === 0 ? "No examples to show" : `Show ${resultCount} example${resultCount === 1 ? "" : "s"}`}
            </span>
            <span aria-hidden="true" className="flex w-10 items-center justify-center border-l border-forest-foreground/40">
              <BiRightArrowAlt className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
