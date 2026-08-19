import examplesData from "@/data/examples.json";
import type { CssExample } from "@/lib/types";
import Gallery from "@/components/Gallery";
import { getLatestCrawledDate } from "@/lib/isNew";
import SiteHeader from "@/components/SiteHeader";

const examples = examplesData as CssExample[];
const lastUpdated = getLatestCrawledDate(examples);

export default function Home() {
  return (
    <>
      <SiteHeader current="gallery" lastUpdated={lastUpdated} />
      <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
        <Gallery examples={examples} />
      </main>
    </>
  );
}
