export default function ProductsPage() {
  return (
    <main className="mx-auto flex min-h-[58vh] w-full max-w-7xl items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
      <div className="max-w-2xl">
        <p className="theme-color text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Products
        </p>
        <h1 className="theme-color mt-4 text-4xl font-semibold leading-tight tracking-normal text-[var(--color-ink)] sm:text-5xl lg:text-[56px]">
          Coming soon
        </h1>
        <p className="theme-color mt-5 max-w-xl text-base leading-7 text-[var(--color-muted)] sm:text-[17px]">
          The product collection is being prepared and will be available here
          soon.
        </p>
      </div>
    </main>
  );
}
