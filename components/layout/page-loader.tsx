"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }

    if (removeTimer.current) {
      window.clearTimeout(removeTimer.current);
    }
  };

  useEffect(() => {
    const showLoader = (event: MouseEvent | PointerEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const target = event.target;
      const link = target instanceof Element ? target.closest("a") : null;

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      const linkTarget = link.getAttribute("target");

      if (!href || linkTarget === "_blank" || href.startsWith("#")) {
        return;
      }

      const url = new URL(href, window.location.href);

      if (url.origin !== window.location.origin || url.pathname === pathname) {
        return;
      }

      setIsLeaving(false);
      setIsVisible(true);
      clearTimers();

      removeTimer.current = window.setTimeout(() => {
        setIsLeaving(true);
        hideTimer.current = window.setTimeout(() => {
          setIsVisible(false);
        }, 260);
      }, 900);
    };

    document.addEventListener("pointerdown", showLoader);
    document.addEventListener("click", showLoader);

    return () => {
      document.removeEventListener("pointerdown", showLoader);
      document.removeEventListener("click", showLoader);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    clearTimers();

    removeTimer.current = window.setTimeout(() => {
      setIsLeaving(true);
    }, 320);

    hideTimer.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 580);

    return () => {
      clearTimers();
    };
  }, [isVisible, pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[80] grid place-items-center bg-[rgba(31,31,31,0.94)] backdrop-blur-sm ${
        isLeaving ? "animate-loader-out" : "animate-loader-in"
      }`}
      aria-label="Loading Smukavchuk Epoxid Art"
      role="status"
    >
      <div className="grid size-12 place-items-center rounded-full border border-white/12">
        <span className="block size-2.5 animate-loader-pulse rounded-full bg-[#f4f1ec]" />
      </div>
    </div>
  );
}
