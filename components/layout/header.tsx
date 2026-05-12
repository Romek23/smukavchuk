import Image from "next/image";
import Link from "next/link";
import HeaderNav from "@/components/layout/header-nav";
import ThemeToggle from "@/components/layout/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.08)] bg-[var(--color-shell)] text-[var(--color-shell-text)] transition-colors duration-200 ease-out">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-6 py-3 sm:px-10 sm:py-4 lg:px-12">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Smukavchuk Epoxid Art home"
        >
          <span className="grid size-20 shrink-0 place-items-center sm:size-24">
            <Image
              src="/logo.png"
              alt=""
              width={96}
              height={96}
              className="h-20 w-20 object-contain opacity-95 sm:h-24 sm:w-24"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap font-[family-name:var(--font-geist-sans)] text-base font-semibold leading-none tracking-[0.06em] text-[#ffffff] sm:text-lg">
              Smukavchuk
            </span>
            <span className="mt-1.5 block whitespace-nowrap font-[family-name:var(--font-geist-sans)] text-xs font-light leading-none tracking-[0.06em] text-[#ffffff] opacity-70 sm:text-sm">
              Epoxid Art
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <HeaderNav />
          <ThemeToggle />
          <Link
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-[#ffffff] opacity-75 transition duration-200 ease-out hover:border-white/30 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            href="/admin"
            aria-label="Open admin login"
            title="Admin login"
          >
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 20a7 7 0 0 0-14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
