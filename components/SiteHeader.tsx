import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { formatDate } from "@/lib/formatDate";
import Marquee from "@/components/Marquee";

const GITHUB_URL = "https://github.com/sorknes/css-features";
/** Expands the tap target to 44px tall without changing the link's visual size. */
const HIT_AREA = "relative after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']";

export default function SiteHeader({
  current,
  lastUpdated,
}: {
  current: "gallery" | "about" | "reading-list";
  lastUpdated: string | null;
}) {
  const marqueeItems = [
    "New and emerging CSS, crawled from specs, browser blogs, and expert writeups",
    "Almost entirely built by Claude Code",
    ...(lastUpdated ? [`Last updated ${formatDate(lastUpdated)}`] : []),
  ];

  return (
    <header className="static border-b border-border bg-background/95 backdrop-blur lg:sticky lg:top-0 lg:z-10">
      <Marquee items={marqueeItems} />

      <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
        <p className="text-base font-bold tracking-tight whitespace-nowrap">
          <Link href="/" className={`${HIT_AREA} underline-offset-2 hover:underline`}>
            CSS Edge
          </Link>
        </p>
        <nav
          aria-label="Site"
          className="col-span-2 row-start-2 flex items-center gap-4 text-base font-medium sm:col-span-1 sm:row-start-auto sm:justify-self-center"
        >
          <Link
            href="/"
            aria-current={current === "gallery" ? "page" : undefined}
            className={`${HIT_AREA} underline-offset-2 transition-colors hover:underline ${
              current === "gallery" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Gallery
          </Link>
          <Link
            href="/about"
            aria-current={current === "about" ? "page" : undefined}
            className={`${HIT_AREA} underline-offset-2 transition-colors hover:underline ${
              current === "about" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            About
          </Link>
          <Link
            href="/reading-list"
            aria-current={current === "reading-list" ? "page" : undefined}
            className={`${HIT_AREA} underline-offset-2 transition-colors hover:underline ${
              current === "reading-list" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Reading List
          </Link>
        </nav>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${HIT_AREA} flex items-center gap-1.5 justify-self-end text-xs text-muted transition-colors hover:text-foreground sm:text-sm`}
        >
          <BiLogoGithub aria-hidden="true" className="h-4 w-4" />
          GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
