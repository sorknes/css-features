import examplesData from "@/data/examples.json";
import type { CssExample } from "@/lib/types";
import Gallery from "@/components/Gallery";
import { getLatestCrawledDate } from "@/lib/isNew";
import SiteHeader from "@/components/SiteHeader";

const examples = examplesData as CssExample[];
const lastUpdated = getLatestCrawledDate(examples);

// The gallery is statically rendered unfiltered; filters in the URL are applied
// after hydration. This runs before the results are painted and hides them until
// Gallery applies the filters, so a shared filtered link doesn't flash all cards.
const hideResultsWhileRestoring = `if (/[?&](q|category|support|new|sort)=/.test(location.search)) document.documentElement.setAttribute("data-restoring-filters", "");`;

export default function Home() {
  return (
    <>
      <SiteHeader current="gallery" lastUpdated={lastUpdated} />
      <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
        <h1 className="sr-only">CSS Edge: new and emerging CSS features</h1>
        <script dangerouslySetInnerHTML={{ __html: hideResultsWhileRestoring }} />
        <Gallery examples={examples} />
      </main>
    </>
  );
}
