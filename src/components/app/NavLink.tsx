"use client";

import type { MouseEvent, ReactNode } from "react";
import { useVisit } from "./VisitProvider";

function isModifiedClick(e: MouseEvent<HTMLAnchorElement>) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

/** In-app <a>: works without JS, and does not reload the page when JS is on. */
export function NavLink({
  href,
  className,
  children,
  ariaCurrent,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  ariaCurrent?: "page" | undefined;
  ariaLabel?: string;
}) {
  const { go } = useVisit();
  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (isModifiedClick(e)) return;
        e.preventDefault();
        go(href);
      }}
    >
      {children}
    </a>
  );
}
