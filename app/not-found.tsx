import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fce8e8] text-[#d9433e] mb-6">
        <Frown size={48} strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-extrabold text-[#25372c] mb-3">পেজ পাওয়া যায়নি</h1>
      <p className="text-base text-bazaar-muted mb-8 max-w-md mx-auto">
        আপনি যে পেজটি খুঁজছেন তা সম্ভবত মুছে ফেলা হয়েছে বা লিংকটি সঠিক নয়। অনুগ্রহ করে হোম পেজে ফিরে যান।
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-bazaar-green px-6 py-3 text-sm font-bold text-white no-underline hover:bg-bazaar-green-dark transition shadow-[0_3px_0_#d4e8da]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
