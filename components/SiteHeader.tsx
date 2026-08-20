import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { formatDate } from "@/lib/formatDate";

const GITHUB_URL = "https://github.com/sorknes/css-features";
const MARQUEE_REPEATS = 8;

export default function SiteHeader({
  current,
  lastUpdated,
}: {
  current: "gallery" | "about";
  lastUpdated: string | null;
}) {
  const marqueeItems = [
    "New and emerging CSS, crawled from specs, browser blogs, and expert writeups",
    ...(lastUpdated ? [`Last updated ${formatDate(lastUpdated)}`] : []),
  ];

  return (
    <header className="static border-b border-border bg-background/95 backdrop-blur lg:sticky lg:top-0 lg:z-10">
      <div className="overflow-hidden whitespace-nowrap bg-accent py-1.5">
        <div className="inline-flex animate-[marquee_80s_linear_infinite] items-center">
          {Array.from({ length: MARQUEE_REPEATS }).flatMap((_, r) =>
            marqueeItems.map((item, i) => (
              <span key={`${r}-${i}`} className="inline-flex shrink-0 items-center">
                <span aria-hidden={r === 0 ? undefined : true} className="px-4 text-xs text-accent-foreground">
                  {item}
                </span>
                <span aria-hidden="true" className="text-accent-foreground/50">
                  •
                </span>
              </span>
            )),
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:px-6">
        <h1 className="text-xs font-semibold tracking-tight sm:text-sm">Modern CSS Features v. 2</h1>
        <nav aria-label="Site" className="flex items-center justify-self-center gap-4 text-xs font-medium sm:text-sm">
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
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 justify-self-end text-xs text-muted transition-colors hover:text-foreground sm:text-sm"
        >
          <BiLogoGithub aria-hidden="true" className="h-4 w-4" />
          GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
