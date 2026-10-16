"use client";

import { useState } from "react";
import { BiPause, BiPlay } from "react-icons/bi";

const MARQUEE_REPEATS = 8;

export default function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="group relative flex items-center overflow-hidden whitespace-nowrap bg-accent">
      <div
        className={`inline-flex animate-[marquee_80s_linear_infinite] items-center py-1.5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] ${
          paused ? "[animation-play-state:paused]" : ""
        }`}
      >
        {Array.from({ length: MARQUEE_REPEATS }).flatMap((_, r) =>
          items.map((item, i) => (
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
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label="Pause scrolling announcements"
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center bg-accent text-accent-foreground shadow-[-12px_0_12px_var(--accent)] hover:text-accent-foreground/80 focus-visible:outline-accent-foreground focus-visible:outline-offset-[-3px]"
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
