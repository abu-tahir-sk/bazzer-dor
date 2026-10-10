"use client";

import { useState } from "react";
import Link from "next/link";
import { type Product } from "../../lib/products";
import { ProductCard } from "../../components/product-sections";

export function CategoryClient({ products, categoryName, categoryIcon }: { products: Product[], categoryName: string, categoryIcon: string }) {
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.today - b.today;
    if (sortOrder === "desc") return b.today - a.today;
    return 0; // default
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span aria-hidden="true" className="text-6xl mb-4">🤷‍♂️</span>
        <h2 className="text-2xl font-bold text-[#25372c]">দুঃখিত, কোনো পণ্য পাওয়া যায়নি</h2>
        <p className="mt-2 text-bazaar-muted mb-6">এই বিভাগে আপাতত কোনো পণ্য নেই।</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-bazaar-green px-5 py-2.5 text-sm font-bold text-white no-underline hover:bg-bazaar-green-dark">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edf1ed] pb-4">
        <h1 className="text-2xl font-extrabold text-[#25372c] flex items-center gap-2">
          <span aria-hidden="true" className="text-3xl">{categoryIcon}</span>
          {categoryName}
        </h1>
        
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-semibold text-[#48564d]">সাজান:</label>
          <div className="relative">
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "default" | "asc" | "desc")}
              className="appearance-none rounded-lg border border-bazaar-border bg-white px-3 py-1.5 pr-8 text-sm font-medium text-bazaar-ink focus:border-bazaar-green focus:outline-none focus:ring-1 focus:ring-bazaar-green"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-bazaar-muted">
              ▼
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
