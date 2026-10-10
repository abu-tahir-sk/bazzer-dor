import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "../../lib/products";
import { CategoryClient } from "./category-client";
import { ProductGridSkeleton } from "../../components/product-skeleton";

// Mapping category slugs to their Bengali names and emojis for the title.
const categoryMeta: Record<string, { name: string; emoji: string }> = {
  "chal": { name: "চাল", emoji: "🍚" },
  "dal": { name: "ডাল", emoji: "🫘" },
  "tel": { name: "তেল", emoji: "🫙" },
  "sobji": { name: "সবজি", emoji: "🥬" },
  "mach": { name: "মাছ", emoji: "🐟" },
  "mangsho": { name: "মাংস", emoji: "🍗" },
  "dim-dui": { name: "ডিম ও দুধ", emoji: "🥚" },
  "mosla": { name: "মসলা", emoji: "🌶️" },
};

async function CategoryProducts({ slug }: { slug: string }) {
  try {
    const products = await getProductsByCategory(slug);
    const meta = categoryMeta[slug] || { name: "পণ্য", emoji: "🛍️" };

    if (products.length === 0) {
      return <CategoryClient products={[]} categoryName={meta.name} categoryIcon={meta.emoji} />;
    }

    // Overwrite meta with actual data from first product if available, as a fallback
    const actualMeta = {
      name: categoryMeta[slug] ? categoryMeta[slug].name : products[0].categoryNameBn,
      emoji: categoryMeta[slug] ? categoryMeta[slug].emoji : products[0].categoryIcon,
    };

    return <CategoryClient products={products} categoryName={actualMeta.name} categoryIcon={actualMeta.emoji} />;
  } catch (error) {
    // If API throws an error (e.g. invalid category slug leading to 404), show Empty State / 404
    const meta = categoryMeta[slug] || { name: "অজানা বিভাগ", emoji: "❓" };
    return <CategoryClient products={[]} categoryName={meta.name} categoryIcon={meta.emoji} />;
  }
}

async function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  
  return <CategoryProducts slug={slug} />;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <Suspense fallback={<ProductGridSkeleton />}>
        <CategoryContent params={params} />
      </Suspense>
    </main>
  );
}
