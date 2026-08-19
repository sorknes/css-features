import Link from "next/link";
import { formatDate } from "@/lib/formatDate";

export default function SiteHeader({
  current,
  lastUpdated,
}: {
  current: "gallery" | "about";
  lastUpdated: string | null;
}) {
  return (
    <header className="static border-b border-border bg-background/95 backdrop-blur px-4 py-4 sm:px-6 lg:sticky lg:top-0 lg:z-10">
      {lastUpdated && (
        <p className="mb-1 text-xs text-muted lg:hidden">
          Last updated {formatDate(lastUpdated)}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-semibold tracking-tight sm:text-2xl lg:text-5xl">
            Modern CSS Features v. 2
          </h1>
          {lastUpdated && (
            <span className="hidden text-xs text-muted lg:inline">
              Last updated {formatDate(lastUpdated)}
            </span>
          )}
        </div>
        <nav aria-label="Site" className="flex shrink-0 items-center gap-4 text-xs font-medium sm:text-sm">
          <Link
            href="/"
            aria-current={current === "gallery" ? "page" : undefined}
            className={`underline-offset-2 transition-colors hover:underline ${
              current === "gallery" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            aria-current={current === "about" ? "page" : undefined}
            className={`underline-offset-2 transition-colors hover:underline ${
              current === "about" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            About
          </Link>
        </nav>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        New and emerging CSS, crawled from specs, browser blogs, and expert
        writeups &mdash; with live demos and browser support.
      </p>
    </header>
  );
}
