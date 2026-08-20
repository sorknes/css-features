"use client";

import { useEffect, useState } from "react";
import { BiUpArrowAlt } from "react-icons/bi";

const SHOW_AFTER_PX = 400;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-6 bottom-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black bg-accent text-accent-foreground shadow-lg transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <BiUpArrowAlt aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
