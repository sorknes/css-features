"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BiChevronDown, BiRightArrowAlt } from "react-icons/bi";
import type { Category, CssExample } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { getLatestCrawledDate, isNewExample } from "@/lib/isNew";
import { getSupportLevel, SUPPORT_LEVELS, type SupportLevel } from "@/lib/supportLevel";
import FilterBar from "@/components/FilterBar";
import ExampleCard from "@/components/ExampleCard";
import SiteFooter from "@/components/SiteFooter";
import BackToTopButton from "@/components/BackToTopButton";

type SortBy = "newest" | "title";

const CATEGORY_VALUES = new Set<string>(CATEGORIES.map((c) => c.value));

function listParam(params: URLSearchParams, key: string, allowed: Set<string>) {
  return (params.get(key) ?? "").split(",").filter((value) => allowed.has(value));
}

export default function Gallery({ examples }: { examples: CssExample[] }) {
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<Set<SupportLevel>>(new Set());
  const [newOnly, setNewOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [restoredFromUrl, setRestoredFromUrl] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const previousParams = useRef<string | null>(null);

  const latestCrawledDate = useMemo(() => getLatestCrawledDate(examples), [examples]);

  // Support levels with no examples at all (e.g. no experimental features right now)
  // would only ever be a disabled "0" row, so they're left out of the filters.
  const availableSupportLevels = useMemo(
    () => SUPPORT_LEVELS.filter((level) => examples.some((example) => getSupportLevel(example) === level.value)),
    [examples],
  );

  // The page is statically rendered, so filters from a shared URL can only be
  // read after hydration. Read them once, then keep the URL in sync below.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- syncing from the URL, an external source */
    setSelectedCategories(new Set(listParam(params, "category", CATEGORY_VALUES) as Category[]));
    const supportLevelValues = new Set<string>(availableSupportLevels.map((l) => l.value));
    setSelectedSupportLevels(new Set(listParam(params, "support", supportLevelValues) as SupportLevel[]));
    setNewOnly(params.get("new") === "1");
    setSearch(params.get("q") ?? "");
    setSortBy(params.get("sort") === "title" ? "title" : "newest");
    setRestoredFromUrl(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [availableSupportLevels]);

  useEffect(() => {
    if (!restoredFromUrl) return;
    document.documentElement.removeAttribute("data-restoring-filters");
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (selectedCategories.size) params.set("category", [...selectedCategories].join(","));
    if (selectedSupportLevels.size) params.set("support", [...selectedSupportLevels].join(","));
    if (newOnly) params.set("new", "1");
    if (sortBy !== "newest") params.set("sort", sortBy);
    const next = params.toString().replaceAll("%2C", ",");
    if (next === previousParams.current) return;

    window.history.replaceState(null, "", `${next ? `?${next}` : window.location.pathname}${window.location.hash}`);

    // When the results change while the reader is scrolled down, bring them back
    // to the top of the list so the new results aren't changing off-screen.
    const results = resultsRef.current;
    if (previousParams.current !== null && results && results.getBoundingClientRect().top < 0) {
      results.scrollIntoView({ block: "start" });
    }
    previousParams.current = next;
  }, [restoredFromUrl, search, selectedCategories, selectedSupportLevels, newOnly, sortBy]);

  const activeFilterCount =
    selectedCategories.size + selectedSupportLevels.size + (newOnly ? 1 : 0) + (search.trim() ? 1 : 0);

  function clearAllFilters() {
    setSelectedCategories(new Set());
    setSelectedSupportLevels(new Set());
    setNewOnly(false);
    setSearch("");
  }

  function toggleCategory(category: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function toggleSupportLevel(level: SupportLevel) {
    setSelectedSupportLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }

  const query = search.trim().toLowerCase();

  function matchesQuery(example: CssExample) {
    if (!query) return true;
    const categoryLabel = CATEGORIES.find((c) => c.value === example.category)?.label ?? "";
    const haystack = [
      example.title,
      example.description,
      example.cssFeature,
      example.sourceName,
      categoryLabel,
      example.tailwindEquivalent ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  }

  const filtered = useMemo(() => {
    return examples
      .filter((example) => selectedCategories.size === 0 || selectedCategories.has(example.category))
      .filter(
        (example) =>
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example)),
      )
      .filter((example) => !newOnly || isNewExample(example.crawledDate, latestCrawledDate))
      .filter(matchesQuery)
      .sort((a, b) =>
        sortBy === "title" ? a.title.localeCompare(b.title) : a.crawledDate < b.crawledDate ? 1 : -1,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examples, selectedCategories, selectedSupportLevels, newOnly, query, sortBy, latestCrawledDate]);

  // Counts per facet are computed against the OTHER active filters (but not the
  // facet's own selection), so a category count still reflects what selecting it
  // would show even while a support-level filter is already applied, and vice versa.
  const categoryCounts = useMemo(() => {
    const base = examples
      .filter(
        (example) =>
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example)),
      )
      .filter((example) => !newOnly || isNewExample(example.crawledDate, latestCrawledDate))
      .filter(matchesQuery);
    const counts = {} as Record<Category, number>;
    for (const example of base) {
      counts[example.category] = (counts[example.category] ?? 0) + 1;
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examples, selectedSupportLevels, newOnly, query, latestCrawledDate]);

  const supportLevelCounts = useMemo(() => {
    const base = examples
      .filter((example) => selectedCategories.size === 0 || selectedCategories.has(example.category))
      .filter((example) => !newOnly || isNewExample(example.crawledDate, latestCrawledDate))
      .filter(matchesQuery);
    const counts = {} as Record<SupportLevel, number>;
    for (const example of base) {
      const level = getSupportLevel(example);
      counts[level] = (counts[level] ?? 0) + 1;
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examples, selectedCategories, newOnly, query, latestCrawledDate]);

  const newCount = useMemo(() => {
    return examples
      .filter((example) => selectedCategories.size === 0 || selectedCategories.has(example.category))
      .filter(
        (example) =>
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example)),
      )
      .filter(matchesQuery)
      .filter((example) => isNewExample(example.crawledDate, latestCrawledDate)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examples, selectedCategories, selectedSupportLevels, query, latestCrawledDate]);

  return (
    <div className="lg:flex lg:items-start">
      <FilterBar
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClearCategories={() => setSelectedCategories(new Set())}
        categoryCounts={categoryCounts}
        selectedSupportLevels={selectedSupportLevels}
        onToggleSupportLevel={toggleSupportLevel}
        onClearSupportLevels={() => setSelectedSupportLevels(new Set())}
        supportLevels={availableSupportLevels}
        supportLevelCounts={supportLevelCounts}
        newOnly={newOnly}
        onNewOnlyChange={setNewOnly}
        newCount={newCount}
        search={search}
        onSearchChange={setSearch}
        activeFilterCount={activeFilterCount}
        onClearAll={clearAllFilters}
        resultCount={filtered.length}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          data-gallery-results
          ref={resultsRef}
          className="flex scroll-mt-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-1.5 sm:px-6"
        >
          <div className="flex flex-wrap items-center gap-x-4">
            <p aria-live="polite" className="label">
              Showing {filtered.length} <span className="text-muted">of {examples.length}</span>
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="label relative text-forest underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          <label className="label flex min-h-11 items-center gap-2 text-muted">
            Sort
            <span className="relative inline-flex">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="label appearance-none border border-foreground bg-paper py-1.5 pr-8 pl-2 text-foreground"
              >
                <option value="newest">Newest</option>
                <option value="title">Title (A–Z)</option>
              </select>
              <BiChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-foreground"
              />
            </span>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-5 border-b border-border px-4 py-16 sm:px-6">
            <div className="flex max-w-xl flex-col gap-2">
              <p className="font-display text-3xl leading-[1.05] text-balance">
                {search.trim() ? <>No examples match “{search.trim()}”</> : "No examples match these filters"}
                {search.trim() && activeFilterCount > 1 && " with these filters"}
              </p>
              <p className="text-muted">
                {search.trim()
                  ? "Search looks at titles, descriptions, feature names, categories and sources. Try a shorter term or a property name."
                  : "Remove a filter to see more examples."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {search.trim() && activeFilterCount > 1 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="label inline-flex min-h-11 items-center border border-foreground px-4 transition-colors hover:bg-surface"
                >
                  Clear search
                </button>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="label inline-flex min-h-11 items-stretch bg-forest text-forest-foreground"
              >
                <span className="flex items-center px-4">
                  {activeFilterCount > 1 ? "Clear all filters" : search.trim() ? "Clear search" : "Clear filter"}
                </span>
                <span aria-hidden="true" className="flex w-10 items-center justify-center border-l border-forest-foreground/40">
                  <BiRightArrowAlt className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div data-gallery-results className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((example) => (
              <ExampleCard key={example.id} example={example} latestCrawledDate={latestCrawledDate} />
            ))}
          </div>
        )}

        <SiteFooter />
      </div>

      <BackToTopButton />
    </div>
  );
}
