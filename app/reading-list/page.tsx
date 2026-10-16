import type { Metadata } from "next";
import { BiLinkExternal } from "react-icons/bi";
import examplesData from "@/data/examples.json";
import readingListData from "@/data/reading-list.json";
import type { CssExample, ReadingListItem } from "@/lib/types";
import { getLatestCrawledDate } from "@/lib/isNew";
import { formatDate } from "@/lib/formatDate";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SheetPage from "@/components/SheetPage";

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
      <SheetPage title="Reading list">
        <div className="px-4 py-10 sm:px-6 lg:px-10">
          <p className="max-w-2xl text-base leading-relaxed">
            Not every good CSS writeup discovered by this site&rsquo;s crawler is about a{" "}
            <em>new</em> feature &mdash; some are well-written pieces on properties that have
            been around for years. Rather than discard those, they land here instead of in the
            gallery.
          </p>
        </div>
        <ul className="divide-y divide-border">
          {readingList.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-6 px-4 py-6 transition-colors hover:bg-surface sm:px-6 lg:px-10"
              >
                <div className="flex max-w-2xl flex-col gap-1.5">
                  <p className="font-display text-xl leading-tight group-hover:text-forest">{item.title}</p>
                  <p className="text-sm leading-relaxed">{item.note}</p>
                  <p className="label mt-1 text-muted">
                    {item.sourceName}
                    {item.publishedDate ? ` · ${formatDate(item.publishedDate)}` : ""}
                  </p>
                </div>
                <BiLinkExternal
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-forest"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </SheetPage>
      <SiteFooter />
    </>
  );
}
