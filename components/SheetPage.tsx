import type { ReactNode } from "react";

/**
 * Reading pages (About, Reading list) on the same ruled sheet as the gallery:
 * a left rail carrying the forest disc and the page title, and a body column
 * of ruled cells.
 */
export default function SheetPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="main-content" className="flex-1 lg:flex lg:items-stretch">
      <div className="border-b border-border px-4 py-10 sm:px-6 lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-end gap-6 lg:sticky lg:top-10 lg:block">
          <span aria-hidden="true" className="block size-20 shrink-0 rounded-full bg-forest sm:size-24 lg:size-36" />
          <h1 className="font-display text-5xl leading-[0.92] lg:mt-10 lg:text-[2.75rem]">{title}</h1>
        </div>
      </div>
      <div className="min-w-0 flex-1 divide-y divide-border">{children}</div>
    </main>
  );
}
