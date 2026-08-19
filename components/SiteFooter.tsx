import { BiLinkExternal } from "react-icons/bi";
import { SOURCES } from "@/lib/sources";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-6 sm:px-6">
      <p className="mb-2 text-sm font-medium">Resources we crawl</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {SOURCES.map((source) => (
          <li key={source.url} className="text-sm">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted underline-offset-2 hover:text-accent hover:underline"
            >
              {source.name}
              <BiLinkExternal aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
