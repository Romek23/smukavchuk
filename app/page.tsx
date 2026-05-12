import GalleryGrid from "@/components/gallery/gallery-grid";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-14 lg:px-12">
      <div className="mb-10 max-w-3xl sm:mb-12">
        <p className="theme-color text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Smukavchuk Epoxid Art
        </p>
        <h1 className="theme-color mt-4 text-4xl font-semibold leading-tight tracking-normal text-[var(--color-ink)] sm:text-5xl lg:text-[56px]">
          Gallery
        </h1>
        <p className="theme-color mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-[17px]">
          A curated look at handcrafted epoxy pieces, textures, and finishes.
        </p>
      </div>
      <GalleryGrid />
    </div>
  );
}
