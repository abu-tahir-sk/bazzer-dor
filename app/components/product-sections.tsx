import Link from "next/link";
import {
  formatBengaliNumber,
  formatBengaliPercentage,
  productUnitLabels,
  type Product,
} from "../lib/products";

export function ProductCard({ product }: { product: Product }) {
  const directionLabel =
    product.change.dir === "up"
      ? "দাম বেড়েছে"
      : product.change.dir === "down"
        ? "দাম কমেছে"
        : "দাম অপরিবর্তিত";
  const changeIndicator =
    product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—";

  return (
    <Link
      aria-label={`${product.nameBn}, আজকের দাম ${formatBengaliNumber(product.today)} টাকা`}
      className="group flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-bazaar-border bg-white p-4 text-bazaar-ink no-underline shadow-[0_2px_10px_rgba(31,72,44,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b8d9c1] hover:shadow-[0_8px_22px_rgba(31,72,44,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bazaar-green"
      href={`/products/${product.id}`}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f2f8f2] text-3xl">
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="m-0 truncate text-base font-bold text-[#25372c] group-hover:text-bazaar-green">{product.nameBn}</h3>
          <p className="mt-1 mb-0 text-xs text-bazaar-muted">{productUnitLabels[product.unit]}</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 border-t border-[#edf1ed] pt-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] text-bazaar-muted">আজকের দাম</span>
          <strong className="text-base font-extrabold text-[#203d2b]">{formatBengaliNumber(product.today)} টাকা</strong>
        </div>
        <span
          aria-label={`${directionLabel} ${formatBengaliPercentage(Math.abs(product.change.pct))}%`}
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-bold ${product.change.dir === "up" ? "bg-[#e8f6ed] text-[#16834e]" : product.change.dir === "down" ? "bg-[#fff0ef] text-[#d9433e]" : "bg-[#f0f2f1] text-[#68756d]"}`}
        >
          {changeIndicator} {formatBengaliPercentage(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  products,
  direction,
  id,
  subtitle,
}: {
  title: string;
  products: Product[];
  direction?: "up" | "down";
  id?: string;
  subtitle?: string;
}) {
  return (
    <section
      aria-labelledby={`${id ?? direction}-title`}
      className="scroll-mt-5"
      id={id}
    >
      <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold text-[#25372c] sm:text-2xl" id={`${id ?? direction}-title`}>
        {direction && (
          <span
            aria-hidden="true"
            className={direction === "up" ? "text-sm text-bazaar-green" : "text-sm text-[#d9433e]"}
          >
            {direction === "up" ? "▲" : "▼"}
          </span>
        )}
        {title}
      </h2>
      {subtitle && <p className="mb-4 text-sm text-bazaar-muted">{subtitle}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function ProductSections({ products }: { products: Product[] }) {
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((left, right) => right.change.pct - left.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((left, right) => left.change.pct - right.change.pct)
    .slice(0, 6);

  return (
    <div className="space-y-8 py-5">
      <ProductSection direction="up" title="আজ দাম বেড়েছে" products={risers} />
      <ProductSection direction="down" title="আজ দাম কমেছে" products={fallers} />
      <ProductSection
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle={`মোট ${formatBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে`}
        products={products}
      />
    </div>
  );
}
