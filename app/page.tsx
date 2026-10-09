import { Suspense } from "react";
import Banner from "./components/banner";
import ProductSections from "./components/product-sections";
import { getProducts } from "./lib/products";

async function ProductListing() {
  const products = await getProducts();
  return <ProductSections products={products} />;
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12">
      <Banner />
      <Suspense
        fallback={
          <div aria-live="polite" className="py-8 text-center text-sm text-bazaar-muted">
            পণ্যের তথ্য লোড হচ্ছে…
          </div>
        }
      >
        <ProductListing />
      </Suspense>
    </main>
  );
}