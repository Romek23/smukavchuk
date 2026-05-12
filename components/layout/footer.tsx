import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.08)] bg-[var(--color-shell)] text-[var(--color-shell-text)] transition-colors duration-200 ease-out">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-20 shrink-0 place-items-center sm:size-24">
            <Image
              src="/logo.png"
              alt=""
              width={96}
              height={96}
              className="h-20 w-20 object-contain opacity-95 sm:h-24 sm:w-24"
            />
          </span>
          <div className="min-w-0">
            <p className="whitespace-nowrap font-[family-name:var(--font-geist-sans)] text-lg font-semibold leading-none tracking-[0.06em] text-[#ffffff]">
              Smukavchuk Epoxid Art
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#ffffff] opacity-70">
              Handcrafted epoxy surfaces, objects, and finishes with a calm studio sensibility.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 text-sm text-[#ffffff] sm:flex-row sm:items-center sm:gap-10">
          <nav className="flex items-center gap-7 font-medium text-[#ffffff]">
            <Link
              className="opacity-70 transition-opacity duration-200 ease-out hover:opacity-100"
              href="/"
            >
              Gallery
            </Link>
            <Link
              className="opacity-70 transition-opacity duration-200 ease-out hover:opacity-100"
              href="/products"
            >
              Products
            </Link>
          </nav>
          <p className="text-[#ffffff] opacity-70">Contact: hello@smukavchuk.art</p>
        </div>
      </div>
    </footer>
  );
}
