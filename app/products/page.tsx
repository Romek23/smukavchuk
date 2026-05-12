export default function ProductsPage() {
  const productGroups = [
    {
      name: "Wall art",
      description:
        "One-of-a-kind epoxy compositions with layered color, texture, and gloss.",
    },
    {
      name: "Interior objects",
      description:
        "Decorative pieces for shelves, tables, and studio-style interiors.",
    },
    {
      name: "Custom commissions",
      description:
        "Made-to-order work based on dimensions, palette, and finish preferences.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-14 lg:px-12">
      <p className="theme-color text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
        Collection
      </p>
      <h1 className="theme-color mt-4 text-4xl font-semibold leading-tight tracking-normal text-[var(--color-ink)] sm:text-5xl">
        Products
      </h1>
      <p className="theme-color mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-[17px]">
        Selected handmade epoxy pieces and custom work are available on request.
        For current availability, dimensions, and pricing, contact the studio.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {productGroups.map((group) => (
          <article
            className="theme-color rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-5"
            key={group.name}
          >
            <h2 className="theme-color text-lg font-semibold text-[var(--color-ink)]">
              {group.name}
            </h2>
            <p className="theme-color mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {group.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
