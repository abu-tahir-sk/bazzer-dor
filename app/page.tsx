import { Suspense } from "react";
import Banner from "./components/banner";
import ProductSections from "./components/product-sections";
import { getProducts } from "./lib/products";
import { ProductGridSkeleton } from "./components/product-skeleton";

async function ProductListing() {
  const products = await getProducts();
  return <ProductSections products={products} />;
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12">
      <Banner />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListing />
      </Suspense>
    </main>sxdedjqwie90123 euiw9ejijr q-0oek    ]edcm90eewcm9m,wq0-399kccc eiocewjc32i8c  239olpl[p3L ,MV4IOFKLS OIFSE-329CMVVMA'EKFPMKEER RIFJIEKCI9R3RC  ]
  );
}