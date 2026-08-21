"use client";

import { useMemo, useState } from "react";
import type { Category, CssExample } from "@/lib/types";
import { getLatestCrawledDate, isNewExample } from "@/lib/isNew";
import { getSupportLevel, type SupportLevel } from "@/lib/supportLevel";
import FilterBar from "@/components/FilterBar";
import ExampleCard from "@/components/ExampleCard";
import SiteFooter from "@/components/SiteFooter";
import BackToTopButton from "@/components/BackToTopButton";

export default function Gallery({ examples }: { examples: CssExample[] }) {
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<Set<SupportLevel>>(new Set());
  const [newOnly, setNewOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");

  const latestCrawledDate = useMemo(() => getLatestCrawledDate(examples), [examples]);

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
      />

      <div aria-hidden="true" className="hidden lg:block lg:w-72 lg:shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-foreground">
            Showing {filtered.length} of {examples.length} example{examples.length === 1 ? "" : "s"}
          </p>
          <label className="flex items-center gap-2 text-sm text-foreground">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "title")}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <option value="newest">Newest</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            No examples match these filters. Try clearing a category or the search term.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
