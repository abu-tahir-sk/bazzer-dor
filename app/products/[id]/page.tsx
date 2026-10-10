import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../../lib/auth";
import {
  formatBengaliNumber,
  formatBengaliPercentage,
  getProductById,
  productUnitLabels,
} from "../../lib/products";

export const instant = false;

async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?error=protected");
  }

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  const direction =
    product.change.dir === "up"
      ? "দাম বেড়েছে"
      : product.change.dir === "down"
        ? "দাম কমেছে"
        : "দামের পরিবর্তন নেই";
  const indicator =
    product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12">
      <article className="mx-auto my-6 max-w-4xl rounded-2xl border border-bazaar-border bg-white p-5 shadow-sm sm:p-8">
        <Link className="mb-6 inline-flex items-center text-sm font-semibold text-bazaar-green no-underline hover:text-bazaar-green-dark" href="/#সব-পণ্য">
          ← সব পণ্যে ফিরে যান
        </Link>

        <header className="flex items-center gap-4 border-b border-[#edf1ed] pb-5">
          <span aria-hidden="true" className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#f2f8f2] text-4xl sm:size-20 sm:text-5xl">
            {product.image}
          </span>
          <div>
            <p className="mb-1 text-xs font-semibold text-bazaar-muted">
              {product.categoryIcon} {product.categoryNameBn}
            </p>
            <h1 className="m-0 text-2xl font-extrabold text-[#203d2b] sm:text-3xl">{product.nameBn}</h1>
            <p className="mt-1 mb-0 text-sm text-bazaar-muted">{productUnitLabels[product.unit]}</p>
          </div>
        </header>

        <section aria-label="আজকের পণ্যের দাম" className="my-5 flex flex-wrap items-end justify-between gap-3 rounded-xl bg-[#f4faf4] p-4 sm:p-5">
          <div>
            <span className="block text-xs text-bazaar-muted">আজকের দাম</span>
            <strong className="mt-1 block text-2xl font-extrabold text-[#203d2b]">{formatBengaliNumber(product.today)} টাকা</strong>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold ${product.change.dir === "up" ? "bg-[#e8f6ed] text-[#16834e]" : product.change.dir === "down" ? "bg-[#fff0ef] text-[#d9433e]" : "bg-[#f0f2f1] text-[#68756d]"}`}>
            {indicator} {formatBengaliPercentage(Math.abs(product.change.pct))}%
            <span> · {direction}</span>
          </span>
        </section>

        <section className="border-b border-[#edf1ed] py-4">
          <h2 className="mb-3 text-lg font-bold text-[#25372c]">দামের তুলনা</h2>
          <dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-[#f8faf8] p-3">
              <dt className="text-xs text-bazaar-muted">গতকাল</dt>
              <dd className="mt-1 mb-0 font-bold">{formatBengaliNumber(product.yesterday)} টাকা</dd>
            </div>
            <div className="rounded-lg bg-[#f8faf8] p-3">
              <dt className="text-xs text-bazaar-muted">গত সপ্তাহ</dt>
              <dd className="mt-1 mb-0 font-bold">{formatBengaliNumber(product.lastWeek)} টাকা</dd>
            </div>
            <div className="rounded-lg bg-[#f8faf8] p-3">
              <dt className="text-xs text-bazaar-muted">গত মাস</dt>
              <dd className="mt-1 mb-0 font-bold">{formatBengaliNumber(product.lastMonth)} টাকা</dd>
            </div>
          </dl>
        </section>

        <section className="pt-5">
          <h2 className="mb-3 text-lg font-bold text-[#25372c]">বাজারভিত্তিক দাম</h2>
          <div className="overflow-x-auto rounded-lg border border-bazaar-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-[#f4f8f4] text-xs text-[#53635a]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold" scope="col">বাজার</th>
                  <th className="px-3 py-2.5 font-semibold" scope="col">বিভাগ</th>
                  <th className="px-3 py-2.5 font-semibold" scope="col">সর্বনিম্ন</th>
                  <th className="px-3 py-2.5 font-semibold" scope="col">সর্বোচ্চ</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((market) => (
                  <tr key={`${market.division}-${market.market}`}>
                    <td className="border-t border-[#edf1ed] px-3 py-2.5">{market.market}</td>
                    <td className="border-t border-[#edf1ed] px-3 py-2.5">{market.division}</td>
                    <td className="border-t border-[#edf1ed] px-3 py-2.5">{formatBengaliNumber(market.min)} টাকা</td>
                    <td className="border-t border-[#edf1ed] px-3 py-2.5">{formatBengaliNumber(market.max)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </main>
  );
}

export default function ProductDetailPage({
  params,
}: PageProps<"/products/[id]">) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 pb-12">
          <p className="py-8 text-center text-sm text-bazaar-muted">পণ্যের তথ্য লোড হচ্ছে…</p>
        </main>
      }
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}
