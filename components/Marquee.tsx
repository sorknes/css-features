"use client";

import { useState } from "react";
import { BiPause, BiPlay } from "react-icons/bi";

const MARQUEE_REPEATS = 8;

export default function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="group relative flex items-center overflow-hidden whitespace-nowrap">
      <div
        className={`inline-flex animate-[marquee_80s_linear_infinite] items-center py-2.5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        {Array.from({ length: MARQUEE_REPEATS }).flatMap((_, r) =>
          items.map((item, i) => (
            <span key={`${r}-${i}`} className="inline-flex shrink-0 items-center">
              <span aria-hidden={r === 0 ? undefined : true} className="label px-5 text-foreground">
                {item}
              </span>
              <span aria-hidden="true" className="size-2 rounded-full bg-forest" />
            </span>
          )),
        )}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Play scrolling announcements" : "Pause scrolling announcements"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l border-border bg-background text-foreground shadow-[-16px_0_16px_var(--background)] transition-colors hover:bg-surface focus-visible:outline-offset-[-3px]"
      >
        {paused ? (
          <BiPlay aria-hidden="true" className="h-4 w-4" />
        ) : (
          <BiPause aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
