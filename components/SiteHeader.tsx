import Link from "next/link";
import { BiLogoGithub } from "react-icons/bi";
import { formatDate } from "@/lib/formatDate";
import Marquee from "@/components/Marquee";

const GITHUB_URL = "https://github.com/sorknes/css-features";

const NAV = [
  { key: "gallery", href: "/", label: "Gallery" },
  { key: "about", href: "/about", label: "About" },
  { key: "reading-list", href: "/reading-list", label: "Reading list" },
] as const;

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
    <header className="border-b border-border">
      {/* Mobile: wordmark | GitHub, then the nav as a full-width row of cells. sm+: one ruled band. */}
      <div className="flex flex-wrap items-stretch border-b border-border">
        <p className="flex min-h-14 items-center border-r border-border px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-display text-xl leading-none">
            <span aria-hidden="true" className="size-4 rounded-full bg-forest" />
            CSS Edge
          </Link>
        </p>

        <nav
          aria-label="Site"
          className="order-3 flex w-full border-t border-border sm:order-2 sm:w-auto sm:border-t-0"
        >
          {NAV.map((item) => {
            const isCurrent = current === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`label relative flex min-h-11 flex-1 items-center justify-center border-r border-border px-2 whitespace-nowrap transition-colors sm:px-5 last:border-r-0 sm:flex-none sm:last:border-r ${
                  isCurrent
                    ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-forest after:content-['']"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="label order-2 ml-auto flex min-h-14 items-center gap-2 border-l border-border px-4 text-muted transition-colors hover:bg-surface hover:text-foreground sm:order-3 sm:px-6"
        >
          <BiLogoGithub aria-hidden="true" className="h-4 w-4" />
          GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <Marquee items={marqueeItems} />
    </header>
  );
}
