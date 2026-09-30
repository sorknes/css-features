import type { Metadata } from "next";
import { BiLinkExternal } from "react-icons/bi";
import examplesData from "@/data/examples.json";
import readingListData from "@/data/reading-list.json";
import type { CssExample, ReadingListItem } from "@/lib/types";
import { getLatestCrawledDate } from "@/lib/isNew";
import { formatDate } from "@/lib/formatDate";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Reading List — CSS Edge",
  description:
    "CSS writeups worth reading that didn't fit the gallery's new/emerging premise, kept here instead of being discarded.",
};

const examples = examplesData as CssExample[];
const lastUpdated = getLatestCrawledDate(examples);
const readingList = readingListData as ReadingListItem[];

export default function ReadingListPage() {
  return (
    <>
      <SiteHeader current="reading-list" lastUpdated={lastUpdated} />
      <main id="main-content" className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Reading list</h2>
            <p className="text-base text-foreground/90">
              Not every good CSS writeup discovered by this site&rsquo;s crawler is about a{" "}
              <em>new</em> feature &mdash; some are well-written pieces on properties that have
              been around for years. Rather than discard those, they land here instead of in the
              gallery.
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
            {readingList.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 p-4 transition-colors hover:bg-foreground/5"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-foreground group-hover:text-accent">
                      {item.title}
                    </p>
                    <p className="text-sm text-foreground/90">{item.note}</p>
                    <p className="text-xs text-muted">
                      {item.sourceName}
                      {item.publishedDate ? ` · ${formatDate(item.publishedDate)}` : ""}
                    </p>
                  </div>
                  <BiLinkExternal
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-accent"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
