"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
const SUPPORT_LEVEL_VALUES = new Set<string>(SUPPORT_LEVELS.map((l) => l.value));

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

  // The page is statically rendered, so filters from a shared URL can only be
  // read after hydration. Read them once, then keep the URL in sync below.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- syncing from the URL, an external source */
    setSelectedCategories(new Set(listParam(params, "category", CATEGORY_VALUES) as Category[]));
    setSelectedSupportLevels(new Set(listParam(params, "support", SUPPORT_LEVEL_VALUES) as SupportLevel[]));
    setNewOnly(params.get("new") === "1");
    setSearch(params.get("q") ?? "");
    setSortBy(params.get("sort") === "title" ? "title" : "newest");
    setRestoredFromUrl(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

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
    const haystack = `${example.title} ${example.description} ${example.cssFeature} ${example.sourceName}`.toLowerCase();
    return haystack.includes(query);
  }

  const filtered = useMemo(() => {
    return examples
      .filter((example) => selectedCategories.size === 0 || selectedCategories.has(example.category))
      .filter(
        (example) =>
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example.browserSupport)),
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
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example.browserSupport)),
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
      const level = getSupportLevel(example.browserSupport);
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
          selectedSupportLevels.size === 0 || selectedSupportLevels.has(getSupportLevel(example.browserSupport)),
      )
      .filter(matchesQuery)
      .filter((example) => isNewExample(example.crawledDate, latestCrawledDate)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examples, selectedCategories, selectedSupportLevels, query, latestCrawledDate]);

  return (
    <div className="lg:flex lg:items-start lg:gap-8">
      <FilterBar
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClearCategories={() => setSelectedCategories(new Set())}
        categoryCounts={categoryCounts}
        selectedSupportLevels={selectedSupportLevels}
        onToggleSupportLevel={toggleSupportLevel}
        onClearSupportLevels={() => setSelectedSupportLevels(new Set())}
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

      <div aria-hidden="true" className="hidden lg:block lg:w-72 lg:shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div data-gallery-results ref={resultsRef} className="flex scroll-mt-4 flex-wrap items-center justify-between gap-x-3 lg:scroll-mt-28">
          <div className="flex flex-wrap items-center gap-x-3">
            <p aria-live="polite" className="text-sm text-foreground">
              Showing {filtered.length} of {examples.length} example{examples.length === 1 ? "" : "s"}
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="relative text-sm font-medium text-accent underline-offset-2 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <option value="newest">Newest</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border px-4 py-10 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-foreground">
                {search.trim() ? <>No examples match “{search.trim()}”</> : "No examples match these filters"}
                {search.trim() && activeFilterCount > 1 && " with these filters"}
              </p>
              <p className="text-sm text-muted">
                {search.trim()
                  ? "Search looks at titles, descriptions, feature names and sources. Try a shorter term or a property name."
                  : "Remove a filter to see more examples."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {search.trim() && activeFilterCount > 1 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border bg-paper px-4 text-sm font-medium hover:bg-surface"
                >
                  Clear search
                </button>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
              >
                {activeFilterCount > 1 ? "Clear all filters" : search.trim() ? "Clear search" : "Clear filter"}
              </button>
            </div>
          </div>
        ) : (
          <div data-gallery-results className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
