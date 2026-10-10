const API_BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

export type PriceDirection = "up" | "down" | "flat";
export type ProductUnit = "kg" | "litre" | "dozen" | "piece";

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  image: string;
  unit: ProductUnit;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: PriceDirection;
    pct: number;
  };
  markets: Array<{
    market: string;
    division: string;
    min: number;
    max: number;
  }>;
};

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Partial<Product>;
  return (
    typeof product.id === "number" &&
    typeof product.slug === "string" &&
    typeof product.nameBn === "string" &&
    typeof product.category === "string" &&
    typeof product.categoryNameBn === "string" &&
    typeof product.categoryIcon === "string" &&
    typeof product.image === "string" &&
    ["kg", "litre", "dozen", "piece"].includes(product.unit ?? "") &&
    typeof product.today === "number" &&
    typeof product.yesterday === "number" &&
    typeof product.lastWeek === "number" &&
    typeof product.lastMonth === "number" &&
    typeof product.change?.pct === "number" &&
    typeof product.change.dir === "string" &&
    ["up", "down", "flat"].includes(product.change.dir) &&
    Array.isArray(product.markets) &&
    product.markets.every(
      (market) =>
        typeof market.market === "string" &&
        typeof market.division === "string" &&
        typeof market.min === "number" &&
        typeof market.max === "number",
    )
  );
}

async function fetchProductResponse(url: string): Promise<unknown> {
  // Using cache to avoid rate limits (revalidate every 60 seconds)
  const response = await fetch(url, { next: { revalidate: 60 } });

  if (!response.ok) {
    if (response.status === 429) {
      console.warn(`Rate limit exceeded (429) for ${url}. Returning empty data.`);
      return [];
    }
    throw new Error(`Product API request failed (${response.status}): ${url}`);
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const data = await fetchProductResponse(`${API_BASE_URL}/products`);

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Product API returned an invalid product list.");
  }

  return data;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const url = `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`;
  const data = await fetchProductResponse(url);

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Product API returned an invalid product list for category.");
  }

  return data;
}

export async function getProductById(id: number): Promise<Product | null> {
  const url = `${API_BASE_URL}/products/${encodeURIComponent(id)}`;

  // Using cache to avoid rate limits (revalidate every 60 seconds)
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (response.status === 404) {
    return null;
  }
  if (response.status === 429) {
    console.warn(`Rate limit exceeded (429) for ${url}. Returning null.`);
    return null;
  }
  if (!response.ok) {
    throw new Error(`Product API request failed (${response.status}): ${url}`);
  }

  const data: unknown = await response.json();
  if (!isProduct(data)) {
    throw new Error("Product API returned an invalid product detail.");
  }

  return data;
}

export const productUnitLabels: Record<ProductUnit, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

export const formatBengaliNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD").format(value);

export const formatBengaliPercentage = (value: number) =>
  new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
